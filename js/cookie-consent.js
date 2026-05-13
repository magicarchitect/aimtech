/* Cookie consent banner + Google Analytics 4 condicional
 *
 * Lógica:
 * 1. Lee cookie aimtech_consent.
 * 2. Si no existe -> muestra banner con opt-in explícito (RGPD-compliant).
 * 3. Si vale "accept" -> inyecta GA4.
 * 4. Si vale "reject" -> nada, respetando elección del usuario.
 * 5. Links con data-cookie-manage en el footer reabren el banner para
 *    que el usuario pueda cambiar su decisión en cualquier momento.
 *
 * Idioma detectado desde <html lang="...">. Soporta es y ca.
 *
 * TODO: sustituir GA_MEASUREMENT_ID por el real cuando Mike lo cree.
 */
(function () {
  'use strict';

  var COOKIE_NAME = 'aimtech_consent';
  var COOKIE_DAYS = 180; // 6 meses
  var GA_MEASUREMENT_ID = 'G-WJF3NZ7MP2';

  var TEXTS = {
    es: {
      label: 'Cookies',
      body: 'Usamos cookies analíticas (Google Analytics) para entender cómo se usa el sitio. Tu consentimiento es opcional y puedes cambiarlo en cualquier momento. Detalle en <a href="/politica-cookies/">política de cookies</a>.',
      reject: 'Solo necesarias',
      accept: 'Aceptar todas'
    },
    ca: {
      label: 'Galetes',
      body: 'Fem servir galetes analítiques (Google Analytics) per entendre com es fa servir el lloc. El teu consentiment és opcional i el pots canviar en qualsevol moment. Detall a la <a href="/ca/politica-galetes/">política de galetes</a>.',
      reject: 'Només necessàries',
      accept: 'Acceptar-les totes'
    }
  };

  // ── Cookie helpers ────────────────────────────────
  function getCookie(name) {
    var v = ('; ' + document.cookie).split('; ' + name + '=');
    if (v.length === 2) return v.pop().split(';').shift();
    return null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  // ── Google Analytics 4 (carga condicional) ────────
  function loadGA() {
    if (!GA_MEASUREMENT_ID) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  // ── Banner rendering ──────────────────────────────
  function getLang() {
    var lang = document.documentElement.lang || 'es';
    return lang.indexOf('ca') === 0 ? 'ca' : 'es';
  }

  function renderBanner() {
    var t = TEXTS[getLang()];
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookie-banner-label');
    banner.innerHTML =
      '<div class="cookie-banner-label" id="cookie-banner-label">' + t.label + '</div>' +
      '<p class="cookie-banner-text">' + t.body + '</p>' +
      '<div class="cookie-banner-actions">' +
        '<button class="cookie-banner-btn cookie-banner-btn-ghost" data-consent="reject">' + t.reject + '</button>' +
        '<button class="cookie-banner-btn cookie-banner-btn-primary" data-consent="accept">' + t.accept + '</button>' +
      '</div>';

    document.body.appendChild(banner);

    // Trigger animación de entrada (doble RAF para asegurar layout previo).
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('is-visible');
      });
    });

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      var choice = btn.getAttribute('data-consent');
      setCookie(COOKIE_NAME, choice, COOKIE_DAYS);
      if (choice === 'accept') loadGA();
      banner.classList.remove('is-visible');
      setTimeout(function () { banner.remove(); }, 600);
    });
  }

  // ── Manage links en footer (reabren banner) ───────
  function bindManageLinks() {
    var links = document.querySelectorAll('[data-cookie-manage]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        e.preventDefault();
        // Borrar consentimiento previo y re-mostrar banner.
        setCookie(COOKIE_NAME, '', -1);
        var existing = document.querySelector('.cookie-banner');
        if (existing) existing.remove();
        renderBanner();
      });
    }
  }

  // ── Init ──────────────────────────────────────────
  function init() {
    var consent = getCookie(COOKIE_NAME);
    if (consent === 'accept') {
      loadGA();
    } else if (consent !== 'reject') {
      renderBanner();
    }
    bindManageLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
