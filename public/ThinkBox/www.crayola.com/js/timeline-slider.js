document.addEventListener("DOMContentLoaded", () => {
    const swiper = new Swiper(".timeline-swipper", {
        pagination: {
            el: ".swiper-pagination",
            type: "progressbar"
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        on: {
            slideChange: function () {
                updateActiveCircle(this.realIndex);
                updateProgress();
                trapTabbing(); 
            },
        },
        slidesPerView: 1,
        spaceBetween: 0,
        watchOverflow: true,
        allowTouchMove: true,
        loop: false,
        loopAddBlankSlides: false,
    });

    const timelineCircles = document.querySelector(".timeline-circles");
    const slides = document.querySelectorAll(".timeline-swipper .swiper-slide");
    const totalSlides = slides.length;

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function positionTimelineCircles() {
        if (!timelineCircles) return;

        const circleContainer = document.querySelector('.swiper-pagination-progressbar');
        const containerWidth = circleContainer ? circleContainer.offsetWidth : timelineCircles.offsetWidth;
        const progressBarMargin = 0;
        const usableWidth = containerWidth - (progressBarMargin * 2);
        const circles = timelineCircles.querySelectorAll('.timeline-circle');

        circles.forEach((circle, index) => {
            if (index === 0) {
                circle.style.left = `${progressBarMargin}px`;
            } else if (index === totalSlides - 1) {
                circle.style.right = `${progressBarMargin}px`;
                circle.style.left = 'auto';
            } else {
                const position = (usableWidth * (index / (totalSlides - 1))) + progressBarMargin;
                circle.style.left = `${position}px`;
            }
        });
    }

    function createTimelineItems() {
        if (!timelineCircles) return;

        timelineCircles.innerHTML = '';

        slides.forEach((slide, index) => {
            const year = slide.dataset.year;
            const circleItem = document.createElement("div");
            circleItem.classList.add("timeline-circle");
            circleItem.dataset.index = index;
            circleItem.dataset.year = year;

            circleItem.addEventListener("click", () => {
                swiper.slideTo(parseInt(circleItem.dataset.index));
            });

            timelineCircles.appendChild(circleItem);
        });

        positionTimelineCircles();
    }

    if (timelineCircles) {
        createTimelineItems();
        updateActiveCircle(swiper.realIndex);
        updateProgress();

        window.addEventListener('resize', debounce(() => {
            positionTimelineCircles();
            updateProgress();
        }, 250));
    }

    setTimeout(() => {
        updateProgress();
    }, 100);

    function updateActiveCircle(index) {
        document.querySelectorAll(".timeline-circle").forEach(circle => circle.classList.remove("active"));
        document.querySelectorAll(".timeline-circle")[index]?.classList.add("active");
    }

    function updateProgress() {
        const progress = swiper.realIndex === 0 ? 0 : (swiper.realIndex / (totalSlides - 1)) * 100;
        const progressFill = document.querySelector(".swiper-pagination-progressbar-fill");

        if (progressFill) {
            progressFill.style.width = `${progress}%`;
            progressFill.style.transform = 'translate3d(0px, 0px, 0px)';
        }
    }

    // --------------------------------------
    //  Accessibility: Trap tab navigation
    // --------------------------------------

    function getFocusableElements(container) {
        return Array.from(container.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'))
            .filter(el => !el.disabled && el.offsetParent !== null);
    }

    function trapTabbing() {
        swiper.slides.forEach((slide, index) => {
            const focusables = getFocusableElements(slide);
            if (focusables.length === 0) return;

            const firstEl = focusables[0];
            const lastEl = focusables[focusables.length - 1];

            // Clean up previous listeners
            firstEl.removeEventListener('keydown', firstListener);
            lastEl.removeEventListener('keydown', lastListener);

            function firstListener(e) {
                if (e.key === 'Tab' && e.shiftKey && e.target === firstEl) {
                    if (index > 0) {
                        e.preventDefault();
                        swiper.slideTo(index - 1);
                        setTimeout(() => {
                            const prevFocusables = getFocusableElements(swiper.slides[index - 1]);
                            prevFocusables[prevFocusables.length - 1]?.focus();
                        }, 300);
                    }                    
                }
            }
            function lastListener(e) {
                if (e.key === 'Tab' && !e.shiftKey && e.target === lastEl) {
                    
                    if (index < swiper.slides.length - 1) {
                        e.preventDefault();
                        swiper.slideTo(index + 1);
                        setTimeout(() => {
                            const nextFocusables = getFocusableElements(swiper.slides[index + 1]);
                            nextFocusables[0]?.focus();
                        }, 300);
                    }                   
                }
            }           
            if (index > 0) {
                firstEl.addEventListener('keydown', firstListener);
            }           
            if (index < swiper.slides.length - 1) {
                lastEl.addEventListener('keydown', lastListener);
            }
        });
    }

    // Initial trap
    trapTabbing();
});
