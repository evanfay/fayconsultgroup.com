/**
 * Fay Consult Group — main.js
 * ============================
 * 1. Nav scroll shadow + active page detection
 * 2. Hamburger menu toggle
 * 3. Scroll animations (Intersection Observer)
 * 4. Smooth close on nav link click (mobile)
 */

(function () {
  'use strict';

  /* ----------------------------------------
     1. Nav — scroll shadow & active page
  ---------------------------------------- */
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');

  // Add .scrolled class for shadow
  function handleNavScroll() {
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on init

  // Highlight active page link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------
     2. Hamburger menu
  ---------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('navLinks');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is tapped on mobile
    mobileNav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        mobileNav.classList.contains('open') &&
        !nav.contains(e.target)
      ) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------
     3. Scroll animations (Intersection Observer)
  ---------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window && fadeEls.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once visible, no need to keep observing
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px',
      }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately if observer not supported
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ----------------------------------------
     4. Contact form: basic client-side UX
  ---------------------------------------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    // Add subtle focus ring animation to form fields
    const formFields = contactForm.querySelectorAll('input, select, textarea');
    formFields.forEach(function (field) {
      field.addEventListener('focus', function () {
        this.parentElement.classList.add('focused');
      });
      field.addEventListener('blur', function () {
        this.parentElement.classList.remove('focused');
      });
    });

    // Loading state on submit
    contactForm.addEventListener('submit', function () {
      const submitBtn = contactForm.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.75';
      }
    });
  }

})();
