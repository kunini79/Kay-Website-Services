gsap.registerPlugin(ScrollTrigger);


document.addEventListener("DOMContentLoaded", () => {
	//Product Detail sticky (requires unique behavior)
	const productDetailPage = document.querySelector(".product-detail");
	if (productDetailPage) {

		const contentContainer = document.querySelector('.content-container');
		const contentDetail = document.querySelector('.content-detail');
		const buffer = 50;
		let lastScrollY = window.scrollY;
		let isEnabled = window.innerWidth >= 992;
		let scrollTimeout;

		function handleScroll() {
			if (!isEnabled) return;

			const currentScrollY = window.scrollY;
			const containerRect = contentContainer.getBoundingClientRect();
			const containerTop = containerRect.top + window.scrollY;
			const containerBottom = containerRect.bottom + window.scrollY;

			const isScrollingUp = currentScrollY < lastScrollY;
			const isWithinBufferedContainer =
				currentScrollY >= (containerTop - buffer) &&
				currentScrollY <= containerBottom;

			if (isScrollingUp && isWithinBufferedContainer) {
				contentDetail.classList.add('scrolling-up');
			} else {
				contentDetail.classList.remove('scrolling-up');
			}

			lastScrollY = currentScrollY;
		}

		function debounceScroll() {
			if (scrollTimeout) {
				clearTimeout(scrollTimeout);
			}
			scrollTimeout = setTimeout(handleScroll, 50); 
		}

		function checkWidth() {
			isEnabled = window.innerWidth >= 992;
			if (!isEnabled) {
				contentDetail.classList.remove('scrolling-up');
			}
		}

		window.addEventListener('scroll', debounceScroll);
		window.addEventListener('resize', checkWidth);

	}

	//Attraction Listing sticky (requires unique behavior)
	const attractionListingPage = document.querySelector(".attraction-text-column");
	if (attractionListingPage) {

		const contentContainer = document.querySelector('.attraction-listing');
		const contentDetail = document.querySelector('.attraction-sticky');
		const buffer = 50;
		let lastScrollY = window.scrollY;
		let isEnabled = window.innerWidth >= 992;
		let scrollTimeout;

		function handleScroll() {
			if (!isEnabled) return;

			const currentScrollY = window.scrollY;
			const containerRect = contentContainer.getBoundingClientRect();
			const containerTop = containerRect.top + window.scrollY;
			const containerBottom = containerRect.bottom + window.scrollY;

			const isScrollingUp = currentScrollY < lastScrollY;
			const isWithinBufferedContainer =
				currentScrollY >= (containerTop - buffer) &&
				currentScrollY <= containerBottom;

			if (isScrollingUp && isWithinBufferedContainer) {
				contentDetail.classList.add('scrolling-up');
			} else {
				contentDetail.classList.remove('scrolling-up');
			}

			lastScrollY = currentScrollY;
		}

		function debounceScroll() {
			if (scrollTimeout) {
				clearTimeout(scrollTimeout);
			}
			scrollTimeout = setTimeout(handleScroll, 50);
		}

		function checkWidth() {
			isEnabled = window.innerWidth >= 992;
			if (!isEnabled) {
				contentDetail.classList.remove('scrolling-up');
			}
		}

		window.addEventListener('scroll', debounceScroll);
		window.addEventListener('resize', checkWidth);

	}


	//Timeline
	const slides = document.querySelectorAll(".slide");
	const progressBar = document.querySelector(".progress-bar");
	const circles = document.querySelectorAll(".circle");
	const timelineSection = document.querySelector(".timeline-section");

	if (slides.length && progressBar && circles.length && timelineSection) {
		let tl = gsap.timeline({
			scrollTrigger: {
				trigger: ".timeline-section",
				pin: true,
				scrub: 1,
				start: "top top",
				end: "+=300%",
				snap: { snapTo: "labels", duration: 0.5, delay: 0.1 },
				onLeave: () => {
					// Release pin smoothly when scrolling past the last slide
					ScrollTrigger.getById("timeline-pin")?.disable();
				}
			},
		});

		gsap.set(slides[0], { opacity: 1 }); // Ensure first slide stays visible

		slides.forEach((slide, index) => {
			let year = slide.getAttribute("data-year");

			tl.addLabel(year);

			if (index !== 0) {
				tl.to(slide, { opacity: 1, duration: 0.5 }, "<");
			}

			// Adjusted Progress Bar Fill (to not start at 0%)
			tl.to(
				progressBar,
				{ width: `${5 + (index / (slides.length - 1)) * 90}%` },
				"<"
			);

			// Fill circle on active slide
			tl.to(circles[index], { background: "green" }, "<");

			// Only fade out slides if they are NOT the last one
			if (index < slides.length - 1) {
				tl.to(slide, { opacity: 0, duration: 0.5 }, "+=1.5");
			}
		});

		tl.to(".timeline-section", { opacity: 0, duration: 0.5 });
	}
});

document.addEventListener("DOMContentLoaded", function () { 
	
	
});
