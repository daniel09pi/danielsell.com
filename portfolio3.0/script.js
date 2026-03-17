/* ============================================
   Daniel Sell Portfolio — script.js
   ============================================ */

(function () {
  'use strict';

  /* --- Project Data --- */
  const projects = [
    {
      slug: 'alukeku',
      name: 'ALUKEKU',
      category: 'Brand Identity',
      year: '2026',
      description: 'Design of the ALUKEKU brand identity and visual guidelines. ALUKEKU is an architecture and construction company from Angola.',
      images: 9,
    },
    {
      slug: 'landeshut',
      name: 'Landeshut',
      category: 'Brand Identity',
      year: '2025',
      description: 'Design of the Landeshut brand identity. Landeshut is a local nonprofit organisation that brings local communities together in the area of Bavaria, Germany.',
      images: 6,
    },
    {
      slug: 'stooney',
      name: 'Stooney',
      category: 'Brand Identity',
      year: '2024',
      description: 'Designs of the Stooney brand identity. Stooney is a Germany-based small company that makes high quality hand-made designer lamps made out of raw stones and gems.',
      images: 6,
    },
    {
      slug: 'project500',
      name: 'project500',
      category: 'Brand Identity',
      year: '2024',
      description: 'Design of the project500 visual identity. Project500 or p500 was a personal fun project with the goal of learning new skills and later building a p500 dashboard website.',
      images: 6,
    },
    {
      slug: 'bookcover',
      name: 'Bookcovers',
      category: 'Editorial Design',
      year: '2024\u20132026',
      description: 'Various bookcovers designed for masselverlag as well as jedition.',
      images: 5,
    },
  ];

  /* --- Mobile detect --- */
  const isMobile = () => window.innerWidth <= 768;

  /* =====================
     PRELOADER
     ===================== */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
      preloader.classList.add('hide');
      setTimeout(() => {
        preloader.style.display = 'none';
        initAnimations();
      }, 800);
    }, 1400);
  });

  /* =====================
     LENIS SMOOTH SCROLL
     ===================== */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect GSAP ScrollTrigger to Lenis
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  /* =====================
     SCROLL PROGRESS BAR
     ===================== */
  const progressBar = document.querySelector('.scroll-progress-bar');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  });

  /* =====================
     CUSTOM CURSOR
     ===================== */
  if (!isMobile()) {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = cursor.querySelector('.cursor-dot');
    const cursorRing = cursor.querySelector('.cursor-ring');
    let cursorX = 0, cursorY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    });

    function animateCursor() {
      currentX += (cursorX - currentX) * 0.15;
      currentY += (cursorY - currentY) * 0.15;
      cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    const clickables = document.querySelectorAll('a, button, input, textarea, .project-item');
    clickables.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // Show "View" text on project items
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('show-text'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('show-text'));
    });
  }

  /* =====================
     HERO — Variable font weight on mouse X
     ===================== */
  const heroName = document.querySelector('.hero-name');
  const hero = document.querySelector('.hero');

  if (!isMobile()) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 to 1
      const weight = Math.round(200 + x * 600); // 200 to 800
      document.documentElement.style.setProperty('--font-weight', weight);
      heroName.style.fontVariationSettings = `'wght' ${weight}`;
    });
  }

  /* =====================
     HERO — Rotating tagline
     ===================== */
  const taglines = ['Brand Identity Designer', 'Web Developer', 'Visual Thinker'];
  const taglineEl = document.querySelector('.hero-tagline');
  let taglineIndex = 0;

  function rotateTagline() {
    taglineEl.style.opacity = '0';
    taglineEl.style.transform = 'translateY(8px)';
    setTimeout(() => {
      taglineIndex = (taglineIndex + 1) % taglines.length;
      taglineEl.textContent = taglines[taglineIndex];
      taglineEl.style.opacity = '1';
      taglineEl.style.transform = 'translateY(0)';
    }, 400);
  }
  setInterval(rotateTagline, 3000);

  /* =====================
     HERO — Noise canvas
     ===================== */
  const noiseCanvas = document.querySelector('.hero-noise');
  if (noiseCanvas) {
    const ctx = noiseCanvas.getContext('2d');
    let animFrameNoise;

    function resizeNoise() {
      noiseCanvas.width = noiseCanvas.offsetWidth / 4;
      noiseCanvas.height = noiseCanvas.offsetHeight / 4;
    }
    resizeNoise();
    window.addEventListener('resize', resizeNoise);

    function drawNoise() {
      const w = noiseCanvas.width;
      const h = noiseCanvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 25;
      }
      ctx.putImageData(imageData, 0, 0);
      animFrameNoise = requestAnimationFrame(drawNoise);
    }
    drawNoise();
  }

  /* =====================
     PROJECT HOVER PREVIEW
     ===================== */
  if (!isMobile()) {
    const preview = document.querySelector('.project-preview');
    const previewImg = document.querySelector('.project-preview-img');
    const projectItemsList = document.querySelectorAll('.project-item');

    projectItemsList.forEach((item) => {
      const slug = item.dataset.project;

      item.addEventListener('mouseenter', () => {
        previewImg.src = `portfolio_files/${slug}/1.avif`;
        previewImg.alt = slug;
        preview.classList.add('visible');
      });

      item.addEventListener('mouseleave', () => {
        preview.classList.remove('visible');
      });

      item.addEventListener('mousemove', (e) => {
        preview.style.left = (e.clientX + 24) + 'px';
        preview.style.top = (e.clientY - 110) + 'px';
      });
    });
  }

  /* =====================
     PROJECT CLICK → CASE STUDY
     ===================== */
  const caseStudy = document.getElementById('case-study');
  const caseTitle = caseStudy.querySelector('.case-title');
  const caseCategory = caseStudy.querySelector('.case-category');
  const caseYear = caseStudy.querySelector('.case-year');
  const caseMainImg = caseStudy.querySelector('.case-main-image img');
  const caseDesc = caseStudy.querySelector('.case-description p');
  const caseGallery = caseStudy.querySelector('.case-gallery');
  const caseBack = caseStudy.querySelector('.case-back');

  document.querySelectorAll('.project-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(item.dataset.index);
      const project = projects[idx];
      openCaseStudy(project);
    });
  });

  function openCaseStudy(project) {
    caseTitle.textContent = project.name;
    caseCategory.textContent = project.category;
    caseYear.textContent = project.year;
    caseMainImg.src = `portfolio_files/${project.slug}/1.avif`;
    caseMainImg.alt = project.name;
    caseDesc.textContent = project.description;

    // Build gallery (skip image 1, it's the hero)
    caseGallery.innerHTML = '';
    for (let i = 2; i <= project.images; i++) {
      const div = document.createElement('div');
      div.className = 'case-gallery-item';
      const img = document.createElement('img');
      img.src = `portfolio_files/${project.slug}/${i}.avif`;
      img.alt = `${project.name} — ${i}`;
      img.loading = 'lazy';
      div.appendChild(img);
      caseGallery.appendChild(div);
    }

    caseStudy.classList.add('open');
    caseStudy.scrollTop = 0;
    lenis.stop();
    document.body.style.overflow = 'hidden';

    // Animate gallery items with parallax offsets
    setTimeout(() => {
      const galleryItems = caseGallery.querySelectorAll('.case-gallery-item');
      galleryItems.forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.1 * i,
            ease: 'power2.out',
          }
        );
      });
    }, 400);
  }

  function closeCaseStudy() {
    caseStudy.classList.remove('open');
    lenis.start();
    document.body.style.overflow = '';
  }

  caseBack.addEventListener('click', closeCaseStudy);

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseStudy.classList.contains('open')) {
      closeCaseStudy();
    }
  });

  /* =====================
     INIT SCROLL ANIMATIONS
     ===================== */
  function initAnimations() {
    // Hero entrance
    gsap.fromTo('.hero-content', { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.2,
    });

    gsap.fromTo('.scroll-indicator', { opacity: 0 }, {
      opacity: 1, duration: 0.8, delay: 1,
    });

    // Section label reveals
    gsap.utils.toArray('.section-label').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    // Project items stagger
    gsap.utils.toArray('.project-item').forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          delay: i * 0.1,
          scrollTrigger: { trigger: item, start: 'top 88%' },
        }
      );
    });

    // About paragraphs — reveal on scroll
    gsap.utils.toArray('.about-paragraph').forEach((p) => {
      gsap.fromTo(p,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: p, start: 'top 82%' },
          onComplete: () => p.classList.add('revealed'),
        }
      );
    });

    // About photo parallax
    if (!isMobile()) {
      gsap.to('.about-photo img', {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-photo',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    // Skills stagger
    gsap.utils.toArray('.skill-group').forEach((group, i) => {
      gsap.fromTo(group,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          delay: i * 0.1,
          scrollTrigger: { trigger: group, start: 'top 88%' },
        }
      );
    });

    // Contact title reveal
    gsap.fromTo('.contact-title',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.contact-title', start: 'top 82%' },
        onComplete: () => document.querySelector('.contact-title').classList.add('revealed'),
      }
    );

    // Contact form + links fade in
    gsap.fromTo('.contact-form',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.contact-form', start: 'top 85%' },
      }
    );

    gsap.fromTo('.contact-links',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2,
        scrollTrigger: { trigger: '.contact-links', start: 'top 85%' },
      }
    );
  }

  /* =====================
     NAV SMOOTH SCROLL
     ===================== */
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { offset: -60 });
      }
    });
  });

  // Logo click scrolls to top
  document.querySelector('.nav-logo').addEventListener('click', (e) => {
    e.preventDefault();
    lenis.scrollTo(0);
  });

  /* =====================
     CONTACT FORM HANDLER
     ===================== */
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = 'Sent!';
    btn.style.background = 'var(--accent)';
    btn.style.color = 'var(--bg)';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      btn.style.color = '';
      contactForm.reset();
    }, 2500);
  });

})();
