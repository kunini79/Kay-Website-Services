document.addEventListener("DOMContentLoaded", () => {

    const currentUrl = window.location.href;
    var craftPrint = document.getElementById('printBtn-craft');

    if (craftPrint) {
        craftPrint.addEventListener('click', function () {
            if (document.getElementById('printStylesheet')) {
                window.print();
                return;
            }

            const link = document.createElement('link');
            link.id = 'printStylesheet';
            link.rel = 'stylesheet';
            link.href = '/css/dist/print-crafts.css';
            link.media = 'print';

            link.onload = () => {
                window.print();
            };

            document.head.appendChild(link);
        });
    }

    document.querySelectorAll('.related-content').forEach(related => {
        const emptyChild = related.querySelector('.empty');
        if (emptyChild) {
            related.style.display = 'none';
        }
    });

    const showMobileFilter = document.getElementById("show-mobile-filter");
    const hideMobileFilter = document.getElementById("hide-mobile-filter");
    const closeMobileFilter = document.getElementById("close-mobile-filter");
    const mobileFilters = document.getElementById("filters-container");
    const filterUnderlay = document.getElementById("filter-underlay-mobile");

    if (mobileFilters && showMobileFilter && hideMobileFilter && filterUnderlay) {
        showMobileFilter.addEventListener("click", function () {
            mobileFilters.classList.add("is-visible");
            document.body.classList.add("filters-open");
            filterUnderlay.classList.add("show");
            hideMobileFilter.focus(); 
        });

        hideMobileFilter.addEventListener("click", function () {
            closeFilters();
            showMobileFilter.focus(); 
        });
        closeMobileFilter.addEventListener("click", function () {
            closeFilters();
            showMobileFilter.focus();
        });
        mobileFilters.addEventListener("keydown", function (e) {
   
            const isVisible = mobileFilters.classList.contains("is-visible");
            const isMobile = window.innerWidth <= 992;

            if (!isVisible || !isMobile) return;

            const focusableElements = mobileFilters.querySelectorAll(
                'a[href], area[href], input:not([disabled]), select:not([disabled]), ' +
                'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, ' +
                '[tabindex]:not([tabindex="-1"]), [contenteditable]'
            );

            const visibleFocusable = Array.from(focusableElements).filter(el =>
                el.offsetParent !== null
            );

            const first = visibleFocusable[0];
            const last = visibleFocusable[visibleFocusable.length - 1];

            if (e.key === "Tab") {
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
        window.addEventListener("resize", function () {
            closeFilters();
        });

        document.addEventListener("click", function (e) {
            const isClickInside = mobileFilters.contains(e.target) || showMobileFilter.contains(e.target);
            const isVisible = mobileFilters.classList.contains("is-visible");

            if (!isClickInside && isVisible) {
                closeFilters();
                showMobileFilter.focus(); 
            }
        });

        function closeFilters() {
            mobileFilters.classList.remove("is-visible");
            document.body.classList.remove("filters-open");
            filterUnderlay.classList.remove("show");
        }
    }

    const resizingSelect = document.getElementById("item-sort");
    const helperElement = document.querySelector(".item-sort-helper");

    if (resizingSelect && helperElement) {
        updateSelectWidth(resizingSelect, helperElement);
        resizingSelect.addEventListener("change", () => {
            updateSelectWidth(resizingSelect, helperElement, 60);
        });
    }

    const resizingPageSelect = document.getElementById("page-size");
    const helperPageSelectElement = document.querySelector(".page-size-select-helper");

    if (resizingPageSelect && helperPageSelectElement) {
        updateSelectWidth(resizingPageSelect, helperPageSelectElement);
        resizingPageSelect.addEventListener("change", () => {
            updateSelectWidth(resizingPageSelect, helperPageSelectElement, 65);
        });
    }


    const masonryGrid = document.querySelector('.masonry-grid');
    if (masonryGrid) {
        const masonryImages = masonryGrid.querySelectorAll('img');

        Promise.all([...masonryImages].map(loadImage)).then(() => {
            new Masonry(masonryGrid, {
                itemSelector: '.masonry-item',
                horizontalOrder: true,
                percentPosition: true,
            });
        });
    }

    const featuredSliderCard = new Swiper(".featured-slider-card", {
        slidesPerView: 1,
        loop: false,
        effect: 'fade',
        autoHeight: true, 
        fadeEffect: {
            crossFade: true,
        },
        scrollbar: {
            el: ".featured-desktop-slider .swiper-scrollbar",
            draggable: true,
        },
        navigation: {
            nextEl: ".featured-desktop-slider .swiper-button-next",
            prevEl: ".featured-desktop-slider .swiper-button-prev",
        },
    });

    const featuredSliderImage = new Swiper(".featured-slider-image", {
        slidesPerView: 1,
        loop: false,
        autoHeight: true

    });

    featuredSliderCard.controller.control = featuredSliderImage;
    featuredSliderImage.controller.control = featuredSliderCard;

    const mobileFeaturedSliderCard = new Swiper(".featured-slider-card-mobile", {
        slidesPerView: 1,
        loop: false,
        autoHeight: true, 
        scrollbar: {
            el: ".featured-mobile-slider .swiper-scrollbar",
            draggable: true,
        },
        navigation: {
            nextEl: ".featured-mobile-slider .swiper-button-next",
            prevEl: ".featured-mobile-slider .swiper-button-prev",
        },
    });

    const relatedContentSliders = document.querySelectorAll(".related-content-slider-layout");
    const relatedContentSliderInstances = {};
    if (relatedContentSliders.length) {

        relatedContentSliders.forEach(sliders => {

            const sliderId = sliders.getAttribute("data-sliderid");
            const prevButton = sliders.querySelector(".swiper-button-prev");
            const nextButton = sliders.querySelector(".swiper-button-next");
            const scrollbar = sliders.querySelector(".swiper-scrollbar");

            if (!sliderId || !prevButton || !nextButton || !scrollbar) {
                console.error(`Missing required elements for slider with ID: ${sliderId}`);
                return;
            }

            prevButton.classList.add(`${sliderId}-prev`);
            nextButton.classList.add(`${sliderId}-next`);
            scrollbar.classList.add(`${sliderId}-scrollbar`);

            try {
                relatedContentSliderInstances[sliderId] = new Swiper(`.${sliderId}`, {
                    slidesPerView: 1,
                    spaceBetween: 15,
                    navigation: {
                        nextEl: `.${sliderId}-next`,
                        prevEl: `.${sliderId}-prev`,
                    },
                    scrollbar: {
                        el: `.${sliderId}-scrollbar`,
                        draggable: true,
                    },
                    breakpoints: {
                        600: {slidesPerView: 2, loop: false, spaceBetween: 15},
                        992: {slidesPerView: 4, loop: false, spaceBetween: 30},
                    }
                });


                if (!relatedContentSliderInstances[sliderId] || typeof relatedContentSliderInstances[sliderId].destroy !== 'function') {
                    throw new Error(`Swiper failed to initialize for slider ID: ${sliderId}`);
                }

                updateAriaAttributes(relatedContentSliderInstances[sliderId]);
                relatedContentSliderInstances[sliderId].on("slideChange", () => {
                    updateAriaAttributes(relatedContentSliderInstances[sliderId]);
                });

            } catch (error) {
                console.error(`Swiper initialization error for slider ID: ${sliderId}`, error);
            }
        });
    }

    const eventsContentSliders = document.querySelectorAll(".events-content-slider-layout");
    const eventsContentSliderInstances = {};
    if (eventsContentSliders.length) {

        eventsContentSliders.forEach(sliders => {

            const sliderId = sliders.getAttribute("data-sliderid");
            const prevButton = sliders.querySelector(".swiper-button-prev");
            const nextButton = sliders.querySelector(".swiper-button-next");
            const scrollbar = sliders.querySelector(".swiper-scrollbar");

            if (!sliderId || !prevButton || !nextButton || !scrollbar) {
                console.error(`Missing required elements for slider with ID: ${sliderId}`);
                return;
            }

            prevButton.classList.add(`${sliderId}-prev`);
            nextButton.classList.add(`${sliderId}-next`);
            scrollbar.classList.add(`${sliderId}-scrollbar`);

            try {
                eventsContentSliderInstances[sliderId] = new Swiper(`.${sliderId}`, {
                    slidesPerView: 1,
                    loop: false,
                    spaceBetween: 15,
                    navigation: {
                        nextEl: `.${sliderId}-next`,
                        prevEl: `.${sliderId}-prev`,
                    },
                    scrollbar: {
                        el: `.${sliderId}-scrollbar`,
                        draggable: true,
                    },
                    breakpoints: {
                        600: {
                            loop: false,
                            spaceBetween: 15,
                        },
                        992: {
                            loop: false,
                            spaceBetween: 30,
                        }
                    }
                });


                if (!eventsContentSliderInstances[sliderId] || typeof eventsContentSliderInstances[sliderId].destroy !== 'function') {
                    throw new Error(`Swiper failed to initialize for slider ID: ${sliderId}`);
                }
                updateAriaAttributes(eventsContentSliderInstances[sliderId]);
                eventsContentSliderInstances[sliderId].on("slideChange", () => {
                    updateAriaAttributes(eventsContentSliderInstances[sliderId]);
                });

            } catch (error) {
                console.error(`Swiper initialization error for slider ID: ${sliderId}`, error);
            }
        });
    }

    const heroContentSliders = document.querySelectorAll(".hero-slider");
    const heroContentSliderInstances = {};
    const heroImageSliderInstances = {};
    if (heroContentSliders.length) {

        heroContentSliders.forEach(sliders => {

            const sliderId = sliders.getAttribute("data-sliderid");
            const prevButton = sliders.querySelector(".swiper-button-prev");
            const nextButton = sliders.querySelector(".swiper-button-next");
            const scrollbar = sliders.querySelector(".swiper-scrollbar");

            if (!sliderId || !prevButton || !nextButton || !scrollbar) {
                console.error(`Missing required elements for slider with ID: ${sliderId}`);
                return;
            }

            prevButton.classList.add(`${sliderId}-prev`);
            nextButton.classList.add(`${sliderId}-next`);
            scrollbar.classList.add(`${sliderId}-scrollbar`);

            try {
                heroContentSliderInstances[sliderId] = new Swiper(`.ce-hero-slider.${sliderId}`, {
                    slidesPerView: 1,
                    loop: false,
                    effect: 'fade',
                    fadeEffect: {
                        crossFade: true,
                    },
                    navigation: {
                        nextEl: `.${sliderId}-next`,
                        prevEl: `.${sliderId}-prev`,
                    },
                    scrollbar: {
                        el: `.${sliderId}-scrollbar`,
                        draggable: true,
                    }
                });
                heroImageSliderInstances[sliderId] = new Swiper(`.ce-hero-slider-images.${sliderId}`, {
                    slidesPerView: 1,
                    loop: false,
                    effect: 'fade',
                    fadeEffect: {
                        crossFade: true,
                    },
                });

                heroContentSliderInstances[sliderId].controller.control = heroImageSliderInstances[sliderId];
                heroImageSliderInstances[sliderId].controller.control = heroContentSliderInstances[sliderId];

                if (!heroContentSliderInstances[sliderId] || typeof heroContentSliderInstances[sliderId].destroy !== 'function') {
                    throw new Error(`Swiper failed to initialize for slider ID: ${sliderId}`);
                }

                updateAriaAttributes(heroContentSliderInstances[sliderId]);
                heroContentSliderInstances[sliderId].on("slideChange", () => {
                    updateAriaAttributes(heroContentSliderInstances[sliderId]);
                });

            } catch (error) {
                console.error(`Swiper initialization error for slider ID: ${sliderId}`, error);
            }


        });
    }


    updateAriaAttributes(featuredSliderCard);
    updateAriaAttributes(mobileFeaturedSliderCard);

    featuredSliderCard.on("slideChange", () => {
        updateAriaAttributes(featuredSliderCard);
    });
    mobileFeaturedSliderCard.on("slideChange", () => {
        updateAriaAttributes(mobileFeaturedSliderCard);
    });

    const checkboxSpans = document.querySelectorAll('.checkbox-span');
    checkboxSpans.forEach(span => {
        span.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.keyCode === 13) {
                event.preventDefault();

                const checkboxInput = this.previousElementSibling;

                if (checkboxInput && checkboxInput.classList.contains('check-box-input')) {
                    checkboxInput.checked = !checkboxInput.checked;
                    checkboxInput.dispatchEvent(new Event('change'));
                }
            }
        });
    });

    const footerFormSection = document.querySelector(".footer-form-section");
    if (footerFormSection) {
        const footerSubmitButton = document.querySelector(".footer-input-wrap button.submit-btn");
        const errorSourceFooter = document.querySelector(".invalid-feedback.footer-input-error");
        const errorTargetFooter = document.querySelector(".input-error-copy");

        if (!footerSubmitButton || !errorSourceFooter || !errorTargetFooter) return;


        footerSubmitButton.addEventListener("click", function () {
            setTimeout(updateErrorTarget(errorTargetFooter, errorSourceFooter), 100); 
        });

        const observer = new MutationObserver(() => {
            setTimeout(updateErrorTarget(errorTargetFooter, errorSourceFooter), 100); 
        });

        observer.observe(errorSourceFooter, {childList: true, subtree: true, characterData: true});
    }


    const videoContainers = document.querySelectorAll(".video-embed-values");
    if (videoContainers.length > 0) {
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        let players = [];

        window.onYouTubeIframeAPIReady = function () {
            videoContainers.forEach(container => {
                const videoIdInput = container.querySelector(".video-id");
                const videoContainerInput = container.querySelector(".video-container-id");

                if (videoIdInput && videoContainerInput) {
                    const uniqueSuffix = getRandomSuffix();
                    const VideoId = videoIdInput.value;
                    const uniquePlayerVar = "player_" + uniqueSuffix;
                    const playerContainerId = videoContainerInput.value;

                    if (document.getElementById(playerContainerId)) {
                        window[uniquePlayerVar] = new YT.Player(playerContainerId, {
                            height: '640',
                            width: '616',
                            videoId: VideoId,
                            playerVars: {
                                controls: 0,
                                showinfo: 0,
                                rel: 0,
                                autoplay: 0
                            }
                        });

                        players.push(window[uniquePlayerVar]);
                    }
                }
            });
        };
    }
    const pageNav = document.querySelector(".page-nav");
    if (pageNav) {
        const toggleButton = pageNav.querySelector(".mobile-toggle");
        const navList = pageNav.querySelector("nav ul");
        const navLinks = pageNav.querySelectorAll(".hover-link");
        const lastNavLink = navLinks[navLinks.length - 1];

        window.addEventListener("resize", () => updateMobileClass(pageNav, navList, navLinks));
        toggleButton.addEventListener("click", event => toggleMobileNav(event, pageNav, navList, navLinks));
        toggleButton.addEventListener("keydown", event => toggleMobileNav(event, pageNav, navList, navLinks));

        navLinks.forEach(link => {
            link.addEventListener("click", event => closeMobileNav(event, pageNav, navList, navLinks));
            link.addEventListener("keydown", event => closeMobileNav(event, pageNav, navList, navLinks));
        });

        if (navLinks && lastNavLink) {
            lastNavLink.addEventListener("keydown", event => handleLastLinkTab(event, pageNav, navList, navLinks));
        }


        updateMobileClass(pageNav, navList, navLinks);
    }
    var dropdownLanguageSelector = document.querySelector('.choose-language');
    if (dropdownLanguageSelector)
    {
        const select = dropdownLanguageSelector.querySelector('select');
        select.addEventListener('change', handleLanguageChange);
    }

    const heroCards = document.querySelectorAll(".hero-card");
    if (heroCards) {
        heroCards.forEach(card => {
            const cta = card.querySelector(".card-cta");
            const image = card.querySelector(".card-image");

            if (cta && image) {
                cta.addEventListener("mouseenter", () => {
                    image.classList.add("hovered");
                });

                cta.addEventListener("mouseleave", () => {
                    image.classList.remove("hovered");
                });
            }
        });
    }


    const submitButtons = document.querySelectorAll("form button[type='submit']");
    if (submitButtons) {
        submitButtons.forEach(button => {
            button.addEventListener("click", function (event) {
                const form = button.closest("form");
                if (form) {
                    const formTop = form.getBoundingClientRect().top + window.scrollY;
                    const offset = 350;

                 
                    setTimeout(() => {
                        requestAnimationFrame(() => {
                            window.scrollTo({
                                top: formTop - offset,
                                behavior: "smooth"
                            });
                        });
                    }, 400);
                }
            });
        });
    }

});

function handleLanguageChange(event) {
    const selectedUrl = event.target.value;

    if (selectedUrl) {
      window.location.href = selectedUrl;
    }
}
function loadImage(masonryImages) {
    return new Promise((resolve) => {
        if (masonryImages.complete) {

            resolve();
        } else {
            masonryImages.addEventListener('load', resolve);
            masonryImages.addEventListener('error', resolve);
        }
    });
}

function getRandomSuffix() {
    return String(Math.floor(100 + Math.random() * 900));
}

function updateAriaAttributes(swiper) {
    swiper.slides.forEach((slide, index) => {
        const isActive = swiper.activeIndex === index;

        if (slide instanceof HTMLElement) {
            slide.setAttribute("aria-hidden", String(!isActive));

        }
    });
}

function updateSelectWidth(selectEl, helperEl, width) {
    helperEl.innerHTML = selectEl.options[selectEl.selectedIndex].innerHTML;
    const selectWidth = `${helperEl.offsetWidth + width}px`;
    selectEl.style.width = selectWidth;
}

function updateErrorTarget(errorTargetFooter, errorSourceFooter) {
    errorTargetFooter.textContent = errorSourceFooter.textContent;
    if (errorTargetFooter.textContent.trim() !== "") {
        errorTargetFooter.classList.add("active");
    } else {
        errorTargetFooter.classList.remove("active");
    }
}

function isMobileView() {
    return window.innerWidth <= 1024;
}

function updateMobileClass(pageNav, navList, navLinks) {
    if (isMobileView()) {
        pageNav.classList.add("mobile", "mobile-inactive");
        navList.classList.remove("navigation-open");
    } else {
        pageNav.classList.remove("mobile", "mobile-inactive");
        navList.classList.remove("navigation-open");
    }
    setTabIndexes(pageNav, navLinks);
}

function setTabIndexes(pageNav, navLinks) {
    if (!isMobileView()) {
        navLinks.forEach(link => link.removeAttribute("tabindex"));
    } else {
        const isInactive = pageNav.classList.contains("mobile-inactive");
        navLinks.forEach(link => link.setAttribute("tabindex", isInactive ? "-1" : "0"));
    }
}

function toggleMobileNav(event, pageNav, navList, navLinks) {
    if (event.type === "click" || (event.type === "keydown" && event.key === "Enter")) {
        event.preventDefault();
        const isCurrentlyInactive = pageNav.classList.toggle("mobile-inactive");

        if (isCurrentlyInactive) {
            navList.classList.remove("navigation-open");
        } else {
            navList.classList.add("navigation-open");
        }

        setTabIndexes(pageNav, navLinks);
    }
}

function closeMobileNav(event, pageNav, navList, navLinks) {
    if (event.type === "click") {
        pageNav.classList.add("mobile-inactive");
        navList.classList.remove("navigation-open");
    } else if (event.type === "keydown" && event.key === "Enter") {
        event.preventDefault();
        pageNav.classList.add("mobile-inactive");
        navList.classList.remove("navigation-open");
        event.target.click();
    }
    setTabIndexes(pageNav, navLinks);
}

function handleLastLinkTab(event, pageNav, navList, navLinks) {
    if (event.key === "Tab" && isMobileView()) {
        pageNav.classList.add("mobile-inactive");
        navList.classList.remove("navigation-open");
        setTabIndexes(pageNav, navLinks);
    }
}

function copyToClipboard(currentUrl) {
    navigator.clipboard.writeText(currentUrl)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => alert('Failed to copy: ' + err));
}

function shareToLinkedIn(currentUrl) {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(linkedInUrl, '_blank', 'noopener');
}

function shareToX(currentUrl) {
    const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`;
    window.open(xUrl, '_blank', 'noopener');
}

function shareToFacebook(currentUrl) {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(fbUrl, '_blank', 'noopener');
}