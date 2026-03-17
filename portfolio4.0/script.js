/* ============================================
   CONCEPT B: THE INDEX — Script
   ============================================ */

(function () {
  'use strict';

  /* --- Lenis Smooth Scroll --- */
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  /* --- Nav: hide on scroll down, show on scroll up --- */
  const nav = document.getElementById('nav');
  let lastScrollY = 0;

  lenis.on('scroll', ({ scroll }) => {
    if (scroll > lastScrollY && scroll > 100) {
      nav.classList.add('nav--hidden');
    } else {
      nav.classList.remove('nav--hidden');
    }
    lastScrollY = scroll;
  });

  /* --- Nav smooth scroll links --- */
  document.querySelectorAll('.nav__link, .nav__logo').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          lenis.scrollTo(target, { offset: -60 });
        }
      }
    });
  });

  /* --- Hero rotating text --- */
  const rotatingEl = document.getElementById('heroRotating');
  const phrases = [
    'Designer \u2014 Developer \u2014 Currently in Argentina',
    'Brand Identity \u2014 Web Development \u2014 Editorial Design',
    'Munich, Germany \u2014 Salta, Argentina',
  ];
  let phraseIndex = 0;

  function rotatePhrase() {
    gsap.to(rotatingEl, {
      opacity: 0,
      y: -6,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        rotatingEl.textContent = phrases[phraseIndex];
        gsap.fromTo(
          rotatingEl,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
        );
      },
    });
  }

  // Set initial phrase
  rotatingEl.textContent = phrases[0];
  gsap.set(rotatingEl, { opacity: 1 });
  setInterval(rotatePhrase, 3500);

  /* --- Reveal on scroll --- */
  function initReveals() {
    const reveals = document.querySelectorAll('.reveal-up');
    reveals.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          // Stagger sibling reveals
          const siblings = el.parentElement.querySelectorAll('.reveal-up');
          let idx = Array.from(siblings).indexOf(el);
          setTimeout(() => {
            el.classList.add('revealed');
          }, idx * 120);
        },
      });
    });
  }

  /* --- Entrance animation (page load stagger) --- */
  function initEntrance() {
    gsap.fromTo(
      '.hero__title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 }
    );
    gsap.fromTo(
      '.hero__subtitle',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.35 }
    );
    gsap.fromTo(
      '.nav',
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.05 }
    );
  }

  /* --- Project Index: expand/collapse --- */
  let currentExpanded = null;

  function closeProject(row, callback) {
    const expanded = row.querySelector('.index__expanded');
    gsap.to(expanded, {
      maxHeight: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        row.classList.remove('is-expanded');
        if (callback) callback();
      },
    });
  }

  function openProject(row) {
    const expanded = row.querySelector('.index__expanded');
    row.classList.add('is-expanded');

    // Measure natural height
    expanded.style.maxHeight = 'none';
    const h = expanded.scrollHeight;
    expanded.style.maxHeight = '0px';

    gsap.to(expanded, {
      maxHeight: h + 20,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        expanded.style.maxHeight = 'none'; // Allow resize
        lenis.scrollTo(row, { offset: -80, duration: 0.8 });
      },
    });
  }

  document.querySelectorAll('.index__row-header').forEach((header) => {
    header.addEventListener('click', () => {
      const row = header.closest('.index__row');

      if (row === currentExpanded) {
        closeProject(row);
        currentExpanded = null;
        return;
      }

      if (currentExpanded) {
        closeProject(currentExpanded, () => {
          openProject(row);
        });
      } else {
        openProject(row);
      }
      currentExpanded = row;
    });
  });

  // Close buttons
  document.querySelectorAll('.index__close').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const row = btn.closest('.index__row');
      if (row === currentExpanded) {
        closeProject(row);
        currentExpanded = null;
      }
    });
  });

  /* --- Gallery drag-to-scroll --- */
  document.querySelectorAll('.index__gallery').forEach((gallery) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    gallery.addEventListener('mousedown', (e) => {
      isDown = true;
      gallery.style.cursor = 'grabbing';
      startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
    });

    gallery.addEventListener('mouseleave', () => {
      isDown = false;
      gallery.style.cursor = 'grab';
    });

    gallery.addEventListener('mouseup', () => {
      isDown = false;
      gallery.style.cursor = 'grab';
    });

    gallery.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - gallery.offsetLeft;
      const walk = (x - startX) * 1.5;
      gallery.scrollLeft = scrollLeft - walk;
    });

    // Set default cursor
    gallery.style.cursor = 'grab';
  });

  /* --- Index rows: staggered reveal --- */
  function initIndexReveals() {
    const rows = document.querySelectorAll('.index__row');
    rows.forEach((row, i) => {
      gsap.fromTo(
        row,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 90%',
            once: true,
          },
          delay: i * 0.08,
        }
      );
    });
  }

  /* --- Skills line-by-line reveal --- */
  function initSkillReveals() {
    const items = document.querySelectorAll('.skills__list li');
    items.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 92%',
            once: true,
          },
        }
      );
    });
  }

  /* --- Contact form (basic handler) --- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.contact__submit');
      btn.textContent = 'Sent!';
      btn.style.pointerEvents = 'none';
      setTimeout(() => {
        btn.textContent = 'Send';
        btn.style.pointerEvents = '';
        contactForm.reset();
      }, 2500);
    });
  }

  /* --- Init everything --- */
  initEntrance();
  initReveals();
  initIndexReveals();
  initSkillReveals();
})();
