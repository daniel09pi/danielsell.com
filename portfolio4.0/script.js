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
    // Capture current height (maxHeight may be 'none' after open)
    const h = expanded.scrollHeight;
    expanded.style.maxHeight = h + 'px';
    // Force reflow so GSAP can tween from the numeric value
    expanded.offsetHeight;
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
    const gallery = row.querySelector('.index__gallery');
    if (gallery && gallery.resetCarousel) gallery.resetCarousel();
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

  /* --- Gallery Carousel --- */
  function initCarousels() {
    document.querySelectorAll('.index__gallery').forEach((gallery) => {
      const track = gallery.querySelector('.index__gallery-track');
      const images = Array.from(track.querySelectorAll('img'));
      const total = images.length;
      let current = 0;

      // Wrap each image in a slide container
      images.forEach((img) => {
        const slide = document.createElement('div');
        slide.className = 'gallery__slide';
        img.parentNode.insertBefore(slide, img);
        slide.appendChild(img);
      });

      // Build controls
      const controls = document.createElement('div');
      controls.className = 'gallery__controls';

      const prevBtn = document.createElement('button');
      prevBtn.className = 'gallery__arrow gallery__arrow--prev';
      prevBtn.textContent = '\u2190';
      prevBtn.setAttribute('aria-label', 'Previous image');
      prevBtn.disabled = true;

      const nextBtn = document.createElement('button');
      nextBtn.className = 'gallery__arrow gallery__arrow--next';
      nextBtn.textContent = '\u2192';
      nextBtn.setAttribute('aria-label', 'Next image');

      const dots = document.createElement('div');
      dots.className = 'gallery__dots';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'gallery__dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Image ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dots.appendChild(dot);
      }

      const fullscreenBtn = document.createElement('button');
      fullscreenBtn.className = 'gallery__fullscreen-btn';
      fullscreenBtn.setAttribute('aria-label', 'View fullscreen');
      fullscreenBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 1h4v4M5 13H1V9M13 1L8.5 5.5M1 13l4.5-4.5"/></svg>';
      fullscreenBtn.addEventListener('click', () => {
        const row = gallery.closest('.index__row');
        const title = row.querySelector('.index__info-title').textContent;
        openFullscreen(title, images);
      });

      controls.appendChild(prevBtn);
      controls.appendChild(dots);
      controls.appendChild(nextBtn);
      controls.appendChild(fullscreenBtn);
      gallery.appendChild(controls);

      function goTo(index) {
        current = Math.max(0, Math.min(index, total - 1));
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.querySelectorAll('.gallery__dot').forEach((d, i) => {
          d.classList.toggle('is-active', i === current);
        });
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === total - 1;
      }

      prevBtn.addEventListener('click', () => goTo(current - 1));
      nextBtn.addEventListener('click', () => goTo(current + 1));

      // Touch swipe support
      let touchStartX = 0;
      gallery.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      gallery.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
          goTo(diff > 0 ? current + 1 : current - 1);
        }
      });

      // Store reset function
      gallery.resetCarousel = () => goTo(0);
    });
  }

  /* --- Fullscreen Gallery Overlay --- */
  const overlay = document.getElementById('fullscreenOverlay');
  const overlayTitle = overlay.querySelector('.fullscreen__title');
  const overlayBody = overlay.querySelector('.fullscreen__body');
  const overlayClose = overlay.querySelector('.fullscreen__close');

  function openFullscreen(title, images) {
    overlayTitle.textContent = title;
    overlayBody.innerHTML = '';
    images.forEach((img) => {
      const clone = document.createElement('img');
      clone.src = img.src;
      clone.alt = img.alt;
      clone.loading = 'lazy';
      overlayBody.appendChild(clone);
    });
    overlayBody.scrollTop = 0;
    overlay.classList.add('is-open');
    lenis.stop();
    document.body.style.overflow = 'hidden';
  }

  function closeFullscreen() {
    overlay.classList.remove('is-open');
    lenis.start();
    document.body.style.overflow = '';
  }

  overlayClose.addEventListener('click', closeFullscreen);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeFullscreen();
    }
  });

  // Prevent Lenis from intercepting scroll inside fullscreen overlay
  overlay.addEventListener('wheel', (e) => {
    e.stopPropagation();
  }, { passive: true });
  overlay.addEventListener('touchmove', (e) => {
    e.stopPropagation();
  }, { passive: true });

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

  /* --- Hero peek-from-edges (dynamic layout) --- */
  function initHeroPeek() {
    const hero = document.querySelector('.hero');
    const heroContent = hero.querySelector('.hero__content');

    const imagePool = [
      'portfolio_files/alukeku/1.avif', 'portfolio_files/alukeku/2.avif', 'portfolio_files/alukeku/3.avif',
      'portfolio_files/landeshut/1.avif', 'portfolio_files/landeshut/2.avif', 'portfolio_files/landeshut/3.avif',
      'portfolio_files/stooney/1.avif', 'portfolio_files/stooney/2.avif', 'portfolio_files/stooney/3.avif',
      'portfolio_files/project500/1.avif', 'portfolio_files/project500/2.avif', 'portfolio_files/project500/3.avif',
      'portfolio_files/bookcover/1.avif', 'portfolio_files/bookcover/2.avif', 'portfolio_files/bookcover/3.avif',
    ];

    const rand = (min, max) => min + Math.random() * (max - min);
    const randRot = () => { const a = rand(6, 13); return Math.random() > 0.5 ? a : -a; };
    const imgSize = 170;
    const baseOpacity = 0.45;
    const maxOpacity = 1.0;
    const baseSat = 0;
    const maxSat = 1;

    // Interaction state (persists across rebuilds)
    let mouseX = -1;
    let mouseY = -1;
    let state = [];
    let opacityReady = false;
    const isTouch = matchMedia('(hover: none)').matches;

    if (!isTouch) {
      hero.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
      hero.addEventListener('mouseleave', () => { mouseX = -1; mouseY = -1; });
    }

    function buildLayout(animate) {
      // Remove old peek images
      hero.querySelectorAll('.hero__peek').forEach((el) => el.remove());
      state = [];
      opacityReady = false;

      const W = hero.offsetWidth;
      const H = hero.offsetHeight;

      // Shuffle pool fresh each build
      const pool = [...imagePool];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      let imgIdx = 0;
      const nextSrc = () => pool[imgIdx++ % pool.length];

      // Spacing — tighter on sides/bottom since images move inward (no overlap risk)
      const bottomSpacing = imgSize + 40;
      const sideSpacing = imgSize * 0.6 + 30;

      // Counts
      const bottomInner = W * 0.78;
      const bottomCount = Math.max(1, Math.floor(bottomInner / bottomSpacing));

      // Sides: start at 25%, end at 72% — avoid top area and leave gap for corners
      const sideStartPct = 25;
      const sideEndPct = 65;
      const sideRangePx = H * (sideEndPct - sideStartPct) / 100;
      const sideCount = Math.max(1, Math.floor(sideRangePx / sideSpacing));

      // Corner exclusion: first/last bottom images start further from edge
      // to avoid overlapping with corner images
      const cornerZonePct = 14;

      const configs = [];

      // Bottom-left corner
      configs.push({
        pos: 'bottom:' + rand(-40, -28).toFixed(0) + 'px;left:' + rand(-80, -60).toFixed(0) + 'px',
        px: 130, py: -65, rot: randRot(),
      });

      // Bottom middle — avoid corner zones
      for (let i = 0; i < bottomCount; i++) {
        const p = (i + 0.5) / bottomCount;
        const leftPct = cornerZonePct + p * (100 - 2 * cornerZonePct);
        configs.push({
          pos: 'bottom:' + rand(-50, -30).toFixed(0) + 'px;left:' + leftPct.toFixed(1) + '%',
          px: rand(-5, 5), py: rand(-85, -65), rot: randRot(),
        });
      }

      // Bottom-right corner
      configs.push({
        pos: 'bottom:' + rand(-40, -28).toFixed(0) + 'px;right:' + rand(-75, -55).toFixed(0) + 'px',
        px: -125, py: -65, rot: randRot(),
      });

      // Left edge (25% to 65%)
      for (let i = 0; i < sideCount; i++) {
        const p = sideCount > 1 ? i / (sideCount - 1) : 0.5;
        const topPct = sideStartPct + p * (sideEndPct - sideStartPct);
        configs.push({
          pos: 'top:' + topPct.toFixed(1) + '%;left:' + rand(-100, -75).toFixed(0) + 'px',
          px: rand(135, 160), py: rand(-8, 8), rot: randRot(),
        });
      }

      // Right edge (25% to 65%)
      for (let i = 0; i < sideCount; i++) {
        const p = sideCount > 1 ? i / (sideCount - 1) : 0.5;
        const topPct = sideStartPct + p * (sideEndPct - sideStartPct);
        configs.push({
          pos: 'top:' + topPct.toFixed(1) + '%;right:' + rand(-95, -70).toFixed(0) + 'px',
          px: rand(-160, -135), py: rand(-8, 8), rot: randRot(),
        });
      }

      // Create DOM elements
      configs.forEach((cfg) => {
        const img = document.createElement('img');
        img.className = 'hero__peek';
        img.src = nextSrc();
        img.alt = '';
        img.loading = 'lazy';
        img.dataset.peekX = Math.round(cfg.px);
        img.dataset.peekY = Math.round(cfg.py);
        img.dataset.rot = cfg.rot.toFixed(1);
        img.style.cssText = cfg.pos;
        hero.insertBefore(img, heroContent);
      });

      // Build interaction state
      const peeks = hero.querySelectorAll('.hero__peek');
      state = Array.from(peeks).map((el) => {
        const s = {
          el,
          px: parseFloat(el.dataset.peekX) || 0,
          py: parseFloat(el.dataset.peekY) || 0,
          rot: parseFloat(el.dataset.rot) || 0,
          cx: 0, cy: 0, co: baseOpacity, cs: baseSat,
          tapPhase: null, holdStart: 0,
        };
        if (isTouch) {
          el.addEventListener('click', () => {
            // Dismiss any currently active image
            state.forEach((o) => {
              if (o !== s && o.tapPhase) {
                o.tapPhase = 'out';
              }
            });
            if (!s.tapPhase) {
              s.tapPhase = 'in';
            }
          });
        }
        return s;
      });

      // Entrance animation
      if (animate) {
        gsap.fromTo(
          peeks, { opacity: 0 },
          { opacity: baseOpacity, duration: 1, ease: 'power2.out', delay: 0.5, stagger: 0.04 }
        );
        const animEnd = 500 + (peeks.length - 1) * 40 + 1000 + 300;
        setTimeout(() => { opacityReady = true; }, animEnd);
      } else {
        // Instant show on resize
        peeks.forEach((el) => { el.style.opacity = baseOpacity; });
        opacityReady = true;
      }
    }

    function tick() {
      state.forEach((s) => {
        let tx = 0;
        let ty = 0;
        let targetOp = baseOpacity;
        let targetSat = baseSat;

        if (isTouch && s.tapPhase) {
          if (s.tapPhase === 'in') {
            tx = s.px;
            ty = s.py;
            targetOp = maxOpacity;
            targetSat = maxSat;
            if (Math.abs(s.cx - s.px) < 2 && Math.abs(s.cy - s.py) < 2) {
              s.tapPhase = 'hold';
              s.holdStart = Date.now();
            }
          } else if (s.tapPhase === 'hold') {
            tx = s.px;
            ty = s.py;
            targetOp = maxOpacity;
            targetSat = maxSat;
            if (Date.now() - s.holdStart > 1000) {
              s.tapPhase = 'out';
            }
          } else if (s.tapPhase === 'out') {
            if (Math.abs(s.cx) < 1 && Math.abs(s.cy) < 1) {
              s.tapPhase = null;
            }
          }
        } else if (mouseX >= 0) {
          const rect = s.el.getBoundingClientRect();
          const baseX = rect.left + rect.width / 2 - s.cx;
          const baseY = rect.top + rect.height / 2 - s.cy;
          const dist = Math.hypot(mouseX - baseX, mouseY - baseY);
          const factor = Math.max(0, 1 - dist / 450);
          const eased = factor * factor;
          tx = s.px * eased;
          ty = s.py * eased;
          targetOp = baseOpacity + (maxOpacity - baseOpacity) * eased;
          targetSat = baseSat + (maxSat - baseSat) * eased;
        }

        s.cx += (tx - s.cx) * 0.065;
        s.cy += (ty - s.cy) * 0.065;
        s.co += (targetOp - s.co) * 0.065;
        s.cs += (targetSat - s.cs) * 0.065;

        if (Math.abs(s.cx) < 0.1 && Math.abs(s.cy) < 0.1 && tx === 0 && ty === 0) {
          s.cx = 0;
          s.cy = 0;
          s.el.style.transform = 'rotate(' + s.rot + 'deg)';
        } else {
          s.el.style.transform =
            'translate(' + s.cx.toFixed(1) + 'px,' + s.cy.toFixed(1) + 'px) rotate(' + s.rot + 'deg)';
        }

        if (opacityReady) {
          s.el.style.opacity = s.co.toFixed(3);
          s.el.style.filter = 'saturate(' + s.cs.toFixed(3) + ')';
        }
      });
      requestAnimationFrame(tick);
    }

    // Initial build with entrance animation
    buildLayout(true);
    tick();

    // Rebuild on resize (debounced, width-only — mobile address bar changes height)
    let resizeTimer;
    let lastWidth = hero.offsetWidth;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newWidth = hero.offsetWidth;
        if (newWidth !== lastWidth) {
          lastWidth = newWidth;
          buildLayout(false);
        }
      }, 250);
    });
  }

  /* --- Init everything --- */
  initEntrance();
  initReveals();
  initIndexReveals();
  initSkillReveals();
  initCarousels();
  initHeroPeek();
})();
