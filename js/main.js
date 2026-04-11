/**
 * Fay Consult Group — main.js
 * ============================
 * 1.  Page transition overlay
 * 2.  Nav scroll shadow + active page detection
 * 3.  Hamburger menu toggle
 * 4.  Scroll animations (Intersection Observer)
 * 5.  Stat counter animation
 * 6.  Hero typing / morphing headline
 * 7.  Hero parallax mouse drift
 * 8.  Discovery modal (10-step assessment)
 * 9.  Engage section: AI Readiness Quiz
 * 10. Engage section: ROI Calculator
 * 11. Contact form UX
 */

(function () {
  'use strict';

  /* ----------------------------------------
     1. Page transition overlay
  ---------------------------------------- */
  var overlay = document.getElementById('pageTransition');

  // Fade in on load (page just arrived)
  if (overlay) {
    overlay.classList.add('fade-in');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.remove('fade-in');
      });
    });
  }

  // Intercept internal link clicks for smooth page transitions
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');

    // Skip external, anchor-only, or mailto links
    if (!href || href.startsWith('http') || href.startsWith('mailto') ||
        href.startsWith('#') || link.target === '_blank') return;

    // Only intercept same-folder .html links
    if (!href.endsWith('.html') && !href.match(/^[^/]+\.html$/)) return;

    e.preventDefault();

    if (overlay) {
      overlay.classList.add('fade-in');
      setTimeout(function () {
        window.location.href = href;
      }, 380);
    } else {
      window.location.href = href;
    }
  });

  /* ----------------------------------------
     2. Nav — scroll shadow & active page
  ---------------------------------------- */
  var nav = document.getElementById('nav');

  function handleNavScroll() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Highlight active page link
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------
     3. Hamburger menu
  ---------------------------------------- */
  var hamburger  = document.getElementById('hamburger');
  var mobileNav  = document.getElementById('navLinks');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', function (e) {
      if (mobileNav.classList.contains('open') && nav && !nav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------
     4. Scroll animations (Intersection Observer)
  ---------------------------------------- */
  var fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window && fadeEls.length) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -48px 0px' });

    fadeEls.forEach(function (el) { fadeObserver.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ----------------------------------------
     5. Stat counter animation
  ---------------------------------------- */
  function animateCount(el, target, suffix, duration) {
    var start     = 0;
    var startTime = null;
    var isFloat   = target % 1 !== 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current  = isFloat
        ? (eased * target).toFixed(1)
        : Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  var statsSection = document.querySelector('.stats');

  if (statsSection && 'IntersectionObserver' in window) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        statsObserver.disconnect();

        var stats = [
          { el: document.getElementById('stat1'), target: 10,  suffix: '+',    duration: 1000 },
          { el: document.getElementById('stat2'), target: 5,   suffix: '+ hrs', duration: 900 },
          { el: document.getElementById('stat3'), target: 3,   suffix: '',     duration: 700 },
          { el: document.getElementById('stat4'), target: 100, suffix: '%',    duration: 1400 },
        ];

        stats.forEach(function (s) {
          if (s.el) animateCount(s.el, s.target, s.suffix, s.duration);
        });
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* ----------------------------------------
     6. Lucide icons
  ---------------------------------------- */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ----------------------------------------
     7. Hero parallax mouse drift
  ---------------------------------------- */
  var heroSection = document.querySelector('.hero');
  var orbs        = document.querySelectorAll('.orb');

  if (heroSection && orbs.length) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect   = heroSection.getBoundingClientRect();
      var cx     = rect.width  / 2;
      var cy     = rect.height / 2;
      var dx     = (e.clientX - rect.left - cx) / cx;
      var dy     = (e.clientY - rect.top  - cy) / cy;

      orbs.forEach(function (orb, i) {
        var factor = (i + 1) * 14;
        orb.style.transform = 'translate(' + (dx * factor) + 'px, ' + (dy * factor) + 'px)';
      });
    });

    heroSection.addEventListener('mouseleave', function () {
      orbs.forEach(function (orb) {
        orb.style.transform = '';
      });
    });
  }

  /* ----------------------------------------
     8. Discovery Modal (10-step assessment)
  ---------------------------------------- */
  var modalOverlay  = document.getElementById('discoveryModal');
  var modalSteps    = modalOverlay ? modalOverlay.querySelectorAll('.modal-step') : [];
  var modalThanks   = modalOverlay ? modalOverlay.querySelector('.modal-thanks') : null;
  var modalFill     = modalOverlay ? modalOverlay.querySelector('.modal-progress-fill') : null;
  var modalStepNum  = modalOverlay ? modalOverlay.querySelector('#modalStepNum') : null;
  var modalCurrent  = 0;
  var modalAnswers  = {};

  function openModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateModalProgress();
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateModalProgress() {
    var total   = modalSteps.length;
    var percent = total ? Math.round(((modalCurrent) / total) * 100) : 0;
    if (modalFill)    modalFill.style.width = percent + '%';
    if (modalStepNum) modalStepNum.textContent = (modalCurrent + 1) + ' of ' + total;
  }

  function showModalStep(index) {
    modalSteps.forEach(function (s, i) { s.classList.toggle('active', i === index); });
    modalCurrent = index;
    updateModalProgress();

    var backBtn = modalOverlay.querySelector('#modalBack');
    if (backBtn) backBtn.disabled = (index === 0);
  }

  function advanceModal() {
    if (modalCurrent < modalSteps.length - 1) {
      showModalStep(modalCurrent + 1);
    }
  }

  function retreatModal() {
    if (modalCurrent > 0) {
      showModalStep(modalCurrent - 1);
    }
  }

  function submitModal(e) {
    e.preventDefault();
    var nameEl  = document.getElementById('modalName');
    var emailEl = document.getElementById('modalEmail');
    var phoneEl = document.getElementById('modalPhone');
    if (!emailEl || !emailEl.value) return;

    var formData = Object.assign({}, modalAnswers, {
      name:  nameEl  ? nameEl.value  : '',
      email: emailEl.value,
      phone: phoneEl ? phoneEl.value : ''
    });

    fetch('https://formspree.io/f/mojpgpyo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (modalThanks) {
      modalSteps.forEach(function (s) { s.classList.remove('active'); });
      var progressWrap = modalOverlay.querySelector('.modal-progress-wrap');
      if (progressWrap) progressWrap.style.display = 'none';
      modalThanks.classList.add('active');
    }
  }

  if (modalOverlay) {
    // Open triggers
    document.querySelectorAll('[data-open-modal="discovery"]').forEach(function (btn) {
      btn.addEventListener('click', openModal);
    });

    // Close
    var closeBtn = modalOverlay.querySelector('.modal__close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    });

    // Option selection within modal
    modalOverlay.addEventListener('click', function (e) {
      var opt = e.target.closest('.modal-option');
      if (!opt) return;
      var group = opt.closest('.modal-options');
      if (group) group.querySelectorAll('.modal-option').forEach(function (o) { o.classList.remove('selected'); });
      opt.classList.add('selected');
      modalAnswers['step' + modalCurrent] = opt.dataset.value || opt.textContent.trim();
    });

    // Navigation buttons
    var nextBtn = modalOverlay.querySelector('#modalNext');
    var backBtn = modalOverlay.querySelector('#modalBack');
    var form    = modalOverlay.querySelector('#modalForm');

    if (nextBtn) nextBtn.addEventListener('click', advanceModal);
    if (backBtn) backBtn.addEventListener('click', retreatModal);
    if (form)    form.addEventListener('submit', submitModal);

    showModalStep(0);
  }

  /* ----------------------------------------
     9. Engage section: AI Readiness Quiz
  ---------------------------------------- */
  var quizCard     = document.getElementById('quizCard');
  var quizSteps    = quizCard ? quizCard.querySelectorAll('.quiz-step') : [];
  var quizResult   = quizCard ? quizCard.querySelector('.quiz-result') : null;
  var quizFill     = quizCard ? quizCard.querySelector('.quiz-progress-fill') : null;
  var quizCurrent  = 0;
  var quizScores   = [];
  var quizAnswered = false;

  function updateQuizProgress() {
    if (!quizFill) return;
    var total   = quizSteps.length;
    var percent = total ? Math.round(((quizCurrent + 1) / total) * 100) : 100;
    quizFill.style.width = percent + '%';
  }

  function showQuizStep(index) {
    quizSteps.forEach(function (s, i) { s.classList.toggle('active', i === index); });
    quizCurrent = index;
    updateQuizProgress();
    var backBtn = quizCard.querySelector('.quiz-back');
    if (backBtn) backBtn.disabled = (index === 0);
  }

  function showQuizResult() {
    var total = quizScores.reduce(function (a, b) { return a + b; }, 0);
    var max   = quizSteps.length * 3;
    var pct   = total / max;

    var score, label, desc;
    if (pct >= 0.75) {
      score = 'High';
      label = 'You have clear quick wins waiting.';
      desc  = 'Your operation is ready for AI. The right tools could show results within weeks, not months. Let\'s identify the top opportunities.';
    } else if (pct >= 0.45) {
      score = 'Good';
      label = 'Solid foundation, targeted opportunity.';
      desc  = 'A focused audit would pinpoint exactly where AI can save you the most time and money without disrupting what is already working.';
    } else {
      score = 'Early';
      label = 'Your biggest gains are right in front of you.';
      desc  = 'Many of the highest impact AI wins come from companies earlier in the journey. The starting point is usually simpler than you think.';
    }

    var scoreEl = quizCard.querySelector('.quiz-result__score');
    var labelEl = quizCard.querySelector('.quiz-result__label');
    var descEl  = quizCard.querySelector('.quiz-result__desc');

    if (scoreEl) scoreEl.textContent = score;
    if (labelEl) labelEl.textContent = label;
    if (descEl)  descEl.textContent  = desc;

    quizSteps.forEach(function (s) { s.classList.remove('active'); });
    if (quizFill) quizFill.style.width = '100%';
    if (quizResult) quizResult.classList.add('active');
  }

  if (quizCard) {
    // Option selection
    quizCard.addEventListener('click', function (e) {
      var opt = e.target.closest('.quiz-option');
      if (!opt) return;

      var group = opt.closest('.quiz-options');
      if (group) {
        group.querySelectorAll('.quiz-option').forEach(function (o) { o.classList.remove('selected'); });
      }
      opt.classList.add('selected');

      // Auto advance after short delay
      setTimeout(function () {
        var score = parseInt(opt.dataset.score || '2', 10);
        if (quizScores[quizCurrent] === undefined) quizScores.push(score);
        else quizScores[quizCurrent] = score;

        if (quizCurrent < quizSteps.length - 1) {
          showQuizStep(quizCurrent + 1);
        } else {
          showQuizResult();
        }
      }, 320);
    });

    // Back button
    quizCard.addEventListener('click', function (e) {
      if (!e.target.closest('.quiz-back')) return;
      if (quizCurrent > 0) showQuizStep(quizCurrent - 1);
    });

    // Quiz email gate submit
    var quizGateForm = document.getElementById('quizEmailForm');
    if (quizGateForm) {
      quizGateForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var emailInput = quizGateForm.querySelector('input[type="email"]');
        if (!emailInput || !emailInput.value) return;

        var scoreEl  = quizCard.querySelector('.quiz-result__score');
        var labelEl  = quizCard.querySelector('.quiz-result__label');
        var descEl   = quizCard.querySelector('.quiz-result__desc');

        fetch('https://formspree.io/f/xvzvevlg', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            email:  emailInput.value,
            score:  scoreEl ? scoreEl.textContent  : '',
            result: labelEl ? labelEl.textContent  : '',
            detail: descEl  ? descEl.textContent   : ''
          })
        });

        var gate = quizGateForm.closest('.email-gate');
        if (gate) {
          gate.innerHTML = '<p style="color:var(--accent-1);font-weight:600;text-align:center;padding:10px 0">✅ Check your inbox! Your personalized results are on the way.</p>';
        }
      });
    }

    showQuizStep(0);
  }

  /* ----------------------------------------
     10. Engage section: ROI Calculator
  ---------------------------------------- */
  var roiCard = document.getElementById('roiCard');

  function formatDollars(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function updateROI() {
    if (!roiCard) return;
    var employees  = parseInt(document.getElementById('roiEmployees')?.value  || 5,   10);
    var hoursWeek  = parseInt(document.getElementById('roiHours')?.value      || 8,   10);
    var hourlyRate = parseInt(document.getElementById('roiRate')?.value       || 35,  10);

    var annualCost    = employees * hoursWeek * 52 * hourlyRate;
    var potentialSave = annualCost * 0.65;

    var costEl = document.getElementById('roiAnnualCost');
    var saveEl = document.getElementById('roiPotentialSave');

    if (costEl) costEl.textContent = formatDollars(annualCost);
    if (saveEl) saveEl.textContent = formatDollars(potentialSave);
  }

  if (roiCard) {
    // Update display labels on slider input
    var sliders = [
      { id: 'roiEmployees',  labelId: 'roiEmployeesVal',  suffix: ' people' },
      { id: 'roiHours',      labelId: 'roiHoursVal',      suffix: ' hrs/week' },
      { id: 'roiRate',       labelId: 'roiRateVal',       prefix: '$', suffix: '/hr' },
    ];

    sliders.forEach(function (s) {
      var input = document.getElementById(s.id);
      var label = document.getElementById(s.labelId);
      if (!input) return;

      function update() {
        if (label) label.textContent = (s.prefix || '') + input.value + (s.suffix || '');
        updateROI();
      }

      input.addEventListener('input', update);
      update(); // initialise
    });

    // ROI email gate
    var roiGateForm = document.getElementById('roiEmailForm');
    if (roiGateForm) {
      roiGateForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var emailInput = roiGateForm.querySelector('input[type="email"]');
        if (!emailInput || !emailInput.value) return;

        fetch('https://formspree.io/f/xwvwgwyv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            email:             emailInput.value,
            annual_cost:       document.getElementById('roiAnnualCost')    ? document.getElementById('roiAnnualCost').textContent    : '',
            potential_savings: document.getElementById('roiPotentialSave') ? document.getElementById('roiPotentialSave').textContent : '',
            employees:         document.getElementById('roiEmployees')     ? document.getElementById('roiEmployees').value + ' people'   : '',
            hours_per_week:    document.getElementById('roiHours')         ? document.getElementById('roiHours').value + ' hrs/week'      : '',
            hourly_rate:       document.getElementById('roiRate')          ? '$' + document.getElementById('roiRate').value + '/hr'        : ''
          })
        });

        var gate = roiGateForm.closest('.email-gate');
        if (gate) {
          gate.innerHTML = '<p style="color:var(--accent-1);font-weight:600;text-align:center;padding:10px 0">✅ Your full breakdown is on the way. Check your inbox!</p>';
        }
      });
    }
  }

  /* ----------------------------------------
     11. Engage tabs
  ---------------------------------------- */
  var engageTabs   = document.querySelectorAll('.engage-tab');
  var engagePanels = document.querySelectorAll('.engage-panel');

  engageTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.dataset.panel;
      engageTabs.forEach(function (t)   { t.classList.remove('active'); });
      engagePanels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ----------------------------------------
     12. Contact form UX
  ---------------------------------------- */
  var contactForm    = document.getElementById('contactForm');
  var contactSuccess = document.getElementById('contactSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled    = true;
        submitBtn.style.opacity = '0.75';
      }

      var data = {};
      new FormData(contactForm).forEach(function (val, key) { data[key] = val; });

      fetch('https://formspree.io/f/mnjoeolv', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(data)
      })
      .then(function (res) { return res.json(); })
      .then(function () {
        contactForm.style.display = 'none';
        if (contactSuccess) contactSuccess.style.display = 'block';
      })
      .catch(function () {
        if (submitBtn) {
          submitBtn.textContent = 'Send Message →';
          submitBtn.disabled    = false;
          submitBtn.style.opacity = '1';
        }
        alert('Something went wrong. Please email evan@fayconsultgroup.com directly.');
      });
    });
  }

})();
