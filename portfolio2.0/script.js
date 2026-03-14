document.addEventListener("DOMContentLoaded", () => {

	// ─── CUSTOM CURSOR ────────────────────────────────────────────────
	const dot  = document.getElementById("cursor-dot");
	const ring = document.getElementById("cursor-ring");

	let mouseX = 0, mouseY = 0;
	let ringX  = 0, ringY  = 0;

	document.addEventListener("mousemove", e => {
		mouseX = e.clientX;
		mouseY = e.clientY;
		dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
	});

	(function animateRing() {
		ringX += (mouseX - ringX) * 0.12;
		ringY += (mouseY - ringY) * 0.12;
		ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
		requestAnimationFrame(animateRing);
	})();

	const hoverTargets = "a, button, .project-card, .skill-item, .tag, .ov-dot, .nav-logo";
	document.querySelectorAll(hoverTargets).forEach(el => {
		el.addEventListener("mouseenter", () => ring.classList.add("hover"));
		el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
	});

	// ─── NAV: scroll-glass + active section ──────────────────────────
	const nav      = document.getElementById("nav");
	const navLinks = document.querySelectorAll(".nav-link");

	window.addEventListener("scroll", () => {
		nav.classList.toggle("scrolled", window.scrollY > 40);
	}, { passive: true });

	const sections = document.querySelectorAll("section[id]");

	const navObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				navLinks.forEach(l => l.classList.remove("active"));
				const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
				if (active) active.classList.add("active");
			}
		});
	}, { threshold: 0.4 });

	sections.forEach(s => navObserver.observe(s));

	// ─── HERO SCROLL INDICATOR ────────────────────────────────────────
	const heroScroll = document.getElementById("hero-scroll");
	window.addEventListener("scroll", () => {
		heroScroll.style.opacity = window.scrollY > 80 ? "0" : "1";
	}, { passive: true });

	// ─── REVEAL ON SCROLL ────────────────────────────────────────────
	const revealObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add("visible");
				revealObserver.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12 });

	document.querySelectorAll(".reveal-up").forEach(el => revealObserver.observe(el));

	// ─── PROJECT DATA ─────────────────────────────────────────────────
	const projects = {
		alukeku: {
			title:       "ALUKEKU Brand Identity",
			category:    "Brand Identity · Angola",
			description: `Design of the ALUKEKU brand identity and visual guidelines. ALUKEKU is an Architecture and Construction company from Angola. The finished Brand Guidelines Presentation can be viewed <a href="../files/ALUKEKU-Brand%20Guidelines.pdf" target="_blank">here</a>.`,
			count: 9
		},
		landeshut: {
			title:       "Landeshut Brand Identity",
			category:    "Brand Identity · Bavaria, Germany",
			description: "Design of the Landeshut Brand Identity. Landeshut is a local nonprofit organisation that brings local communities together in the area of Bavaria, Germany.",
			count: 6
		},
		stooney: {
			title:       "Stooney Brand Identity",
			category:    "Brand Identity · Germany",
			description: "Designs of the Stooney Brand Identity. Stooney is a Germany-based small company that makes high quality hand-made designer lamps out of raw stones and gems.",
			count: 6
		},
		project500: {
			title:       "project500 Visual Identity",
			category:    "Visual Identity · Personal Project",
			description: "Design of the project500 visual identity. Project500 (p500) was a personal fun project with the goal of learning new skills and later building a p500 dashboard website.",
			count: 6
		},
		bookcover: {
			title:       "Bookcover Designs",
			category:    "Print Design · Various Clients",
			description: `Various bookcovers designed over the past 2 years, mostly for <a href="https://masselverlag.de" target="_blank">masselverlag</a> as well as <a href="https://jedition.de" target="_blank">jedition</a>.`,
			count: 5
		}
	};

	// ─── PROJECT OVERLAY ──────────────────────────────────────────────
	const overlay    = document.getElementById("project-overlay");
	const track      = document.getElementById("carousel-track");
	const dotsEl     = document.getElementById("ov-dots");
	const titleEl    = document.getElementById("ov-title");
	const categoryEl = document.getElementById("ov-category");
	const descEl     = document.getElementById("ov-desc");

	let currentSlide = 0;
	let slideCount   = 0;

	function openOverlay(project) {
		const data = projects[project];
		if (!data) return;

		slideCount   = data.count;
		currentSlide = 0;

		titleEl.textContent    = data.title;
		categoryEl.textContent = data.category;
		descEl.innerHTML       = data.description;

		// Build slides
		track.innerHTML = "";
		for (let i = 1; i <= data.count; i++) {
			const slide = document.createElement("div");
			slide.className = "carousel-slide";
			const img = document.createElement("img");
			img.src     = `portfolio_files/${project}/${i}.avif`;
			img.loading = i === 1 ? "eager" : "lazy";
			img.alt     = `${data.title} — image ${i}`;
			slide.appendChild(img);
			track.appendChild(slide);
		}

		// Build dots
		dotsEl.innerHTML = "";
		for (let i = 0; i < data.count; i++) {
			const dot = document.createElement("div");
			dot.className = "ov-dot" + (i === 0 ? " active" : "");
			dot.addEventListener("click", () => goToSlide(i));
			dot.addEventListener("mouseenter", () => ring.classList.add("hover"));
			dot.addEventListener("mouseleave",  () => ring.classList.remove("hover"));
			dotsEl.appendChild(dot);
		}

		updateCarousel();
		overlay.classList.remove("hidden");
		document.body.style.overflow = "hidden";
	}

	function closeOverlay() {
		overlay.classList.add("hidden");
		document.body.style.overflow = "";
	}

	function goToSlide(index) {
		currentSlide = Math.max(0, Math.min(index, slideCount - 1));
		updateCarousel();
	}

	function updateCarousel() {
		track.style.transform = `translateX(-${currentSlide * 100}%)`;
		dotsEl.querySelectorAll(".ov-dot").forEach((d, i) => {
			d.classList.toggle("active", i === currentSlide);
		});
	}

	document.getElementById("ov-prev").addEventListener("click", () => goToSlide(currentSlide - 1));
	document.getElementById("ov-next").addEventListener("click", () => goToSlide(currentSlide + 1));
	document.getElementById("ov-close").addEventListener("click", closeOverlay);

	overlay.addEventListener("click", e => {
		if (e.target === overlay) closeOverlay();
	});

	document.addEventListener("keydown", e => {
		if (overlay.classList.contains("hidden")) return;
		if (e.key === "Escape")     closeOverlay();
		if (e.key === "ArrowLeft")  goToSlide(currentSlide - 1);
		if (e.key === "ArrowRight") goToSlide(currentSlide + 1);
	});

	// Attach click to project cards
	document.querySelectorAll(".project-card").forEach(card => {
		card.addEventListener("click", () => {
			const project = card.dataset.project;
			if (project) openOverlay(project);
		});
	});

	// ─── GHOST LOGO (skills section) ─────────────────────────────────
	const ghost    = document.getElementById("ghost-logo");
	const ghostImg = document.getElementById("ghost-logo-img");

	document.querySelectorAll(".skill-item").forEach(item => {
		item.addEventListener("mouseenter", () => {
			ghostImg.src = item.dataset.logo || "";
			ghost.classList.add("visible");
		});
		item.addEventListener("mousemove", e => {
			ghost.style.left = e.clientX + "px";
			ghost.style.top  = e.clientY + "px";
		});
		item.addEventListener("mouseleave", () => {
			ghost.classList.remove("visible");
		});
	});

	// ─── CONTACT FORM ─────────────────────────────────────────────────
	document.getElementById("sendBtn").addEventListener("click", () => {
		const message  = document.getElementById("message").value.trim();
		const contact  = document.getElementById("contact-input").value.trim();
		const feedback = document.getElementById("feedback");

		if (message.length < 5) {
			feedback.innerHTML = "<span style='color:#e06c6c'>Please write a longer message.</span>";
			return;
		}
		if (contact.length < 3) {
			feedback.innerHTML = "<span style='color:#e06c6c'>Please enter a valid contact option.</span>";
			return;
		}

		feedback.innerHTML = "<span style='color:var(--muted)'>Sending…</span>";

		fetch("send.php", {
			method:  "POST",
			headers: { "Content-Type": "application/json" },
			body:    JSON.stringify({ message, contact })
		})
		.then(res => res.text())
		.then(() => {
			feedback.innerHTML = "<span style='color:#4CAF79'>Message sent successfully.</span>";
			document.getElementById("message").value       = "";
			document.getElementById("contact-input").value = "";
		})
		.catch(() => {
			feedback.innerHTML = "<span style='color:#e06c6c'>Something went wrong. Please try again.</span>";
		});
	});

});
