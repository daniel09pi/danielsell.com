document.addEventListener("DOMContentLoaded", () => {


	window.addEventListener("load", () => {

				// kleine Pause damit First Paint nicht gestört wird
				setTimeout(() => {
						preloadProject("alukeku");
						preloadProject("project500");
						preloadProject("stooney");
						preloadProject("bookcover");
						preloadProject("landeshut");
				}, 500);

		});

		const words = ["Hello.", "Hola.", "Hallo."];

		const typeTarget = document.getElementById("typewriter");
		const cursor = document.querySelector(".cursor");

		const typingSpeed = 100;
		const deletingSpeed = 60;
		const holdTime = 3000;

		let wordIndex = 0;
		let charIndex = 0;
		let isDeleting = false;
		let isPause = false;

		function typeLoop() {
				const currentWord = words[wordIndex];

				if (!isDeleting && !isPause) {
						// Schreiben
						cursor.style.opacity = "1"; // Cursor immer sichtbar
						typeTarget.textContent = currentWord.substring(0, charIndex + 1);
						charIndex++;

						if (charIndex === currentWord.length) {
								// Start Pause
								isPause = true;
								cursor.style.animation = "blink 1s steps(1,end) infinite";
								setTimeout(() => {
										isPause = false;
										isDeleting = true;
										cursor.style.animation = ""; // Stoppe blink während Löschen
								}, holdTime);
						}
				} else if (isDeleting) {
						// Löschen
						cursor.style.opacity = "1"; // Cursor immer sichtbar
						typeTarget.textContent = currentWord.substring(0, charIndex - 1);
						charIndex--;

						if (charIndex === 0) {
								isDeleting = false;
								wordIndex = (wordIndex + 1) % words.length;
						}
				}

				const timeout = isDeleting ? deletingSpeed : typingSpeed;
				setTimeout(typeLoop, timeout);
		}

		typeLoop();




		const scrollcontainer = document.getElementById("scrollcontainer");
		const scrollDownBtn = document.getElementById("scroll_down_btn");
		const scrollUpBtn = document.getElementById("scroll_up_btn");
		const navItems = document.querySelectorAll(".nav-item");
		const buttonLabels = document.querySelectorAll(".responsive-box .text-mine");

		const upContainer = scrollUpBtn.closest(".w-100");
		const downContainer = scrollDownBtn.closest(".w-100");

		let currentSection = 0;
		const sectionCount = navItems.length;

		function smoothScrollToSection(index, duration = 900) {
				const containerHeight = scrollcontainer.clientHeight;
				const target = index * containerHeight;
				const start = scrollcontainer.scrollTop;
				const startTime = performance.now();

				function animate(currentTime) {
						const timeElapsed = currentTime - startTime;
						const progress = Math.min(timeElapsed / duration, 1);

						const ease = progress < 0.5
								? 2 * progress * progress
								: 1 - Math.pow(-2 * progress + 2, 2) / 2;

						scrollcontainer.scrollTop = start + (target - start) * ease;

						if (progress < 1) {
								requestAnimationFrame(animate);
						}
				}

				requestAnimationFrame(animate);
		}

		function updateActiveNav(index) {
				navItems.forEach(item => item.classList.remove("active"));
				navItems[index].classList.add("active");
		}

		function updateButtons(index) {
				const upLabel = buttonLabels[0];
				const downLabel = buttonLabels[1];

				upLabel.textContent = index > 0 
						? navItems[index - 1].textContent 
						: navItems[0].textContent;

				downLabel.textContent = index < sectionCount - 1 
						? navItems[index + 1].textContent 
						: navItems[sectionCount - 1].textContent;
		}

		function detectCurrentSection() {
				const containerHeight = scrollcontainer.clientHeight;
				const index = Math.round(scrollcontainer.scrollTop / containerHeight);

				if (index !== currentSection) {
						currentSection = index;
						updateActiveNav(index);
						updateButtons(index);
						updateButtonState(index); // 👈 neu
				}
		}

		scrollcontainer.addEventListener("scroll", detectCurrentSection);

		scrollDownBtn.addEventListener("click", () => {
				if (currentSection < sectionCount - 1) {
						smoothScrollToSection(currentSection + 1);
				}
		});

		scrollUpBtn.addEventListener("click", () => {
				if (currentSection > 0) {
						smoothScrollToSection(currentSection - 1);
				}
		});

		navItems.forEach(item => {
				item.addEventListener("click", () => {
						const index = parseInt(item.dataset.index);
						smoothScrollToSection(index);
				});
		});

		updateActiveNav(0);
		updateButtons(0);

		function updateButtonState(index) {
				if (index === 0) {
						upContainer.style.opacity = "0.5";
				} else {
						upContainer.style.opacity = "1";
				}

				if (index === sectionCount - 1) {
						downContainer.style.opacity = "0.5";
				} else {
						downContainer.style.opacity = "1";
				}
		}



    const container = document.querySelector(".full_image_container");
    const carouselElement = document.getElementById("myCarousel");
    const carouselInner = carouselElement.querySelector(".carousel-inner");
    const navContainer = document.getElementById("carouselNav");

		const projectTitleElem = document.getElementById("project-title");
		const projectDescriptionElem = document.getElementById("project-description");

    const bg1 = container.querySelector(".bg1");
    const bg2 = container.querySelector(".bg2");
    let activeLayer = bg1;
    let inactiveLayer = bg2;

    let carousel; // bootstrap carousel instance

    // ------------------------
    // Helper: Average Color
    // ------------------------
function getAverageColor(img) {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = img.naturalWidth;
    const height = img.naturalHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0);

    const border = 20;

    let r = 0, g = 0, b = 0, count = 0;

    function sampleArea(x, y, w, h) {
        const data = ctx.getImageData(x, y, w, h).data;

        for (let i = 0; i < data.length; i += 40) { // höherer Schritt = schneller
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }
    }

    // 🔹 Linker Rand
    sampleArea(0, 0, border, height);

    // 🔹 Rechter Rand
    sampleArea(width - border, 0, border, height);

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    return `rgb(${r}, ${g}, ${b})`;
}

		function getDominantColor(img) {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;

				ctx.drawImage(img, 0, 0);

				const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

				const colorMap = {};
				let maxCount = 0;
				let dominantColor = '';

				for (let i = 0; i < data.length; i += 4) { // jedes Pixel
						// Pixel runden auf 32 Stufen, um ähnliche Farben zu gruppieren
						const r = Math.floor(data[i] / 32) * 32;
						const g = Math.floor(data[i + 1] / 32) * 32;
						const b = Math.floor(data[i + 2] / 32) * 32;
						const key = `${r},${g},${b}`;

						colorMap[key] = (colorMap[key] || 0) + 1;

						if (colorMap[key] > maxCount) {
								maxCount = colorMap[key];
								dominantColor = key;
						}
				}

				return `rgb(${dominantColor})`;
		}

    // ------------------------
    // Helper: Crossfade Background
    // ------------------------
    function setBackground(img) {
        const newColor = getAverageColor(img);

        inactiveLayer.style.backgroundColor = newColor;
        inactiveLayer.style.opacity = 1;
        activeLayer.style.opacity = 0;

        [activeLayer, inactiveLayer] = [inactiveLayer, activeLayer];
    }

    // ------------------------
    // Load Images for a Project
    // ------------------------
    const projectImageCount = {
				alukeku: 9,
				project500: 6,
				stooney: 6,
				bookcover: 5,
				landeshut: 6
		};

		function preloadProject(project) {

				const total = projectImageCount[project];
				if (!total) return;

				for (let i = 1; i <= total; i++) {
						const img = new Image();
						img.src = `portfolio_files/${project}/${i}.avif`;
				}
		}

		async function loadCarousel(project) {

				carouselInner.innerHTML = "";
				navContainer.querySelectorAll(".rounded-5").forEach(dot => dot.remove());

				const total = projectImageCount[project];
				if (!total) return;

				if (carousel) carousel.dispose();

				// 👉 1️⃣ Erstes Bild SOFORT rendern
				const firstSrc = `portfolio_files/${project}/1.avif`;

				createSlide(firstSrc, 0, true);
				createDot(0, true);

				carousel = new bootstrap.Carousel(carouselElement, { interval: false });

				// Background sofort setzen
				const firstImg = carouselElement.querySelector(".carousel-item img");
				firstImg.onload = () => setBackground(firstImg);

				// 👉 2️⃣ Rest async nachladen (nicht blockierend)
				for (let i = 2; i <= total; i++) {

						const src = `portfolio_files/${project}/${i}.avif`;

						// Browser lädt automatisch durch img.src
						createSlide(src, i - 1, false);
						createDot(i - 1, false);
				}

				// Buttons
				document.getElementById("prevBtn").onclick = () => carousel.prev();
				document.getElementById("nextBtn").onclick = () => carousel.next();

				// Slide Event
				carouselElement.addEventListener("slide.bs.carousel", event => {

						const nextSlide = carouselElement
								.querySelectorAll(".carousel-item")[event.to];

						const img = nextSlide.querySelector("img");

						if (img.complete) setBackground(img);
						else img.onload = () => setBackground(img);

						updateDots(event.to);
				});
		}

		// -------- Helper Functions --------

		function createSlide(src, index, active) {

				const item = document.createElement("div");
				item.classList.add("carousel-item");
				if (active) item.classList.add("active");

				const img = document.createElement("img");
				img.src = src;
				img.loading = index === 0 ? "eager" : "lazy"; // 👈 PERFORMANCE
				img.decoding = "async";
				img.classList.add("d-block", "w-100");
				img.style.objectFit = "contain";
				img.style.maxHeight = "100%";

				item.appendChild(img);
				carouselInner.appendChild(item);
		}

		function createDot(index, active) {

				const dot = document.createElement("div");

				dot.classList.add(
						"rounded-5",
						active ? "bg-mine" : "bg-mine-light"
				);

				dot.style.width = "16px";
				dot.style.height = "16px";
				dot.style.cursor = "pointer";

				dot.addEventListener("click", () => carousel.to(index));

				navContainer.insertBefore(dot, document.getElementById("nextBtn"));
		}

		function updateDots(activeIndex) {

				const dots = navContainer.querySelectorAll(".rounded-5");

				dots.forEach(dot => {
						dot.classList.remove("bg-mine");
						dot.classList.add("bg-mine-light");
				});

				dots[activeIndex].classList.remove("bg-mine-light");
				dots[activeIndex].classList.add("bg-mine");
		}

    // ------------------------
    // Initial load
    // ------------------------
    loadCarousel(carouselElement.dataset.currentProject);
		const currentlySelectedImgBox = document.querySelector(".img-box.big[data-is-selected='true']");
		projectTitleElem.innerHTML = currentlySelectedImgBox.dataset.projectTitle || "";
		projectDescriptionElem.innerHTML = currentlySelectedImgBox.dataset.projectDescription || "";;
		

    // ------------------------
    // Thumbnail Hover + Click
    // ------------------------
    const boxes = document.querySelectorAll('#hover_container .img-box');
    let leaveTimer = null;

    boxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
            boxes.forEach(b => b.classList.remove('big'));
            box.classList.add('big');
        });

        box.addEventListener('mouseleave', () => {
            leaveTimer = setTimeout(() => {
                const selected = document.querySelector('.img-box[data-is-selected]');
                boxes.forEach(b => b.classList.remove('big'));
                selected?.classList.add('big');
            }, 300);
        });

        box.addEventListener('click', () => {
            boxes.forEach(b => b.removeAttribute("data-is-selected"));
            box.setAttribute("data-is-selected", "true");

            const project = box.dataset.currentProject;
						const title = box.dataset.projectTitle || "";
						const description = box.dataset.projectDescription || "";

						projectTitleElem.innerHTML = title;
						projectDescriptionElem.innerHTML = description;
            if (project) loadCarousel(project);
        });
    });

    // ------------------------
    // Custom Scrollbar
    // ------------------------
    class CustomScrollbar {
				constructor(container) {
						this.container = container;
						this.content = container.querySelector('.overflow_scroll2');
						this.thumb = container.querySelector('.scrollbar-thumb');

						this.isDragging = false;
						this.startY = 0;
						this.startTop = 0;

						this.init();
				}

				init() {
						this.updateThumbSize();
						this.updateThumbPosition();

						// Scroll synchronisieren
						this.content.addEventListener('scroll', () => this.updateThumbPosition());

						// Resize
						window.addEventListener('resize', () => { 
								this.updateThumbSize();
								this.updateThumbPosition();
						});

						// Drag Thumb
						this.thumb.addEventListener('mousedown', e => {
								this.isDragging = true;
								this.startY = e.clientY;
								this.startTop = this.thumb.offsetTop;
								this.thumb.style.cursor = "grabbing";
						});

						document.addEventListener('mousemove', e => {
								if (!this.isDragging) return;
								let newTop = this.startTop + (e.clientY - this.startY);
								const maxTop = this.content.clientHeight - this.thumb.clientHeight;
								newTop = Math.max(0, Math.min(newTop, maxTop));
								this.thumb.style.top = newTop + 'px';
								this.content.scrollTop = (newTop / maxTop) * (this.content.scrollHeight - this.content.clientHeight);
						});

						document.addEventListener('mouseup', () => {
								if (this.isDragging) this.thumb.style.cursor = "grab";
								this.isDragging = false;
						});
				}

				updateThumbSize() {
						const thumbHeight = (this.content.clientHeight / this.content.scrollHeight) * this.content.clientHeight;
						this.thumb.style.height = thumbHeight + 'px';
				}

				updateThumbPosition() {
						const maxTop = this.content.clientHeight - this.thumb.clientHeight;
						const scrollRatio = this.content.scrollTop / (this.content.scrollHeight - this.content.clientHeight);
						this.thumb.style.top = scrollRatio * maxTop + 'px';
				}
		}

		// Initialisiere alle Scrollbar-Container auf der Seite
		document.querySelectorAll('.scrollbarcontainer').forEach(col => {
				if (col.querySelector('.overflow_scroll2') && col.querySelector('.scrollbar-thumb')) {
						new CustomScrollbar(col);
				}
		});



		const designLogos = [
				"1-ai.png",
				"1-figma.png",
				"1-id.png",
				"1-macbook.png",
				"1-paper.png",
				"1-ps.png"
		];

		const devLogos = [
				"2-css.png",
				"2-html.png",
				"2-js.png",
				"2-laravel.png",
				"2-mysql.png",
				"2-php.png",
				"2-py.png",
				"2-vue.png",

		];

		const ENABLE_SIZE_ANIMATION = true;   // 🔥 HIER ausschalten möglich
		const ROTATION_SPEED = 0.002;         // Drehgeschwindigkeit
		const RADIUS_PERCENT = 0.35;          // Kreisgröße relativ zum Container

		initCircle("design-logos", designLogos);
		initCircle("dev-logos", devLogos);


		function initCircle(containerId, files) {

				const container = document.getElementById(containerId);

				const wrapper = document.createElement("div");
				wrapper.classList.add("circle-wrapper");
				container.appendChild(wrapper);

				const logos = [];
				const radius = container.clientWidth * RADIUS_PERCENT;

				files.forEach((file, index) => {

						const img = document.createElement("img");
						img.src = "portfolio_files/logos/" + file;
						img.classList.add("circle-logo");
						img.loading = "lazy";   // 👈 DAS ist Lazy Load
						wrapper.appendChild(img);

						logos.push({
								el: img,
								baseAngle: (index / files.length) * Math.PI * 2,
								sizeOffset: Math.random() * Math.PI * 2
						});
				});

				let rotation = 0;

				function animate() {

						rotation += ROTATION_SPEED;

						logos.forEach(l => {

								const angle = l.baseAngle + rotation;

								const x = Math.cos(angle) * radius;
								const y = Math.sin(angle) * radius;

								let scale = 1;

								if (ENABLE_SIZE_ANIMATION) {
										scale = 0.60 + 0.3 * Math.sin(rotation * 2 + l.sizeOffset);
								}

								l.el.style.transform =
										`translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
						});

						requestAnimationFrame(animate);
				}

				animate();
		}



		
		document.getElementById("sendBtn").addEventListener("click", function() {

				const message = document.getElementById("message").value.trim();
				const contact = document.getElementById("contact").value.trim();
				const feedback = document.getElementById("feedback");

				if (message.length < 5) {
						feedback.innerHTML = "<p style='color:red;'>Please write a longer message.</p>";
						return;
				}

				if (contact.length < 3) {
						feedback.innerHTML = "<p style='color:red;'>Please enter a valid contact option.</p>";
						return;
				}

				feedback.innerHTML = "<p style='color:gray;'>Sending message...</p>";

				fetch("send.php", {
						method: "POST",
						headers: {
								"Content-Type": "application/json"
						},
						body: JSON.stringify({
								message: message,
								contact: contact
						})
				})
				.then(res => res.text())
				.then(data => {
						feedback.innerHTML = "<p style='color:green;'>Message successfully sent 🚀</p>";
						document.getElementById("message").value = "";
						document.getElementById("contact").value = "";
				})
				.catch(err => {
						feedback.innerHTML = "<p style='color:red;'>Something went wrong. Please try again.</p>";
						console.error(err);
				});
		});






});