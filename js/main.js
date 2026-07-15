/* ============================================================
   H2O Bros — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---- Sticky header shadow ---- */
  const header    = document.querySelector('.site-header');
  const scrollBtn = document.querySelector('.scroll-top');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 24;
    header?.classList.toggle('scrolled', scrolled);
    scrollBtn?.classList.toggle('show', scrolled);
  }, { passive: true });

  scrollBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- Mobile menu toggle ---- */
  const toggle     = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  toggle?.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    mobileMenu?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    document.body.classList.toggle('menu-open', open);
  });

  /* ---- Mobile services accordion ---- */
  document.querySelectorAll('.mobile-services-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.closest('.mobile-nav-item').querySelector('.mobile-nav-sublinks');
      btn.classList.toggle('open');
      sub?.classList.toggle('open');
    });
  });

  /* ---- Close mobile menu on any link click ---- */
  document.querySelectorAll('.mobile-nav-sublink, .mobile-menu a:not(.mobile-services-btn)').forEach(el => {
    el.addEventListener('click', () => {
      toggle?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    });
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item   = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---- Quote capture ----
     Quote forms are the hosted Knock77 lead widget (https://knock77.com/embed.js),
     embedded inline on each page. Submissions land in the H2O Bros Knock77 Leads
     hub, so no in-page form-submit handling is needed here. */

  /* ---- Highlight active nav link ---- */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Animate elements on scroll (intersection observer) ---- */
  const animItems = document.querySelectorAll('.anim-fade');
  if (animItems.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    animItems.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      observer.observe(el);
    });
  }

  /* ---- Sticky mobile call/quote bar (mobile only, via CSS) ---- */
  const bar = document.createElement('div');
  bar.className = 'mobile-cta-bar';
  bar.innerHTML =
    '<a href="tel:+18642567125" class="mcta mcta--call" data-cta="call">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>Call' +
    '</a>' +
    '<a href="/contact" class="mcta mcta--quote" data-cta="quote">Get a Free Quote</a>';
  document.body.appendChild(bar);

  /* ---- Conversion tracking (Google Analytics events) ---- */
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  // Lead submitted: the Knock77 form posts {knock77:'success'} to the parent on submit
  window.addEventListener('message', function (ev) {
    const d = ev && ev.data;
    if (d && typeof d === 'object' && d.knock77 === 'success') {
      track('generate_lead', { method: 'knock77_form', page: location.pathname });
    }
  });
  // Phone intent: any tap on a tel: link
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () {
      track('contact', { method: 'phone', page: location.pathname });
    });
  });
  // Quote-button intent: header, mobile bar, and CTA buttons that lead to /contact
  document.querySelectorAll('a[href="/contact"], a[href="/contact#"], .header-cta, [data-cta="quote"]').forEach(function (a) {
    a.addEventListener('click', function () {
      track('quote_click', { location: a.getAttribute('data-cta') || 'link', page: location.pathname });
    });
  });

})();
