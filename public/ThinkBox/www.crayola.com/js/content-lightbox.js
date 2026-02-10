document.addEventListener('DOMContentLoaded', () => {
    refreshFsLightbox();

    const contentlightbox = window.fsLightboxInstances["content-gallery"];
  
    const primaryImageButton = document.querySelector(".primary-image");
    const primaryImage = primaryImageButton ? primaryImageButton.querySelector("img") : null;
    const galleryButtons = document.querySelectorAll(".gallery-image");
    const moreImagesButton = document.querySelector(".more-images");

    if (contentlightbox) {
        contentlightbox.props.showThumbsOnMount = true;
        contentlightbox.props.disableBackgroundClose = true;
        contentlightbox.props.UIFadeOutTime = false;
        contentlightbox.props.toolbarButtons.close = {
            width: "44px",
            height: "44px",
            viewBox: "0 0 44 44",
            d: "M24.8189 21.886L29.5669 26.634C30.3323 27.3995 30.3323 28.6405 29.5669 29.4059C28.8015 30.1713 27.5605 30.1713 26.7951 29.4059L22.047 24.6579L17.2048 29.5001C16.4394 30.2655 15.1984 30.2655 14.433 29.5001C13.6675 28.7347 13.6675 27.4937 14.433 26.7282L19.2752 21.886L14.6611 17.272C13.8957 16.5065 13.8957 15.2655 14.6611 14.5001C15.4265 13.7347 16.6675 13.7347 17.433 14.5001L22.047 19.1142L26.5669 14.5943C27.3323 13.8289 28.5733 13.8289 29.3388 14.5943C30.1042 15.3597 30.1042 16.6007 29.3388 17.3661L24.8189 21.886Z",
            title: "Close"
        };
        contentlightbox.props.slideButtons.next = {
            width: "45px",
            height: "44px",
            viewBox: "0 0 45 44",
            d: "M33.4297 22L11.5706 22M33.4297 22L24.457 13.0273M33.4297 22L24.4569 30.9727",
            title: "Next"
        };
        contentlightbox.props.slideButtons.previous = {
            width: "45px",
            height: "44px",
            viewBox: "0 0 45 44",
            d: "M11.5703 22H33.4294M11.5703 22L20.543 30.9727M11.5703 22L20.5431 13.0273",
            title: "Previous"
        };

        contentlightbox.props.onOpen = function (instance) {
            const lightboxContainer = document.querySelector('.fslightbox-container');
            if (!lightboxContainer) return;

            const lightboxUnderlay = document.createElement('div');
            lightboxUnderlay.className = 'lightbox-underlay';
            document.body.insertAdjacentElement('afterbegin', lightboxUnderlay);

            function handleClickOutside(event) {
                if (!lightboxContainer.contains(event.target)) {
                    instance.close();
                }
            }

            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 500);

            instance._handleClickOutside = handleClickOutside;

           fsLightboxAccessibleCleanup = fsLightboxAccessible();

        };

        contentlightbox.props.onClose = function (instance) {
            if (instance._handleClickOutside) {
                document.removeEventListener('click', instance._handleClickOutside);
                delete instance._handleClickOutside;
            }
            const lightboxUnderlay = document.querySelector('.lightbox-underlay');
            if (lightboxUnderlay) {
                lightboxUnderlay.remove();
            }

         

            if (fsLightboxAccessibleCleanup) {
                fsLightboxAccessibleCleanup();
                fsLightboxAccessibleCleanup = null;
            }

            primaryImageButton.focus();
           
        };


    }

    const updatePrimaryImage = (newSrc, newAlt, indexValue) => {
        if (primaryImage && primaryImageButton) {
            primaryImage.src = newSrc;
            primaryImage.alt = newAlt;
            primaryImageButton.dataset.index = indexValue;
            refreshFsLightbox();
        }
    };

    galleryButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const img = button.querySelector("img");
            if (!img) return;
            const newSrc = img.getAttribute("src");
            const newAlt = img.getAttribute("alt");
            const indexValue = button.dataset.index;
            updatePrimaryImage(newSrc,newAlt, indexValue);
        });
    });

    if (primaryImageButton) {
        primaryImageButton.addEventListener("click", (e) => {
            const indexValue = parseInt(primaryImageButton.dataset.index, 10);
            window.fsLightboxInstances["content-gallery"].open(indexValue);
        });
    }

    if (moreImagesButton) {
        moreImagesButton.addEventListener("click", (e) => {
            window.fsLightboxInstances["content-gallery"].open(0);
        });
    }

});
