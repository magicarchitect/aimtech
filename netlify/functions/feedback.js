// ── Netlify Function: feedback ────────────────────
// POST JSON desde /feedback/ y /ca/feedback/.
// Encuesta de calidad de la formación: valida (nombre y
// email opcionales — respuesta anónima permitida), aplica
// anti-spam (honeypot + timing) y envía el resultado vía
// SMTP de Gmail/Workspace con App Password.

const nodemailer = require('nodemailer');

const MAX_LEN = {
  nombre: 100,
  email: 120,
  mejoras: 2000,
  testimonio: 1500
};

const FORMACION_LABELS = {
  'powerbi-basico': 'Power BI: de básico a intermedio',
  'powerbi-avanzado': 'Power BI: nivel avanzado',
  'ia-aplicada': 'Formación en IA aplicada'
};

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
  if (email && !EMAIL_RE.test(email)) errors.push('email');
  // El testimonio solo se acepta firmado (nombre) y con autorización explícita
  if (testimonio && (!nombre || !consentTestimonio)) errors.push('testimonio');

  if (errors.length) {
    return json(400, { error: 'Validation failed', fields: errors });
  }

  // ─── Config SMTP ───────────────────────────────
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const MAIL_TO = process.env.MAIL_TO || SMTP_USER;
  const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER;

  if (!SMTP_USER || !SMTP_PASS) {
    console.error('Missing SMTP credentials in environment');
    return json(500, { error: 'Server misconfigured' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  const formacionLabel = FORMACION_LABELS[formacion];
  const media = (ratings.calidad + ratings.instructor + ratings.materiales) / 3;
  const mediaStr = media.toFixed(1).replace('.', ',');
  const quien = nombre || 'Anónimo';

  const subject = `[aimtech.es] Feedback formación — ${formacionLabel} · ${mediaStr}/5`;

  const textBody = [
    `Nueva respuesta de la encuesta de calidad (${lang.toUpperCase()})`,
    ``,
    `Formación:  ${formacionLabel}`,
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
  <h2 style="font-size:20px;margin:0 0 8px;color:#0a0e14;">${escapeHtml(formacionLabel)}</h2>
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
  } catch (err) {
    console.error('SMTP send failed:', err.message);
    return json(502, { error: 'Mail delivery failed' });
  }

  return json(200, { ok: true });
};
