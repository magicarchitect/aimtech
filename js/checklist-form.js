// Checklist IA lead form — accessible Typeform-style wizard.
(function () {
  'use strict';

  const form = document.getElementById('lfForm');
  if (!form) return;

  const stage = document.querySelector('.lf-stage');
  const steps = Array.from(form.querySelectorAll('.fb-step'));
  const bar = document.getElementById('lfBar');
  const count = document.getElementById('lfCount');
  const prevBtn = document.getElementById('lfPrev');
  const nextBtn = document.getElementById('lfNext');
  const finalStep = steps.find((step) => step.dataset.step === 'fin');
  const emailStatus = document.getElementById('lfEmailStatus');
  const renderedAt = Date.now();
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const OPTION_KEYS = ['a', 'b', 'c', 'd', 'e', 'f'];

  let currentIndex = 0;
  let sending = false;
  let done = false;
  let advanceTimer = null;

  function currentStep() { return steps[currentIndex]; }

  function focusStep(step) {
    const target = step.querySelector('input:checked') ||
      step.querySelector('input:not([type="radio"]):not([type="checkbox"]), button, a');
    if (target) target.focus({ preventScroll: true });
  }

  function updateChrome() {
    const step = currentStep();
    const questions = steps.filter((item) => item.hasAttribute('data-progress'));
    const questionIndex = questions.indexOf(step);

    if (done || step === finalStep) {
      bar.style.width = '100%';
      count.textContent = '';
    } else if (questionIndex < 0) {
      bar.style.width = '0%';
      count.textContent = '';
    } else {
      bar.style.width = ((questionIndex / questions.length) * 100) + '%';
      count.textContent = (questionIndex + 1) + ' / ' + questions.length;
    }

    prevBtn.disabled = done || currentIndex === 0;
    nextBtn.disabled = done || step === finalStep;
  }

  function goToStep(step) {
    const targetIndex = steps.indexOf(step);
    if (targetIndex < 0) return;
    if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null; }

    steps.forEach((item, index) => {
      item.classList.toggle('is-active', index === targetIndex);
      item.classList.toggle('is-above', index < targetIndex);
      if (index === targetIndex) item.removeAttribute('inert');
      else item.setAttribute('inert', '');
    });

    currentIndex = targetIndex;
    updateChrome();
    setTimeout(() => focusStep(step), 100);
  }

  function showError(step) {
    step.classList.remove('has-error');
    void step.offsetWidth;
    step.classList.add('has-error');
  }

  function clearError(step) { step.classList.remove('has-error'); }

  function field(name) { return form.elements.namedItem(name); }

  function validate(step) {
    switch (step.dataset.step) {
      case 'nombre':
        return field('nombre').value.trim().length > 1;
      case 'email':
        return EMAIL_RE.test(field('email').value.trim());
      case 'facturacion':
        return Boolean(field('facturacion').value);
      case 'consentimiento':
        return Boolean(field('consentimiento').value);
      default:
        return true;
    }
  }

  function next() {
    if (sending || done) return;
    const step = currentStep();
    if (!validate(step)) { showError(step); return; }
    clearError(step);

    if (step.dataset.step === 'consentimiento') {
      submitLead();
      return;
    }
    if (currentIndex < steps.length - 2) goToStep(steps[currentIndex + 1]);
  }

  function previous() {
    if (sending || done || currentIndex === 0) return;
    goToStep(steps[currentIndex - 1]);
  }

  function setStatus(message) {
    const status = currentStep().querySelector('.fb-status');
    if (!status) return;
    status.textContent = message || '';
    status.classList.toggle('is-error', Boolean(message));
  }

  function attribution() {
    const params = new URLSearchParams(window.location.search);
    const clean = (key) => (params.get(key) || '').slice(0, 160);
    return {
      utmSource: clean('utm_source'),
      utmMedium: clean('utm_medium'),
      utmCampaign: clean('utm_campaign'),
      utmContent: clean('utm_content'),
      referrer: String(document.referrer || '').slice(0, 500),
      pageUrl: String(window.location.href).slice(0, 500)
    };
  }

  async function submitLead() {
    const step = currentStep();
    if (!validate(step)) { showError(step); return; }

    const button = step.querySelector('[data-submit]');
    setStatus('');
    sending = true;
    button.disabled = true;
    const originalLabel = button.textContent;
    button.textContent = 'Enviando…';

    const payload = {
      nombre: field('nombre').value.trim(),
      email: field('email').value.trim(),
      empresa: field('empresa').value.trim(),
      tamano: field('tamano').value || '',
      facturacion: field('facturacion').value,
      consentMarketing: field('consentimiento').value === 'si',
      website: field('website').value,
      renderedAt,
      lang: 'es',
      ...attribution()
    };

    try {
      const response = await fetch('/.netlify/functions/checklist-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      let result = {};
      try { result = await response.json(); } catch (_) {}
      if (!response.ok) throw new Error(result.error || 'server');

      done = true;
      stage.classList.add('is-done');
      if (result.emailSent === false) {
        emailStatus.textContent = 'Tu registro se ha guardado. No hemos podido confirmar el email, pero puedes descargarla ahora mismo.';
      }
      goToStep(finalStep);
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { form_name: 'checklist_ia', marketing_consent: payload.consentMarketing });
      }
    } catch (_) {
      setStatus('No hemos podido guardar el registro. Inténtalo de nuevo o escribe a hola@aimtech.es.');
    } finally {
      sending = false;
      if (!done) {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    }
  }

  form.querySelectorAll('[data-next]').forEach((button) => button.addEventListener('click', next));
  form.querySelectorAll('[data-submit]').forEach((button) => button.addEventListener('click', submitLead));
  prevBtn.addEventListener('click', previous);
  nextBtn.addEventListener('click', next);
  form.addEventListener('submit', (event) => event.preventDefault());

  form.addEventListener('input', () => clearError(currentStep()));
  form.addEventListener('change', (event) => {
    clearError(currentStep());
    if (!event.target.matches('.fb-option input[type="radio"]')) return;
    if (currentStep().dataset.step === 'consentimiento') return;
    if (advanceTimer) clearTimeout(advanceTimer);
    const scheduledStep = currentStep();
    advanceTimer = setTimeout(() => {
      advanceTimer = null;
      if (currentStep() === scheduledStep) next();
    }, 400);
  });

  document.addEventListener('keydown', (event) => {
    if (done || sending) return;
    const step = currentStep();

    if (event.key === 'Enter') {
      if (event.target.tagName === 'A' || event.target.tagName === 'BUTTON') return;
      event.preventDefault();
      next();
      return;
    }

    const keyIndex = OPTION_KEYS.indexOf(event.key.toLowerCase());
    if (keyIndex < 0) return;
    const radios = Array.from(step.querySelectorAll('.fb-option input[type="radio"]'));
    if (!radios[keyIndex]) return;
    radios[keyIndex].checked = true;
    radios[keyIndex].dispatchEvent(new Event('change', { bubbles: true }));
  });

  document.querySelector('[data-download]').addEventListener('click', () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'file_download', { file_name: 'aimtech_checklist_ia.pdf', resource: 'checklist_ia' });
    }
  });

  goToStep(steps[0]);
})();
