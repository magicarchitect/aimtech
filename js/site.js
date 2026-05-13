// site.js — script compartido entre todas las páginas.
// Reúne: reloj en vivo, mouse-tracking glow, scroll-reveal y nav móvil.
// Cargar con `defer`. Idempotente.

(function () {
  'use strict';

  // ─── Reloj en vivo ──────────────────────────────────────────────
  function startClock() {
    const el = document.getElementById('clock');
    if (!el) return;
    function tick() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      el.textContent = `${hh}:${mm}:${ss} CET`;
    }
    tick();
    setInterval(tick, 1000);
  }

  // ─── Mouse-tracking glow para cards [data-mouse] ────────────────
  function startMouseGlow() {
    const fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return; // En táctiles no hay hover, no hace falta
    document.querySelectorAll('[data-mouse]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      });
    });
  }

  // ─── Scroll Reveal ──────────────────────────────────────────────
  // Cualquier elemento [data-reveal] o [data-stagger] queda oculto
  // hasta que entra en el viewport. Threshold: 0 con rootMargin
  // negativo en el bottom para disparar cuando aparece el borde
  // superior del elemento — funciona tanto si el elemento es
  // pequeño como si es más alto que el viewport (caso móvil).
  function startReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: muestra todo de golpe en navegadores antiguos.
      document.querySelectorAll('[data-reveal], [data-stagger]')
        .forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px -80px 0px'
    });
    document.querySelectorAll('[data-reveal], [data-stagger]')
      .forEach(el => observer.observe(el));
  }

  // ─── Nav móvil (hamburguesa + drawer) ───────────────────────────
  // Inyecta el botón hamburguesa y reutiliza el contenido existente
  // de <nav> (.nav-links, .lang-switch, .nav-cta) en un panel
  // deslizable. Funciona en todas las páginas sin tocar el HTML.
  function startMobileNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    if (nav.querySelector('.nav-toggle')) return; // idempotente

    const links     = nav.querySelector('.nav-links');
    const langSwitch= nav.querySelector('.lang-switch');
    const cta       = nav.querySelector('.nav-cta');
    if (!links && !cta) return;

    // Botón hamburguesa
    const btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Abrir menú');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'nav-drawer');
    btn.innerHTML = '<span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span>';
    nav.appendChild(btn);

    // Drawer
    const drawer = document.createElement('div');
    drawer.className = 'nav-drawer';
    drawer.id = 'nav-drawer';
    drawer.setAttribute('aria-hidden', 'true');

    const inner = document.createElement('div');
    inner.className = 'nav-drawer-inner';

    if (links) {
      const linksClone = links.cloneNode(true);
      linksClone.classList.add('nav-drawer-links');
      linksClone.classList.remove('nav-links');
      inner.appendChild(linksClone);
    }

    if (langSwitch || cta) {
      const tail = document.createElement('div');
      tail.className = 'nav-drawer-tail';
      if (langSwitch) tail.appendChild(langSwitch.cloneNode(true));
      if (cta) {
        const ctaClone = cta.cloneNode(true);
        ctaClone.classList.add('nav-drawer-cta');
        tail.appendChild(ctaClone);
      }
      inner.appendChild(tail);
    }

    drawer.appendChild(inner);
    document.body.appendChild(drawer);

    // Apertura / cierre
    function setOpen(open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('nav-open', open);
    }
    btn.addEventListener('click', () => {
      setOpen(!document.body.classList.contains('nav-open'));
    });
    drawer.addEventListener('click', e => {
      // Click en cualquier link o en el fondo: cerrar
      if (e.target.closest('a')) setOpen(false);
      if (e.target === drawer) setOpen(false);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) setOpen(false);
    });
    // Si pasamos a desktop, cerrar el drawer automáticamente
    const mq = window.matchMedia('(min-width: 960px)');
    mq.addEventListener ? mq.addEventListener('change', e => { if (e.matches) setOpen(false); })
                       : mq.addListener(e => { if (e.matches) setOpen(false); });
  }

  function init() {
    startClock();
    startMouseGlow();
    startReveal();
    startMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
