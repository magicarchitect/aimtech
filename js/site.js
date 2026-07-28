// site.js — script compartido entre todas las páginas.
// Reúne: reloj en vivo, mouse-tracking glow, scroll-reveal y nav móvil.
// Cargar con `defer`. Idempotente.

(function () {
  'use strict';

  // ─── Skip link (saltar al contenido) ────────────────────────────
  // Inyecta un enlace «saltar al contenido» como primer elemento
  // focusable de la página y garantiza que <main> sea destino de foco.
  // Idioma según <html lang>. Idempotente.
  function startSkipLink() {
    const main = document.querySelector('main');
    if (!main || document.querySelector('.skip-link')) return;
    if (!main.id) main.id = 'contenido';
    main.setAttribute('tabindex', '-1');

    const isCA = (document.documentElement.lang || '').toLowerCase().startsWith('ca');
    const link = document.createElement('a');
    link.className = 'skip-link';
    link.href = '#' + main.id;
    link.textContent = isCA ? 'Vés al contingut' : 'Saltar al contenido';
    document.body.insertBefore(link, document.body.firstChild);
  }

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

  // ─── Motion engine: GSAP + fallback nativo ─────────────────────
  // Los assets se sirven desde el propio dominio. GSAP mejora el ritmo y el
  // escalonado; si falla, IntersectionObserver mantiene visible el contenido.
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') resolve();
        else {
          existing.addEventListener('load', resolve, { once: true });
          existing.addEventListener('error', reject, { once: true });
        }
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true';
        resolve();
      }, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.head.appendChild(script);
    });
  }

  function revealEverything() {
    document.querySelectorAll('[data-reveal], [data-stagger]')
      .forEach(el => el.classList.add('is-visible'));
  }

  function startNativeReveal() {
    if (!('IntersectionObserver' in window)) {
      revealEverything();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -80px 0px' });
    document.querySelectorAll('[data-reveal], [data-stagger]')
      .forEach(el => observer.observe(el));
  }

  function startGsapReveal() {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('gsap-ready');

    const finish = elements => {
      elements.forEach(el => el.classList.add('is-visible'));
      gsap.set(elements, { clearProps: 'transform,opacity,willChange' });
    };

    const revealGroups = [
      { selector: '[data-reveal="left"]', from: { x: -36, y: 0 } },
      { selector: '[data-reveal="scale"]', from: { scale: 0.96, y: 0 } },
      { selector: '[data-reveal]:not([data-reveal="left"]):not([data-reveal="scale"])', from: { y: 28 } },
    ];

    revealGroups.forEach(group => {
      const targets = gsap.utils.toArray(group.selector);
      if (!targets.length) return;
      gsap.set(targets, { ...group.from, opacity: 0 });
      ScrollTrigger.batch(targets, {
        start: 'top 88%',
        once: true,
        interval: 0.08,
        batchMax: 5,
        onEnter: batch => gsap.to(batch, {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.78,
          ease: 'power3.out',
          stagger: 0.07,
          overwrite: 'auto',
          onComplete: () => finish(batch),
        }),
      });
    });

    document.querySelectorAll('[data-stagger]').forEach(container => {
      const children = Array.from(container.children);
      if (!children.length) {
        container.classList.add('is-visible');
        return;
      }
      gsap.set(children, { y: 22, opacity: 0 });
      ScrollTrigger.create({
        trigger: container,
        start: 'top 88%',
        once: true,
        onEnter: self => {
          gsap.to(children, {
            y: 0,
            opacity: 1,
            duration: 0.68,
            ease: 'power3.out',
            stagger: { each: 0.085, from: 'start' },
            overwrite: 'auto',
            onComplete: () => {
              container.classList.add('is-visible');
              gsap.set(children, { clearProps: 'transform,opacity,willChange' });
            },
          });
          self.kill();
        },
      });
    });

    // Paralaje muy leve del grid: una sola capa, solo en desktop y sin
    // animación para usuarios que piden movimiento reducido.
    const mm = gsap.matchMedia();
    mm.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
      const grid = document.querySelector('.grid-bg');
      if (!grid) return;
      gsap.fromTo(grid,
        { y: -24, scale: 1.03 },
        {
          y: 48,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'max',
            scrub: 1.2,
          },
        }
      );
    });

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }

  // ─── Scroll Reveal ──────────────────────────────────────────────
  // Cualquier elemento [data-reveal] o [data-stagger] queda oculto
  // hasta que entra en el viewport. Threshold: 0 con rootMargin
  // negativo en el bottom para disparar cuando aparece el borde
  // superior del elemento — funciona tanto si el elemento es
  // pequeño como si es más alto que el viewport (caso móvil).
  function startReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealEverything();
      return;
    }
    Promise.resolve()
      .then(() => window.gsap ? null : loadScript('/js/vendor/gsap.min.js'))
      .then(() => window.ScrollTrigger ? null : loadScript('/js/vendor/ScrollTrigger.min.js'))
      .then(startGsapReveal)
      .catch(error => {
        console.warn('GSAP no disponible; usando animación nativa.', error);
        startNativeReveal();
      });
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
      // El clon duplicaría el id del panel del dropdown y dejaría un
      // aria-controls colgando: en el drawer «Servicios» va siempre desplegado
      // (sin toggle), así que limpiamos ids y atributos de disclosure del clon.
      linksClone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      const clonedToggle = linksClone.querySelector('.nav-dropdown-toggle');
      if (clonedToggle) {
        ['aria-controls', 'aria-haspopup', 'aria-expanded'].forEach(a => clonedToggle.removeAttribute(a));
      }
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

  // ─── Dropdown «Servicios» del nav (desktop) ─────────────────────
  // Hover y foco ya los cubre el CSS. Esto añade el toggle por click
  // (táctil/teclado), cierre con Escape y click fuera. Acotado a `nav`
  // para no tocar el clon del drawer (que va siempre desplegado).
  function startDropdown() {
    document.querySelectorAll('nav .nav-dropdown').forEach(dd => {
      const toggle = dd.querySelector('.nav-dropdown-toggle');
      const menu = dd.querySelector('.nav-dropdown-menu');
      if (!toggle || !menu) return;

      let closeTimer = null;
      const canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      function clearCloseTimer() {
        if (!closeTimer) return;
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }

      function setOpen(open) {
        clearCloseTimer();
        dd.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      }

      function scheduleClose(delay = 220) {
        clearCloseTimer();
        closeTimer = window.setTimeout(() => setOpen(false), delay);
      }

      toggle.addEventListener('click', e => {
        e.preventDefault();
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
      });

      if (canHover) {
        // El mega-menú está posicionado fixed y puede haber un hueco visual entre
        // el botón y el panel. Mantenemos el menú abierto durante el tránsito del
        // cursor y lo cerramos al entrar en otro ítem del nav o al alejarnos.
        dd.addEventListener('pointerenter', () => setOpen(true));
        dd.addEventListener('pointerleave', () => scheduleClose());
        menu.addEventListener('pointerenter', () => setOpen(true));
        menu.addEventListener('pointerleave', () => scheduleClose());

        const navLinks = dd.closest('.nav-links');
        if (navLinks) {
          navLinks.addEventListener('pointerover', e => {
            if (!dd.contains(e.target)) setOpen(false);
          });
        }
      }

      dd.addEventListener('keydown', e => {
        if (e.key === 'Escape' && dd.classList.contains('is-open')) {
          setOpen(false);
          toggle.focus();
        }
      });
      document.addEventListener('click', e => {
        if (!dd.contains(e.target)) setOpen(false);
      });
    });
  }

  // ─── Resaltado del ítem activo del nav ──────────────────────────
  // Marca con .active el enlace cuya ruta coincide con la página actual
  // y resalta «Servicios» si estamos en una de las 4 rutas de servicio.
  function startActiveNav() {
    const path = location.pathname.replace(/index\.html$/, '');
    const SERVICE_PATHS = [
      '/power-bi/', '/ia-aplicada/', '/ia-agentica/', '/desarrollo/',
      '/ca/power-bi/', '/ca/ia-aplicada/', '/ca/ia-agentica/', '/ca/desenvolupament/'
    ];
    document.querySelectorAll('nav .nav-links a, .nav-drawer-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href === path) a.classList.add('active');
    });
    if (SERVICE_PATHS.includes(path)) {
      document.querySelectorAll('nav .nav-dropdown-toggle, .nav-drawer-links .nav-dropdown-toggle')
        .forEach(b => b.classList.add('active'));
    }
  }

  // ─── Barra de progreso de lectura (solo en posts) ──────────────
  // Inyecta una barra fija arriba que se llena según el avance de
  // lectura del cuerpo del artículo. rAF-throttled y passive.
  function startReadingProgress() {
    const body = document.querySelector('article.post .post-body');
    if (!body) return;
    const bar = document.createElement('div');
    bar.className = 'read-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    let ticking = false;
    function update() {
      const rect = body.getBoundingClientRect();
      const total = body.offsetHeight - window.innerHeight;
      const pct = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : (rect.top <= 0 ? 1 : 0);
      bar.style.transform = 'scaleX(' + pct + ')';
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  function init() {
    startSkipLink();
    startClock();
    startMouseGlow();
    startReveal();
    startDropdown();
    startMobileNav();
    startActiveNav();
    startReadingProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
