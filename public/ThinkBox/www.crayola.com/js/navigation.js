
document.addEventListener('DOMContentLoaded', () => {
    let language_button, language_list;
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavFlyout = document.getElementById('mobile-nav-flyout');
    const searchInput = document.getElementById('search-input');
    const navUnderlay = document.getElementById('nav-underlay');
    const navUnderlayMobile = document.getElementById('nav-underlay-mobile');
    const header = document.getElementById('header');
    const main = document.getElementById('main');
    const backToTop = document.querySelector('.back-to-top');
    const backToTopButton = document.querySelector('.back-to-top-anchor');
    const ceMobileSearchButton = document.querySelector('.mobile-search-toggle');
    const navSearchDropdown = document.querySelector('.dropdown-menu.search.position-relative');
    let lastScrollY = window.scrollY;
    let hasOutOfViewClass = false;

    // Functions
    const resetMobileNavigationState = () => {
        mobileNavFlyout.classList.add('hiding');
        document.body.classList.remove('no-scroll');
        navUnderlayMobile.classList.remove('show');
        setTimeout(() => {
            mobileNavFlyout.classList.remove('show', 'hiding');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNavToggle.classList.remove('active');
            document.querySelectorAll('.child-menu, .second-child-menu').forEach(menu => menu.classList.remove('show'));
            document.querySelectorAll('.nav-link.has-child').forEach(link => link.setAttribute('aria-expanded', 'false'));
        }, 300);
    };

    const toggleMobileMenu = () => {
        const isOpen = mobileNavFlyout.classList.contains('show');
        if (isOpen) {
            resetMobileNavigationState();
        } else {
            if (navSearchDropdown.classList.contains('show')) {
                navSearchDropdown.classList.remove('show');
                navSearchDropdown.setAttribute('aria-expanded', 'false');
            }
            mobileNavFlyout.classList.add('show');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            mobileNavToggle.classList.add('active');
            navUnderlayMobile.classList.add('show');
            document.body.classList.add('no-scroll');
            mobileKeyboardTrap(mobileNavFlyout);
        }
    };

    const mobileKeyboardTrap = (menu) => {
        menu.addEventListener('keydown', (event) => {
            const focusableElements = Array.from(menu.querySelectorAll('.nav-link, .child-menu .nav-link, .second-child-menu .nav-link, .back-flyout button, .back-flyout-second button'));
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            if (event.key === 'Tab') {
                if (document.activeElement === lastFocusable && !event.shiftKey) {
                    firstFocusable.focus();
                    event.preventDefault();
                } else if (document.activeElement === firstFocusable && event.shiftKey) {
                    lastFocusable.focus();
                    event.preventDefault();
                }
            } else if (event.key === 'Escape') {
                if (menu === mobileNavFlyout) {
                    resetMobileNavigationState();
                    mobileNavToggle.focus();
                } else {
                    menu.classList.remove('show');
                    focusFirstNavLink(mobileNavFlyout);
                }
            }
        });
    };

    const focusFirstNavLink = (menu) => menu.querySelector('.nav-link')?.focus();

    const mobileNavLinkClick = (link, menuSelector) => {
        link.addEventListener('click', (event) => {
            event.stopPropagation();
            const parent = link.closest('ul');
            parent.querySelectorAll(menuSelector).forEach(menu => menu.classList.remove('show'));
            parent.querySelectorAll('.nav-link.has-child').forEach(item => item.setAttribute('aria-expanded', 'false'));
            const childMenu = link.nextElementSibling;
            if (childMenu && childMenu.classList.contains(menuSelector.slice(1))) {
                childMenu.classList.add('show');
                link.setAttribute('aria-expanded', 'true');
                focusFirstNavLink(childMenu);
                mobileKeyboardTrap(childMenu);
            }
        });
    };

    const closeAllDropdowns = () => {
        document.querySelectorAll('.dropdown-toggle.show, .dropdown-menu.show').forEach(el => {
            el.classList.remove('show');
            el.setAttribute?.('aria-expanded', false);
        });
        navUnderlay.classList.remove('show');
        if (language_button && language_list) {
            language_button.classList.remove('active');
            language_list.classList.remove('show');
        }
    };

    //Positioning for nav toggle on desktop
    if (window.innerWidth < 992) {
        main.style.paddingTop = `${header.offsetHeight}px`;
    }
    const checkScroll = () => {
        
        if (window.innerWidth < 992) {
            header.classList.remove('out-of-view', 'slide-in');
            main.style.paddingTop = `${header.offsetHeight}px`;
            return;
        }
        const currentScroll = window.scrollY;
        const headerHeight = header.offsetHeight;
        if (currentScroll === 0) {
          
            header.classList.remove('out-of-view', 'slide-in');
            main.style.paddingTop = '';
            hasOutOfViewClass = false;
            return;
        }
        if (currentScroll > headerHeight) {
            if (currentScroll > lastScrollY) {
                if (!hasOutOfViewClass) {
                    header.classList.add('out-of-view');
                    main.style.paddingTop = `${headerHeight}px`;
                    hasOutOfViewClass = true;
                }
                header.classList.remove('slide-in');
            } else if (hasOutOfViewClass) {
                header.classList.add('slide-in');
            }
        } else if (currentScroll === 0) {
            header.classList.remove('out-of-view', 'slide-in');
            main.style.paddingTop = '';
            hasOutOfViewClass = false;
        }
        lastScrollY = currentScroll;
    };
    const isMobile = () => window.innerWidth < 768;
    const toggleBackToTop = () => {
        if (window.scrollY > header.offsetHeight) {
            backToTop.classList.add('visible');
            if (isMobile()) {
                setTimeout(() => {
                    if (document.activeElement != searchInput) {
                        closeAllDropdowns();
                        navUnderlay.classList.remove('show');
                    }
                }, 200);
            } else {
                closeAllDropdowns();
                navUnderlay.classList.remove('show');
            }

        } else {
            backToTop.classList.remove('visible');
        }

        const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;

        if (isBottom) {
            backToTop.classList.add('bottom');
        } else {
            backToTop.classList.remove('bottom');
        }
    };

    
    mobileNavToggle.addEventListener('click', toggleMobileMenu);
    mobileNavFlyout.addEventListener('keydown', mobileKeyboardTrap);
    document.querySelectorAll('.nav-link.has-child').forEach(link => {
        mobileNavLinkClick(link, '.child-menu');
    });
    document.querySelectorAll('.nav-link.has-child.second-tier').forEach(link => {
        mobileNavLinkClick(link, '.second-child-menu');
    });
    document.querySelectorAll('.child-menu .back-flyout button').forEach(button => button.addEventListener('click', (event) => {
        event.stopPropagation();
        const childMenu = button.closest('.child-menu');
        childMenu.classList.add('hiding');

        setTimeout(() => {
            childMenu.classList.remove('show', 'hiding');
            const parentMenu = childMenu.closest('.nav-item').querySelector('.mobile-nav');
            parentMenu?.classList.add('show');

            focusFirstNavLink(parentMenu);
        }, 300);
    }));

    document.querySelectorAll('.second-child-menu .back-flyout-second button').forEach(button => button.addEventListener('click', (event) => {
        event.stopPropagation();
        const secondChildMenu = button.closest('.second-child-menu');
        secondChildMenu.classList.add('hiding');

        setTimeout(() => {
            secondChildMenu.classList.remove('show', 'hiding');
            const childMenu = secondChildMenu.closest('.child-menu');
            childMenu.classList.add('show');
            focusFirstNavLink(childMenu);
        }, 300);
    }));
    let previousWidth = window.innerWidth;
    window.addEventListener('resize', () => {
        resetMobileNavigationState();
        checkScroll();

        const currentWidth = window.innerWidth;

        // Only close dropdowns when:
        // - user resizes *down* to ≤1366 from above
        // - user resizes *up* to >1366 from below
        if ((previousWidth > 1366 && currentWidth <= 1366) ||
            (previousWidth <= 1366 && currentWidth > 1366)) {
            closeAllDropdowns();
        }

        previousWidth = currentWidth; // update for next resize
    });


   
    window.addEventListener('scroll', () => {
        checkScroll();
        toggleBackToTop();
    });

    document.querySelectorAll('.dropdown-toggle:not(.ce-btn):not(.no-nav)').forEach(dropdownToggle =>
        dropdownToggle.addEventListener('click', (event) => {
            event.stopPropagation(); 
            const toggle = event.target.closest('.dropdown-toggle');
            const isExpanded = toggle.classList.contains('show');

            closeAllDropdowns();

            if (!isExpanded) {
                const dropdownMenu = toggle.nextElementSibling;
                toggle.classList.add('show');
                dropdownMenu.classList.add('show');
                toggle.setAttribute('aria-expanded', true);
                navUnderlay.classList.add('show');
                $("#search-input").focus();
            }
        })
    );

    //CE only conditional where search toggle is in flyout

    //const navSearchDropdown = document.querySelector('.dropdown-menu.search.position-relative');

    if (ceMobileSearchButton) {

        ceMobileSearchButton.addEventListener('click', function () {
            resetMobileNavigationState();
            navUnderlayMobile.classList.remove('show');
            navSearchDropdown.classList.add('show');
            navSearchDropdown.setAttribute('aria-expanded', 'true');
            $("#search-input").focus();
        });
    }

    document.addEventListener('mousedown', (event) => {
        const menu = event.target.closest('.dropdown-menu');
        const toggle = event.target.closest('.dropdown-toggle');
        const mobileFlyout = event.target.closest('#mobile-nav-flyout');
        const mobileToggle = event.target.closest('#mobile-nav-toggle');
        const activeElement = document.activeElement;
        
        if ((!menu && !toggle)) {
            if (activeElement !== searchInput) {
                closeAllDropdowns();
            }
        }

        if (!mobileFlyout && !mobileToggle) {
            resetMobileNavigationState();
        }

        language_button = event.target.closest('.dropdown-menu.language .dropdown-menu-inner-wrap div button');
        if (language_button) {
            const isExpanded = language_button.classList.contains('active');
            language_list = language_button.closest('.dropdown-menu.language').querySelector('div:nth-of-type(2)');
            if (!isExpanded) {
                language_button.classList.add('active');
                language_list.classList.add('show');
            } else {
                language_button.classList.remove('active');
                language_list.classList.remove('show');
            }
        }

        if (event.target.closest('.close-search')) {
            closeAllDropdowns();
        }
    });
    backToTop.addEventListener("click", () => {
        header.classList.remove('out-of-view', 'slide-in');
        main.style.paddingTop = '';
        hasOutOfViewClass = false;
    });
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    toggleBackToTop();
});







