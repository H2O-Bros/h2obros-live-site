/* ============================================================
   CLEANPRO EXTERIORS — Main JavaScript
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

  /* ---- Quote form submission ---- */
  document.querySelectorAll('.js-quote-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const submit  = form.querySelector('.form-submit');
      const success = form.querySelector('.form-success');
      const fields  = form.querySelector('.form-fields');

      // Simulate sending
      if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }

      setTimeout(() => {
        if (fields)  fields.style.display = 'none';
        if (success) success.classList.add('show');
        // TODO: replace with real form submission (Formspree, Netlify Forms, EmailJS, etc.)
        // Example Formspree: fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: new FormData(form) })
      }, 800);
    });
  });

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

})();
