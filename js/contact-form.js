// ── Contact form ─────────────────────────────────
// Envía el payload a /.netlify/functions/contact.
// Anti-spam: honeypot invisible + check de tiempo mínimo.

(function () {
  const form = document.getElementById('form');
  if (!form || !form.classList.contains('contact-form')) return;

  const lang = form.dataset.lang === 'ca' ? 'ca' : 'es';
  const renderedAt = Date.now();

  const t = lang === 'ca' ? {
    sending: 'Enviant…',
    send: 'Enviar consulta',
    required: 'Cal omplir aquest camp.',
    emailInvalid: 'Format de correu no vàlid.',
    consent: 'Cal acceptar la política de privacitat.',
    network: 'No s\'ha pogut enviar. Comprova la connexió i torna-ho a provar.',
    server: 'Hi ha hagut un problema al servidor. Escriu-nos directament a miguelperez@aimtech.es si persisteix.'
  } : {
    sending: 'Enviando…',
    send: 'Enviar consulta',
    required: 'Este campo es obligatorio.',
    emailInvalid: 'Formato de email no válido.',
    consent: 'Debes aceptar la política de privacidad.',
    network: 'No se pudo enviar. Comprueba la conexión e inténtalo de nuevo.',
    server: 'Ha habido un problema en el servidor. Escríbeme directamente a miguelperez@aimtech.es si persiste.'
  };

  const status = document.getElementById('formStatus');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  const btnLabel = submitBtn.querySelector('.btn-label');

  function setStatus(msg) {
    if (!msg) {
      status.textContent = '';
      status.classList.remove('is-error');
      return;
    }
    status.textContent = msg;
    status.classList.add('is-error');
  }

  function clearFieldError(field) {
    const existing = field.parentElement.querySelector('.field-error');
    if (existing) existing.remove();
    field.style.borderColor = '';
  }

  function showFieldError(field, msg) {
    clearFieldError(field);
    const err = document.createElement('span');
    err.className = 'field-error';
    err.textContent = msg;
    field.parentElement.appendChild(err);
    field.style.borderColor = 'var(--accent-warm)';
  }

  // Limpia el error al volver a escribir
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => clearFieldError(el));
    el.addEventListener('change', () => clearFieldError(el));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('');

    const data = {
      nombre: form.nombre.value.trim(),
      email: form.email.value.trim(),
      empresa: form.empresa.value.trim(),
      servicio: form.servicio.value,
      mensaje: form.mensaje.value.trim(),
      consent: form.consent.checked,
      website: form.website.value,           // honeypot
      renderedAt,                            // timestamp de render
      lang
    };

    // Validación cliente
    let firstInvalid = null;
    [['nombre','nombre'],['email','email'],['empresa','empresa'],['servicio','servicio'],['mensaje','mensaje']].forEach(([key, name]) => {
      const field = form[name];
      if (!data[key]) {
        showFieldError(field, t.required);
        if (!firstInvalid) firstInvalid = field;
      }
    });
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showFieldError(form.email, t.emailInvalid);
      if (!firstInvalid) firstInvalid = form.email;
    }
    if (!data.consent) {
      showFieldError(form.consent, t.consent);
      if (!firstInvalid) firstInvalid = form.consent;
    }
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // UI de envío
    submitBtn.disabled = true;
    btnLabel.textContent = t.sending;

    try {
      const res = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        form.classList.add('is-submitted');
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        let detail = '';
        try { detail = (await res.json()).error || ''; } catch (_) {}
        setStatus(detail || t.server);
        submitBtn.disabled = false;
        btnLabel.textContent = t.send;
      }
    } catch (err) {
      setStatus(t.network);
      submitBtn.disabled = false;
      btnLabel.textContent = t.send;
    }
  });
})();
