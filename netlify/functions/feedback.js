// ── Netlify Function: feedback ────────────────────
// POST JSON desde /feedback/ y /ca/feedback/.
// Encuesta de calidad de la formación: valida (nombre y
// email opcionales — respuesta anónima permitida; empresa
// obligatoria), aplica anti-spam (honeypot + timing) y
// persiste la respuesta en dos destinos:
//   1) Google Sheet (una pestaña por formación) vía service
//      account — JWT firmado con crypto nativo, sin SDK.
//   2) Email de aviso vía SMTP de Gmail/Workspace.
// Responde 200 si al menos un destino funciona.
//
// Env vars:
//   SMTP_USER / SMTP_PASS / MAIL_TO / MAIL_FROM   (como contact)
//   GSHEETS_SPREADSHEET_ID  — id del spreadsheet (de su URL)
//   GSHEETS_CLIENT_EMAIL    — email del service account
//   GSHEETS_PRIVATE_KEY     — private key del service account
//                             (con \n literales o saltos reales)

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const MAX_LEN = {
  nombre: 100,
  email: 120,
  empresa: 120,
  mejoras: 2000,
  testimonio: 1500
};

const FORMACION_LABELS = {
  'powerbi-basico': 'Power BI: de básico a intermedio',
  'powerbi-avanzado': 'Power BI: nivel avanzado',
  'ia-aplicada': 'Formación en IA aplicada',
  'sql-fundamentos': 'Fundamentos de SQL'
};

// Nombre de la pestaña por formación (sin «:» para que un
// export a Excel no rompa — Excel lo prohíbe en nombres de hoja)
const SHEET_TABS = {
  'powerbi-basico': 'Power BI básico-intermedio',
  'powerbi-avanzado': 'Power BI avanzado',
  'ia-aplicada': 'IA aplicada',
  'sql-fundamentos': 'Fundamentos de SQL'
};

const SHEET_HEADER = [
  'Fecha', 'Empresa', 'Calidad formación', 'Conocimiento instructor',
  'Calidad materiales', 'Media', 'Qué mejoraría', 'Nombre', 'Email',
  'Testimonio', 'Autoriza publicación', 'Idioma'
];

const RATING_LABELS = {
  calidad: 'Calidad de la formación',
  instructor: 'Conocimiento del instructor',
  materiales: 'Calidad de los materiales'
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body)
  };
}

function stars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

// ─── Google Sheets (REST + JWT de service account) ───

async function getSheetsToken(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsigned =
    b64({ alg: 'RS256', typ: 'JWT' }) + '.' +
    b64({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600
    });
  const signature = crypto.createSign('RSA-SHA256')
    .update(unsigned)
    .sign(privateKey)
    .toString('base64url');

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') +
          '&assertion=' + unsigned + '.' + signature
  });
  if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`);
  return (await res.json()).access_token;
}

async function appendFeedbackRow({ spreadsheetId, token, tab, row }) {
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  // RAW (no USER_ENTERED): el texto libre del alumno nunca se
  // interpreta como fórmula → sin inyección tipo =IMPORTXML().
  const appendUrl = `${base}/values/${encodeURIComponent(`'${tab}'!A1`)}:append` +
    `?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const doAppend = () => fetch(appendUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ values: [row] })
  });

  let res = await doAppend();
  if (res.status === 400) {
    // La pestaña aún no existe: crearla con cabecera y reintentar
    await fetch(`${base}:batchUpdate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tab } } }] })
    });
    await fetch(`${base}/values/${encodeURIComponent(`'${tab}'!A1`)}?valueInputOption=RAW`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ values: [SHEET_HEADER] })
    });
    res = await doAppend();
  }
  if (!res.ok) throw new Error(`append ${res.status}: ${await res.text()}`);
}

// ─────────────────────────────────────────────────────

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch (_) {
    return json(400, { error: 'Invalid JSON' });
  }

  // ─── Anti-spam: honeypot ────────────────────────
  if (data.website && String(data.website).trim() !== '') {
    return json(200, { ok: true });
  }

  // ─── Anti-spam: timing ──────────────────────────
  const renderedAt = Number(data.renderedAt);
  if (renderedAt && Date.now() - renderedAt < 2000) {
    return json(200, { ok: true });
  }

  // ─── Validación ────────────────────────────────
  const errors = [];
  const formacion = String(data.formacion || '').trim();
  const empresa = String(data.empresa || '').trim().slice(0, MAX_LEN.empresa);
  const nombre = String(data.nombre || '').trim().slice(0, MAX_LEN.nombre);
  const email = String(data.email || '').trim().slice(0, MAX_LEN.email);
  const mejoras = String(data.mejoras || '').trim().slice(0, MAX_LEN.mejoras);
  const testimonio = String(data.testimonio || '').trim().slice(0, MAX_LEN.testimonio);
  const consentTestimonio = data.consentTestimonio === true;
  const lang = data.lang === 'ca' ? 'ca' : 'es';

  const ratings = {};
  for (const key of Object.keys(RATING_LABELS)) {
    const v = Number(data[key]);
    if (!Number.isInteger(v) || v < 1 || v > 5) errors.push(key);
    else ratings[key] = v;
  }

  if (!FORMACION_LABELS[formacion]) errors.push('formacion');
  if (!empresa) errors.push('empresa');
  if (email && !EMAIL_RE.test(email)) errors.push('email');
  // El testimonio solo se acepta firmado (nombre) y con autorización explícita
  if (testimonio && (!nombre || !consentTestimonio)) errors.push('testimonio');

  if (errors.length) {
    return json(400, { error: 'Validation failed', fields: errors });
  }

  // ─── Config de destinos ────────────────────────
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const MAIL_TO = process.env.MAIL_TO || SMTP_USER;
  const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER;
  const smtpConfigured = Boolean(SMTP_USER && SMTP_PASS);

  // trim: un espacio o salto de línea colado al pegar el valor en
  // Netlify acaba en la URL de la API y produce un 404 desconcertante
  const GS_ID = (process.env.GSHEETS_SPREADSHEET_ID || '').trim();
  const GS_EMAIL = (process.env.GSHEETS_CLIENT_EMAIL || '').trim();
  const GS_KEY = (process.env.GSHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
  const sheetsConfigured = Boolean(GS_ID && GS_EMAIL && GS_KEY);

  if (!smtpConfigured && !sheetsConfigured) {
    console.error('Missing SMTP and Google Sheets credentials in environment');
    return json(500, { error: 'Server misconfigured' });
  }

  const formacionLabel = FORMACION_LABELS[formacion];
  const media = (ratings.calidad + ratings.instructor + ratings.materiales) / 3;
  const mediaStr = media.toFixed(1).replace('.', ',');
  const quien = nombre || 'Anónimo';

  // ─── Destino 1: Google Sheet (una pestaña por formación) ───
  let sheetOk = false;
  if (sheetsConfigured) {
    try {
      const fecha = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Madrid' });
      const token = await getSheetsToken(GS_EMAIL, GS_KEY);
      await appendFeedbackRow({
        spreadsheetId: GS_ID,
        token,
        tab: SHEET_TABS[formacion],
        row: [
          fecha,
          empresa,
          ratings.calidad,
          ratings.instructor,
          ratings.materiales,
          Math.round(media * 100) / 100,
          mejoras,
          nombre,
          email,
          testimonio,
          testimonio ? 'SÍ' : '',
          lang.toUpperCase()
        ]
      });
      sheetOk = true;
    } catch (err) {
      // longitud del ID como pista: un ID válido ronda los 44 caracteres;
      // ~80+ delata que se pegó la URL completa en la variable
      console.error(`Sheets append failed (spreadsheetId: ${GS_ID.length} chars):`, err.message);
    }
  }

  // ─── Destino 2: email de aviso ────────────────
  let mailOk = false;
  if (smtpConfigured) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });

    const subject = `[aimtech.es] Feedback ${formacionLabel} — ${empresa} · ${mediaStr}/5`;

    const textBody = [
      `Nueva respuesta de la encuesta de calidad (${lang.toUpperCase()})`,
      ``,
      `Formación:  ${formacionLabel}`,
      `Empresa:    ${empresa}`,
      `Alumno:     ${quien}${email ? ` <${email}>` : ''}`,
      ``,
      `${RATING_LABELS.calidad}:      ${stars(ratings.calidad)} (${ratings.calidad}/5)`,
      `${RATING_LABELS.instructor}:  ${stars(ratings.instructor)} (${ratings.instructor}/5)`,
      `${RATING_LABELS.materiales}:    ${stars(ratings.materiales)} (${ratings.materiales}/5)`,
      `Media:                          ${mediaStr}/5`,
      ``,
      `Qué mejoraría:`,
      mejoras || '(sin respuesta)',
      ``,
      `Testimonio:`,
      testimonio || '(sin testimonio)',
      testimonio ? `Autoriza publicación con su nombre: SÍ (${nombre})` : '',
      ``,
      `Guardado en Google Sheets: ${sheetOk ? 'sí' : (sheetsConfigured ? 'FALLÓ — revisar logs' : 'no configurado')}`,
      `─────────────────────────`,
      `Origen: aimtech.es/feedback · ${new Date().toISOString()}`
    ].join('\n');

    const ratingRow = (label, v) => `
    <tr>
      <td style="padding:8px 0;color:#666;font-size:13px;">${escapeHtml(label)}</td>
      <td style="padding:8px 0;font-size:15px;letter-spacing:2px;color:#2580e3;">${stars(v)} <span style="color:#888;font-size:12px;letter-spacing:0;">(${v}/5)</span></td>
    </tr>`;

    const htmlBody = `
<div style="font-family:-apple-system,system-ui,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
  <p style="font-size:13px;color:#888;margin:0 0 24px;letter-spacing:0.04em;">FEEDBACK DE FORMACIÓN · AIMTECH.ES (${lang.toUpperCase()})</p>
  <h2 style="font-size:20px;margin:0 0 8px;color:#0a0e14;">${escapeHtml(formacionLabel)} — ${escapeHtml(empresa)}</h2>
  <p style="font-size:14px;color:#666;margin:0 0 24px;">${escapeHtml(quien)}${email ? ` · <a href="mailto:${escapeHtml(email)}" style="color:#2580e3;text-decoration:none;">${escapeHtml(email)}</a>` : ''} · media <strong>${mediaStr}/5</strong></p>

  <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    ${ratingRow(RATING_LABELS.calidad, ratings.calidad)}
    ${ratingRow(RATING_LABELS.instructor, ratings.instructor)}
    ${ratingRow(RATING_LABELS.materiales, ratings.materiales)}
  </table>

  <div style="background:#f5f5f5;border-left:3px solid #2580e3;padding:16px 20px;border-radius:4px;margin-bottom:16px;">
    <p style="font-size:11px;color:#888;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em;">Qué mejoraría</p>
    <div style="font-size:14px;line-height:1.6;white-space:pre-wrap;color:#1a1a1a;">${mejoras ? escapeHtml(mejoras) : '<em style="color:#999;">(sin respuesta)</em>'}</div>
  </div>

  ${testimonio ? `
  <div style="background:#eef5fd;border-left:3px solid #2580e3;padding:16px 20px;border-radius:4px;">
    <p style="font-size:11px;color:#888;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em;">Testimonio — autoriza publicación con su nombre</p>
    <div style="font-size:14px;line-height:1.6;white-space:pre-wrap;color:#1a1a1a;">${escapeHtml(testimonio)}</div>
    <p style="font-size:12px;color:#666;margin:10px 0 0;">— ${escapeHtml(nombre)}</p>
  </div>` : ''}

  <p style="font-size:11px;color:#aaa;margin:24px 0 0;border-top:1px solid #eee;padding-top:16px;">
    Google Sheets: ${sheetOk ? 'guardado' : (sheetsConfigured ? 'FALLÓ — revisar logs de la function' : 'no configurado')} ·
    Origen: aimtech.es/feedback · ${new Date().toISOString()}
  </p>
</div>`;

    const mail = {
      from: `"Aimtech web" <${MAIL_FROM}>`,
      to: MAIL_TO,
      subject,
      text: textBody,
      html: htmlBody
    };
    if (email) mail.replyTo = `"${quien}" <${email}>`;

    try {
      await transporter.sendMail(mail);
      mailOk = true;
    } catch (err) {
      console.error('SMTP send failed:', err.message);
    }
  }

  if (!sheetOk && !mailOk) {
    return json(502, { error: 'Delivery failed' });
  }
  return json(200, { ok: true });
};
