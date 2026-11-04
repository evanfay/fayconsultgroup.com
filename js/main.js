/**
 * Fay Consult Group — main.js
 * ============================
 * 1.  Page transition overlay
 * 2.  Nav scroll shadow + active page detection
 * 3.  Hamburger menu toggle
 * 4.  Industry cards (Who It's For page, data in js/industries.js)
 * 5.  Lucide icons
 * 6.  Scroll animations (Intersection Observer)
 * 7.  Hero parallax mouse drift
 * 8.  ROI calculator (Speed to Lead page)
 * 9.  Response-time test form (Contact page)
 * 10. Analytics: CTA click tracking
 * 11. Footer year
 */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }

  /* ----------------------------------------
     1. Page transition overlay
  ---------------------------------------- */
  var overlay = document.getElementById('pageTransition');

  if (overlay && !reduceMotion) {
    overlay.classList.add('fade-in');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { overlay.classList.remove('fade-in'); });
    });
  }

  // Back/forward cache: make sure the overlay never stays visible
  window.addEventListener('pageshow', function () {
    if (overlay) overlay.classList.remove('fade-in');
  });

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link || reduceMotion) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var href = link.getAttribute('href');

    // Skip external, anchors, mailto/tel and new-tab links
    if (!href || /^(https?:|mailto:|tel:|#)/.test(href) || link.target === '_blank') return;
    // Only intercept plain same-folder page links (no in-page anchors)
    if (!/^[\w-]+\.html$/.test(href)) return;

    e.preventDefault();
    if (overlay) {
      overlay.classList.add('fade-in');
      setTimeout(function () { window.location.href = href; }, 380);
    } else {
      window.location.href = href;
    }
  });

  /* ----------------------------------------
     2. Nav — scroll shadow & active page
  ---------------------------------------- */
  var nav = document.getElementById('nav');

  function handleNavScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (!/\.html$/.test(currentPage)) currentPage = currentPage + '.html';
  document.querySelectorAll('.nav__link').forEach(function (link) {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ----------------------------------------
     3. Hamburger menu
  ---------------------------------------- */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('navLinks');

  function closeMenu() {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', function (e) {
      if (mobileNav.classList.contains('open') && nav && !nav.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ----------------------------------------
     4. Industry cards
  ---------------------------------------- */
  var industryGrid = document.getElementById('industryGrid');

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  if (industryGrid && Array.isArray(window.FCG_INDUSTRIES)) {
    industryGrid.innerHTML = window.FCG_INDUSTRIES.map(function (ind, i) {
      return '<article class="card industry-card fade-up delay-' + ((i % 3) + 1) + '">' +
        '<div class="card__icon"><i data-lucide="' + esc(ind.icon || 'briefcase') + '" aria-hidden="true"></i></div>' +
        '<h3>' + esc(ind.name) + '</h3>' +
        '<p>' + esc(ind.pain) + '</p>' +
        '<p class="industry-card__example">' + esc(ind.example) + '</p>' +
        '</article>';
    }).join('');
  }

  /* ----------------------------------------
     5. Lucide icons
  ---------------------------------------- */
  if (typeof lucide !== 'undefined') lucide.createIcons();

  /* ----------------------------------------
     6. Scroll animations
  ---------------------------------------- */
  var fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window && fadeEls.length && !reduceMotion) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(function (el) { fadeObserver.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ----------------------------------------
     7. Hero parallax mouse drift
  ---------------------------------------- */
  var heroSection = document.querySelector('.hero');
  var orbs = document.querySelectorAll('.orb');

  if (heroSection && orbs.length && !reduceMotion) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      var dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      orbs.forEach(function (orb, i) {
        var f = (i + 1) * 14;
        orb.style.transform = 'translate(' + (dx * f) + 'px, ' + (dy * f) + 'px)';
      });
    });
    heroSection.addEventListener('mouseleave', function () {
      orbs.forEach(function (orb) { orb.style.transform = ''; });
    });
  }

  /* ----------------------------------------
     8. ROI calculator
     Assumption (shown on the page): faster response wins back
     RECOVERY_RATE of the leads that are currently missed or slow,
     and those close at the business's normal close rate.
  ---------------------------------------- */
  var roiForm = document.getElementById('roiForm');
  var RECOVERY_RATE = 0.5;

  function num(id, fallback) {
    var el = document.getElementById(id);
    var v = el ? parseFloat(el.value) : NaN;
    return isNaN(v) || v < 0 ? fallback : v;
  }

  function dollars(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

  function updateROI() {
    var leads = num('roiLeads', 0);
    var jobValue = num('roiJobValue', 0);
    var closeRate = Math.min(num('roiCloseRate', 0), 100) / 100;
    var missedRate = Math.min(num('roiMissed', 0), 100) / 100;

    var recoveredLeads = leads * missedRate * RECOVERY_RATE;
    var extraJobs = recoveredLeads * closeRate;
    var extraRevenue = extraJobs * jobValue;

    var jobsEl = document.getElementById('roiExtraJobs');
    var revEl = document.getElementById('roiExtraRevenue');
    var yrEl = document.getElementById('roiExtraYear');
    if (jobsEl) jobsEl.textContent = extraJobs < 10 ? extraJobs.toFixed(1) : Math.round(extraJobs).toString();
    if (revEl) revEl.textContent = dollars(extraRevenue);
    if (yrEl) yrEl.textContent = dollars(extraRevenue * 12);
  }

  if (roiForm) {
    roiForm.addEventListener('input', updateROI);
    roiForm.addEventListener('submit', function (e) { e.preventDefault(); });
    updateROI();
  }

  /* ----------------------------------------
     9. Response-time test form
     Backend: Formspree (same endpoint the old contact form used).
     TODO(Evan): confirm form backend; swap FORM_ENDPOINT if it changes.
  ---------------------------------------- */
  var FORM_ENDPOINT = 'https://formspree.io/f/mnjoeolv';
  var testForm = document.getElementById('testForm');
  var testSuccess = document.getElementById('testSuccess');

  if (testForm) {
    testForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!testForm.checkValidity()) { testForm.reportValidity(); return; }

      var btn = testForm.querySelector('[type="submit"]');
      var btnText = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }

      // Collapse repeated checkbox names into one comma-separated value
      var data = {};
      new FormData(testForm).forEach(function (val, key) {
        data[key] = data[key] ? data[key] + ', ' + val : val;
      });
      data.submitted_from = window.location.href;

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Form error ' + res.status);
          testForm.style.display = 'none';
          if (testSuccess) {
            testSuccess.classList.add('show');
            testSuccess.setAttribute('tabindex', '-1');
            testSuccess.focus();
          }
          track('generate_lead', { form: 'response_time_test' });
        })
        .catch(function () {
          if (btn) { btn.textContent = btnText; btn.disabled = false; }
          alert('Something went wrong sending the form. Please email evan@fayconsultgroup.com and we will get right back to you.');
        });
    });
  }

  /* ----------------------------------------
     10. Analytics: CTA clicks
     Any element with data-track="label" reports a cta_click event.
  ---------------------------------------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) track('cta_click', { cta: el.getAttribute('data-track'), page: currentPage });
  });

  /* ----------------------------------------
     11. Footer year
  ---------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

})();
