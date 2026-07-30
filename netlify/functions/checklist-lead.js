// Netlify Function: Checklist IA lead capture.
// Persists a structured lead in Google Sheets when configured, sends an
// internal notification, and emails the requested PDF link to the lead.

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const RESOURCE_URL = 'https://www.aimtech.es/recursos/aimtech_checklist_ia.pdf';
// Dedicated spreadsheet for this lead magnet. LEADS_SPREADSHEET_ID can
// override it per environment; never fall back to the training feedback file.
const DEFAULT_LEADS_SPREADSHEET_ID = '1uFKJGVRagXGLoULlGm9VX0pStzWHgvcqlOTQ-egzYQI';
const SHEET_TAB = 'Leads Checklist IA';
const SHEET_HEADER = [
  'Fecha', 'Nombre', 'Email', 'Empresa', 'Tamaño', 'Facturación aproximada',
  'Autoriza comunicaciones', 'UTM source', 'UTM medium', 'UTM campaign',
  'UTM content', 'Referrer', 'Página', 'Idioma'
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIZES = new Set(['', '1', '2-10', '11-50', '51-250', '251-plus']);
const REVENUE = new Set(['menos-250k', '250k-1m', '1m-5m', '5m-20m', 'mas-20m', 'no-indica']);
const SIZE_LABELS = {
  '': 'No indicado', '1': 'Solo / autónomo', '2-10': '2–10',
  '11-50': '11–50', '51-250': '51–250', '251-plus': 'Más de 250'
};
const REVENUE_LABELS = {
  'menos-250k': 'Menos de 250.000 €', '250k-1m': '250.000 € – 1 M€',
  '1m-5m': '1–5 M€', '5m-20m': '5–20 M€', 'mas-20m': 'Más de 20 M€',
  'no-indica': 'Prefiere no indicarlo'
};

function clean(value, max) {
  return String(value || '').trim().slice(0, max);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify(body)
  };
}

async function getSheetsToken(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const b64 = (object) => Buffer.from(JSON.stringify(object)).toString('base64url');
  const unsigned = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  });
  const signature = crypto.createSign('RSA-SHA256')
    .update(unsigned).sign(privateKey).toString('base64url');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') +
      '&assertion=' + unsigned + '.' + signature
  });
  if (!response.ok) throw new Error(`token ${response.status}: ${await response.text()}`);
  return (await response.json()).access_token;
}

async function appendSheetRow({ spreadsheetId, token, row }) {
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const range = encodeURIComponent(`'${SHEET_TAB}'!A1`);
  const appendUrl = `${base}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const append = () => fetch(appendUrl, {
    method: 'POST', headers, body: JSON.stringify({ values: [row] })
  });

  let response = await append();
  if (response.status === 400) {
    const create = await fetch(`${base}:batchUpdate`, {
      method: 'POST', headers,
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: SHEET_TAB } } }] })
    });
    if (!create.ok && create.status !== 400) {
      throw new Error(`create sheet ${create.status}: ${await create.text()}`);
    }
    const headerResponse = await fetch(`${base}/values/${range}?valueInputOption=RAW`, {
      method: 'PUT', headers, body: JSON.stringify({ values: [SHEET_HEADER] })
    });
    if (!headerResponse.ok) throw new Error(`header ${headerResponse.status}: ${await headerResponse.text()}`);
    response = await append();
  }
  if (!response.ok) throw new Error(`append ${response.status}: ${await response.text()}`);
}

function makeTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 587, secure: false, auth: { user, pass }
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  let input;
  try { input = JSON.parse(event.body || '{}'); }
  catch (_) { return json(400, { error: 'Invalid JSON' }); }

  // Honeypot and timing checks deliberately return 200 to avoid teaching bots.
  if (clean(input.website, 200)) return json(200, { ok: true, emailSent: false });
  const renderedAt = Number(input.renderedAt);
  if (renderedAt && Date.now() - renderedAt < 2000) {
    return json(200, { ok: true, emailSent: false });
  }

  const lead = {
    nombre: clean(input.nombre, 100),
    email: clean(input.email, 120).toLowerCase(),
    empresa: clean(input.empresa, 120),
    tamano: clean(input.tamano, 20),
    facturacion: clean(input.facturacion, 30),
    consentMarketing: input.consentMarketing,
    utmSource: clean(input.utmSource, 160),
    utmMedium: clean(input.utmMedium, 160),
    utmCampaign: clean(input.utmCampaign, 160),
    utmContent: clean(input.utmContent, 160),
    referrer: clean(input.referrer, 500),
    pageUrl: clean(input.pageUrl, 500),
    lang: input.lang === 'ca' ? 'ca' : 'es'
  };

  const errors = [];
  if (lead.nombre.length < 2) errors.push('nombre');
  if (!EMAIL_RE.test(lead.email)) errors.push('email');
  if (!SIZES.has(lead.tamano)) errors.push('tamano');
  if (!REVENUE.has(lead.facturacion)) errors.push('facturacion');
  if (typeof lead.consentMarketing !== 'boolean') errors.push('consentMarketing');
  if (errors.length) return json(400, { error: 'Validation failed', fields: errors });

  const timestamp = new Date();
  const madridDate = timestamp.toLocaleString('sv-SE', { timeZone: 'Europe/Madrid' });
  const consentLabel = lead.consentMarketing ? 'SÍ' : 'NO';

  const GS_ID = clean(process.env.LEADS_SPREADSHEET_ID || DEFAULT_LEADS_SPREADSHEET_ID, 200);
  const GS_EMAIL = clean(process.env.GSHEETS_CLIENT_EMAIL, 240);
  const GS_KEY = String(process.env.GSHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
  let sheetOk = false;
  if (GS_ID && GS_EMAIL && GS_KEY) {
    try {
      const token = await getSheetsToken(GS_EMAIL, GS_KEY);
      await appendSheetRow({
        spreadsheetId: GS_ID,
        token,
        row: [
          madridDate, lead.nombre, lead.email, lead.empresa,
          SIZE_LABELS[lead.tamano], REVENUE_LABELS[lead.facturacion], consentLabel,
          lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.utmContent,
          lead.referrer, lead.pageUrl, lead.lang.toUpperCase()
        ]
      });
      sheetOk = true;
    } catch (error) {
      console.error('Checklist lead Sheets append failed:', error.message);
    }
  }

  const transporter = makeTransport();
  let internalMailOk = false;
  let userMailOk = false;
  if (transporter) {
    const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER;
    const toAddress = process.env.MAIL_TO || process.env.SMTP_USER;
    const source = [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(' / ') || 'Directo / no identificado';

    const internalText = [
      'Nuevo lead — Checklist IA sin humo', '',
      `Nombre: ${lead.nombre}`, `Email: ${lead.email}`,
      `Empresa: ${lead.empresa || '(no indicada)'}`,
      `Tamaño: ${SIZE_LABELS[lead.tamano]}`,
      `Facturación: ${REVENUE_LABELS[lead.facturacion]}`,
      `Autoriza comunicaciones: ${consentLabel}`, `Origen: ${source}`,
      `Guardado en Sheets: ${sheetOk ? 'sí' : 'no'}`, '',
      `Página: ${lead.pageUrl || '(sin dato)'}`, `Fecha: ${timestamp.toISOString()}`
    ].join('\n');

    const internalHtml = `
<div style="font-family:-apple-system,system-ui,'Segoe UI',sans-serif;max-width:580px;margin:0 auto;color:#172033;">
  <p style="font-size:12px;color:#2580e3;letter-spacing:.08em;text-transform:uppercase;">Nuevo lead · Checklist IA</p>
  <h2 style="margin:0 0 22px;">${escapeHtml(lead.nombre)}${lead.empresa ? ` · ${escapeHtml(lead.empresa)}` : ''}</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:8px;color:#667085;">Email</td><td><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></td></tr>
    <tr><td style="padding:8px;color:#667085;">Tamaño</td><td>${escapeHtml(SIZE_LABELS[lead.tamano])}</td></tr>
    <tr><td style="padding:8px;color:#667085;">Facturación</td><td>${escapeHtml(REVENUE_LABELS[lead.facturacion])}</td></tr>
    <tr><td style="padding:8px;color:#667085;">Comunicaciones</td><td><strong>${consentLabel}</strong></td></tr>
    <tr><td style="padding:8px;color:#667085;">Origen</td><td>${escapeHtml(source)}</td></tr>
    <tr><td style="padding:8px;color:#667085;">Google Sheets</td><td>${sheetOk ? 'Guardado' : 'No guardado'}</td></tr>
  </table>
</div>`;

    const userText = [
      `Hola ${lead.nombre},`, '',
      'Aquí tienes la Checklist IA sin humo que has solicitado:',
      RESOURCE_URL, '',
      'En 30 minutos podrás detectar procesos candidatos, priorizar impacto y esfuerzo y definir una primera hipótesis de piloto medible.', '',
      'Un saludo,', 'Mike · Aimtech Consulting', 'https://www.aimtech.es'
    ].join('\n');

    const userHtml = `
<div style="font-family:-apple-system,system-ui,'Segoe UI',sans-serif;max-width:580px;margin:0 auto;color:#172033;line-height:1.65;">
  <p style="font-size:12px;color:#2580e3;letter-spacing:.08em;text-transform:uppercase;">Aimtech · IA aplicada sin humo</p>
  <h1 style="font-size:28px;line-height:1.15;margin:0 0 20px;">Tu checklist ya está lista.</h1>
  <p>Hola ${escapeHtml(lead.nombre)},</p>
  <p>Aquí tienes la <strong>Checklist IA sin humo</strong> que has solicitado: 13 páginas para detectar procesos candidatos, priorizar impacto y esfuerzo y definir un primer piloto medible.</p>
  <p style="margin:28px 0;"><a href="${RESOURCE_URL}" style="display:inline-block;background:#2580e3;color:#fff;text-decoration:none;padding:13px 20px;border-radius:7px;font-weight:700;">Descargar checklist PDF</a></p>
  <p style="font-size:13px;color:#667085;">Si el botón no funciona, copia esta URL:<br><a href="${RESOURCE_URL}">${RESOURCE_URL}</a></p>
  <p style="margin-top:30px;">Un saludo,<br><strong>Mike · Aimtech Consulting</strong><br><a href="https://www.aimtech.es">aimtech.es</a></p>
  ${lead.consentMarketing ? '<p style="font-size:11px;color:#98a2b3;border-top:1px solid #eee;padding-top:16px;">Has autorizado recibir contenidos relacionados de Aimtech. Puedes retirar el consentimiento respondiendo a este email.</p>' : ''}
</div>`;

    const [internalResult, userResult] = await Promise.allSettled([
      transporter.sendMail({
        from: `"Aimtech web" <${fromAddress}>`, to: toAddress,
        replyTo: `"${lead.nombre}" <${lead.email}>`,
        subject: `[aimtech.es] Nuevo lead Checklist IA — ${lead.nombre}`,
        text: internalText, html: internalHtml
      }),
      transporter.sendMail({
        from: `"Aimtech" <${fromAddress}>`, to: lead.email,
        subject: 'Tu Checklist IA sin humo — Aimtech',
        text: userText, html: userHtml
      })
    ]);
    internalMailOk = internalResult.status === 'fulfilled';
    userMailOk = userResult.status === 'fulfilled';
    if (!internalMailOk) console.error('Checklist internal email failed:', internalResult.reason && internalResult.reason.message);
    if (!userMailOk) console.error('Checklist delivery email failed:', userResult.reason && userResult.reason.message);
  }

  // A lead is considered captured if it reached Sheets or the internal inbox.
  if (!sheetOk && !internalMailOk) {
    console.error('Checklist lead capture failed in every configured destination');
    return json(502, { error: 'Lead capture failed' });
  }

  return json(200, { ok: true, emailSent: userMailOk });
};

// Export pure helpers for local tests without invoking external services.
exports._private = { clean, escapeHtml, SIZE_LABELS, REVENUE_LABELS, SIZES, REVENUE };
