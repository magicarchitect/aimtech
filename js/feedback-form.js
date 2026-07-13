// ── Feedback form (encuesta de calidad) ──────────────────
// Wizard tipo Typeform: un paso por pantalla, transición
// vertical, auto-avance al seleccionar, atajos de teclado
// (A-C, 1-5, Enter) y paso de testimonio condicionado a que
// el alumno haya dejado su nombre.
// Envía el payload a /.netlify/functions/feedback.
// Anti-spam: honeypot invisible + check de tiempo mínimo.

(function () {
  'use strict';

  const form = document.getElementById('fbForm');
  if (!form) return;

  const lang = form.dataset.lang === 'ca' ? 'ca' : 'es';
  const renderedAt = Date.now();
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const t = lang === 'ca' ? {
    send: 'Enviar respostes',
    next: 'Continuar',
    sending: 'Enviant…',
    network: 'No s\'ha pogut enviar. Comprova la connexió i torna-ho a provar.',
    server: 'Hi ha hagut un problema al servidor. Escriu-nos a hola@aimtech.es si persisteix.'
  } : {
    send: 'Enviar respuestas',
    next: 'Continuar',
    sending: 'Enviando…',
    network: 'No se pudo enviar. Comprueba la conexión e inténtalo de nuevo.',
    server: 'Ha habido un problema en el servidor. Escríbenos a hola@aimtech.es si persiste.'
  };

  const steps = Array.from(form.querySelectorAll('.fb-step'));
  const bar = document.getElementById('fbBar');
  const count = document.getElementById('fbCount');
  const prevBtn = document.getElementById('fbPrev');
  const nextBtn = document.getElementById('fbNext');
  const finStep = steps.find(s => s.dataset.step === 'fin');

  let current = 0;       // índice absoluto en steps[]
  let sending = false;
  let done = false;
  let advanceTimer = null;

  function hasName() {
    return form.nombre.value.trim() !== '';
  }

  // Pasos navegables ahora mismo (el testimonio solo existe con nombre)
  function activeList() {
    return steps.filter(s => s.dataset.step !== 'testimonio' || hasName());
  }

  function currentStep() {
    return steps[current];
  }

  function focusStep(step) {
    const target = step.querySelector('input:checked')
      || step.querySelector('input:not([type="checkbox"]), textarea, button, a');
    if (target) target.focus({ preventScroll: true });
  }

  function updateChrome() {
    const list = activeList();
    const qList = list.filter(s => s.hasAttribute('data-progress'));
    const step = currentStep();
    const qi = qList.indexOf(step);

    if (done || step.dataset.step === 'fin') {
      bar.style.width = '100%';
      count.textContent = '';
    } else if (qi === -1) {
      bar.style.width = '0%';
      count.textContent = '';
    } else {
      bar.style.width = ((qi / qList.length) * 100) + '%';
      count.textContent = (qi + 1) + ' / ' + qList.length;
    }

    prevBtn.disabled = done || list.indexOf(step) <= 0;
    nextBtn.disabled = done || step.dataset.step === 'fin';
  }

  function goToStep(step) {
    const list = activeList();
    const idx = list.indexOf(step);
    if (idx === -1) return;

    if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null; }

    list.forEach((el, i) => {
      el.classList.toggle('is-active', i === idx);
      el.classList.toggle('is-above', i < idx);
    });
    steps.forEach(el => {
      if (!list.includes(el)) el.classList.remove('is-active', 'is-above');
      if (el === step) el.removeAttribute('inert');
      else el.setAttribute('inert', '');
    });

    current = steps.indexOf(step);
    updateChrome();
    setTimeout(() => focusStep(step), 120);
  }

  function showError(step) {
    step.classList.remove('has-error');
    void step.offsetWidth; // reflow: retrigger de la animación shake
    step.classList.add('has-error');
  }

  function clearError(step) {
    step.classList.remove('has-error');
  }

  function validate(step) {
    switch (step.dataset.step) {
      case 'formacion':
        return form.formacion.value !== '';
      case 'calidad':
      case 'instructor':
      case 'materiales':
        return form[step.dataset.step].value !== '';
      case 'identidad': {
        const email = form.email.value.trim();
        return email === '' || EMAIL_RE.test(email);
      }
      case 'testimonio':
        return form.testimonio.value.trim() === '' || form.consentTestimonio.checked;
      default:
        return true;
    }
  }

  function next() {
    if (sending || done) return;
    const step = currentStep();

    if (!validate(step)) {
      showError(step);
      return;
    }
    clearError(step);

    const kind = step.dataset.step;
    const isLastInput =
      kind === 'testimonio' || (kind === 'identidad' && !hasName());
    if (isLastInput) {
      submit();
      return;
    }

    const list = activeList();
    const idx = list.indexOf(step);
    if (idx > -1 && idx < list.length - 1 && list[idx + 1].dataset.step !== 'fin') {
      goToStep(list[idx + 1]);
    }
  }

  function prev() {
    if (sending || done) return;
    const list = activeList();
    const idx = list.indexOf(currentStep());
    if (idx > 0) goToStep(list[idx - 1]);
  }

  function setStatus(step, msg) {
    const status = step.querySelector('.fb-status');
    if (!status) return;
    status.textContent = msg || '';
    status.classList.toggle('is-error', Boolean(msg));
  }

  async function submit() {
    const step = currentStep();
    const btn = step.querySelector('.fb-btn');
    setStatus(step, '');
    sending = true;
    if (btn) { btn.disabled = true; btn.textContent = t.sending; }

    const data = {
      formacion: form.formacion.value,
      calidad: Number(form.calidad.value),
      instructor: Number(form.instructor.value),
      materiales: Number(form.materiales.value),
      mejoras: form.mejoras.value.trim(),
      nombre: form.nombre.value.trim(),
      email: form.email.value.trim(),
      testimonio: hasName() ? form.testimonio.value.trim() : '',
      consentTestimonio: hasName() && form.consentTestimonio.checked,
      website: form.website.value,   // honeypot
      renderedAt,                    // timestamp de render
      lang
    };

    try {
      const res = await fetch('/.netlify/functions/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        done = true;
        document.body.classList.add('is-done');
        goToStep(finStep);
      } else {
        setStatus(step, t.server);
      }
    } catch (err) {
      setStatus(step, t.network);
    } finally {
      sending = false;
      if (!done && btn) {
        btn.disabled = false;
        btn.textContent = identidadLabel(step);
      }
    }
  }

  // Etiqueta del botón según el paso: en identidad depende de si hay nombre
  function identidadLabel(step) {
    if (step.dataset.step === 'identidad') return hasName() ? t.next : t.send;
    return t.send;
  }

  // ── Auto-avance al seleccionar opción o estrellas ──
  form.addEventListener('change', (e) => {
    if (!e.target.matches('.fb-option input, .fb-star input')) return;
    clearError(currentStep());
    if (advanceTimer) clearTimeout(advanceTimer);
    const stepAtSchedule = currentStep();
    advanceTimer = setTimeout(() => {
      advanceTimer = null;
      if (currentStep() === stepAtSchedule) next();
    }, 450);
  });

  // ── Botones «Continuar / Enviar» de cada paso ──
  form.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => next());
  });
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', () => next());
  form.addEventListener('submit', (e) => e.preventDefault());

  // ── Paso identidad: etiqueta dinámica y recuento total ──
  const idBtn = steps.find(s => s.dataset.step === 'identidad').querySelector('.fb-btn');
  form.nombre.addEventListener('input', () => {
    idBtn.textContent = hasName() ? t.next : t.send;
    updateChrome();
  });
  form.email.addEventListener('input', () => clearError(currentStep()));
  form.testimonio.addEventListener('input', () => clearError(currentStep()));
  form.consentTestimonio.addEventListener('change', () => clearError(currentStep()));

  // ── Teclado: Enter avanza, A-C y 1-5 seleccionan ──
  document.addEventListener('keydown', (e) => {
    if (done || sending) return;
    const step = currentStep();
    const kind = step.dataset.step;

    if (e.key === 'Enter') {
      if (e.shiftKey && e.target.tagName === 'TEXTAREA') return; // salto de línea
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return; // su click ya gestiona
      e.preventDefault();
      next();
      return;
    }

    if (kind === 'formacion') {
      const i = ['a', 'b', 'c'].indexOf(e.key.toLowerCase());
      if (i > -1) selectRadio(form.formacion, i);
    } else if (kind === 'calidad' || kind === 'instructor' || kind === 'materiales') {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 5) selectRadio(form[kind], n - 1);
    }
  });

  function selectRadio(group, index) {
    const radios = Array.from(group);
    if (!radios[index]) return;
    radios[index].checked = true;
    radios[index].dispatchEvent(new Event('change', { bubbles: true }));
  }

  // ── Estado inicial ──
  goToStep(steps[0]);
})();
