// ── Netlify Function: contact ─────────────────────
// POST JSON desde /contacto/ y /ca/contacte/.
// Valida + anti-spam (honeypot + timing) y envía
// vía SMTP de Gmail/Workspace con App Password.

const nodemailer = require('nodemailer');

const MAX_LEN = {
  nombre: 100,
  email: 120,
  empresa: 120,
  servicio: 40,
  mensaje: 3000
};

const SERVICIO_LABELS = {
  'power-bi': 'Formación Power BI',
  'ia-aplicada': 'Formación IA Aplicada',
  'ia-agentica': 'Implantación IA Agéntica',
  'desarrollo': 'Desarrollo a medida',
  'otro': 'Otro / no lo tiene claro'
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
  // El campo `website` está oculto a humanos; si llega con
  // contenido, casi con certeza es un bot. Respondemos 200
  // para no darle pistas al atacante.
  if (data.website && String(data.website).trim() !== '') {
    return json(200, { ok: true });
  }

  // ─── Anti-spam: timing ──────────────────────────
  // Bots habituales envían el formulario en <2s desde que
  // se renderiza. Humanos tardan más.
  const renderedAt = Number(data.renderedAt);
  if (renderedAt && Date.now() - renderedAt < 2000) {
    return json(200, { ok: true });
  }

  // ─── Validación ────────────────────────────────
  const errors = [];
  const nombre = String(data.nombre || '').trim().slice(0, MAX_LEN.nombre);
  const email = String(data.email || '').trim().slice(0, MAX_LEN.email);
  const empresa = String(data.empresa || '').trim().slice(0, MAX_LEN.empresa);
  const servicio = String(data.servicio || '').trim().slice(0, MAX_LEN.servicio);
  const mensaje = String(data.mensaje || '').trim().slice(0, MAX_LEN.mensaje);
  const consent = data.consent === true;
  const lang = data.lang === 'ca' ? 'ca' : 'es';

  if (!nombre) errors.push('nombre');
  if (!email || !EMAIL_RE.test(email)) errors.push('email');
  if (!empresa) errors.push('empresa');
  if (!servicio || !SERVICIO_LABELS[servicio]) errors.push('servicio');
  if (!mensaje || mensaje.length < 10) errors.push('mensaje');
  if (!consent) errors.push('consent');

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

  const servicioLabel = SERVICIO_LABELS[servicio];
  const subject = `[aimtech.es] ${servicioLabel} — ${empresa}`;

  const textBody = [
    `Nueva consulta desde aimtech.es (${lang.toUpperCase()})`,
    ``,
    `Nombre:    ${nombre}`,
    `Email:     ${email}`,
    `Empresa:   ${empresa}`,
    `Servicio:  ${servicioLabel}`,
    ``,
    `Mensaje:`,
    mensaje,
    ``,
    `─────────────────────────`,
    `Origen: aimtech.es · ${new Date().toISOString()}`
  ].join('\n');

  const htmlBody = `
<div style="font-family:-apple-system,system-ui,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
  <p style="font-size:13px;color:#888;margin:0 0 24px;letter-spacing:0.04em;">NUEVA CONSULTA · AIMTECH.ES (${lang.toUpperCase()})</p>
  <h2 style="font-size:20px;margin:0 0 24px;color:#0a0e14;">${escapeHtml(servicioLabel)} — ${escapeHtml(empresa)}</h2>

  <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <tr><td style="padding:8px 0;color:#666;width:90px;font-size:13px;">Nombre</td><td style="padding:8px 0;font-size:14px;"><strong>${escapeHtml(nombre)}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#666;font-size:13px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:#2580e3;text-decoration:none;">${escapeHtml(email)}</a></td></tr>
    <tr><td style="padding:8px 0;color:#666;font-size:13px;">Empresa</td><td style="padding:8px 0;font-size:14px;">${escapeHtml(empresa)}</td></tr>
    <tr><td style="padding:8px 0;color:#666;font-size:13px;">Servicio</td><td style="padding:8px 0;font-size:14px;">${escapeHtml(servicioLabel)}</td></tr>
  </table>

  <div style="background:#f5f5f5;border-left:3px solid #2580e3;padding:16px 20px;border-radius:4px;">
    <p style="font-size:11px;color:#888;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em;">Mensaje</p>
    <div style="font-size:14px;line-height:1.6;white-space:pre-wrap;color:#1a1a1a;">${escapeHtml(mensaje)}</div>
  </div>

  <p style="font-size:11px;color:#aaa;margin:24px 0 0;border-top:1px solid #eee;padding-top:16px;">
    Origen: aimtech.es · ${new Date().toISOString()}
  </p>
</div>`;

  try {
    await transporter.sendMail({
      from: `"Aimtech web" <${MAIL_FROM}>`,
      to: MAIL_TO,
      replyTo: `"${nombre}" <${email}>`,
      subject,
      text: textBody,
      html: htmlBody
    });
  } catch (err) {
    console.error('SMTP send failed:', err.message);
    return json(502, { error: 'Mail delivery failed' });
  }

  return json(200, { ok: true });
};
