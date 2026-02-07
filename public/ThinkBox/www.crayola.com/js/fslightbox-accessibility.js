let fsLightboxOnKeyDown; 
let fsLightboxOnClick; 

/**
 * 
 * -Converts fslightbox toolbar <div> elements into <button> elements for better accessibility.
 * -Updates aria-labels and tab indexes
 * -Overrides Thumbnail structures into a list
 * -Adds focus states & keyboard navigation
 *  ---> Use in fslightbox.props.onOpen
 * 
 **/

function fsLightboxAccessible() {

    const FSLIGHTBOX_TOOLBAR_BUTTONS = document.querySelectorAll('.fslightbox-toolbar-button');
    const FSLIGHTBOX_PREV_BUTTON = document.querySelector('.fslightbox-slide-btn-container-previous');
    const FSLIGHTBOX_NEXT_BUTTON = document.querySelector('.fslightbox-slide-btn-container-next');
    const FSLIGHTBOX_THUMB_WRAPPER = document.querySelectorAll('.fslightbox-thumb-wrapper');
    const FSLIGHTBOX_THUMBS_INNER = document.querySelector('.fslightbox-thumbs-inner');
    const FSLIGHTBOX_CONTAINER = document.querySelector('.fslightbox-container');
    const FSLIGHTBOX_COUNTER = document.querySelector('.fslightbox-slide-number-container');
    const FSLIGHTBOX_INNER_CONTAINER = document.querySelector('.fslightboxswc');
    const FSLIGHTBOX_THUMBS_ARRAY = Array.from(document.querySelectorAll('.fslightbox-thumb'));
    const FSLIGHTBOX_CLOSE = document.querySelector('.fslightbox-toolbar-button.fslightbox-flex-centered[aria-label="Close"]');
   
  

    
    // Adds aria-live to content counter
    if (FSLIGHTBOX_COUNTER) FSLIGHTBOX_COUNTER.setAttribute('aria-live', 'polite');
    if (FSLIGHTBOX_INNER_CONTAINER) FSLIGHTBOX_INNER_CONTAINER.setAttribute('aria-live', 'polite');

    // Add accessibility markup to popup
    if (FSLIGHTBOX_CONTAINER) {
        FSLIGHTBOX_CONTAINER.setAttribute('role', 'dialog');
        FSLIGHTBOX_CONTAINER.setAttribute('aria-labelledby', 'lightboxTitle');
        var srText = document.createElement('p');
        srText.className = 'sr-only';
        srText.id = "lightboxTitle";
        srText.textContent = 'Content Images Lightbox Viewer';
        FSLIGHTBOX_CONTAINER.parentNode.insertBefore(srText, FSLIGHTBOX_CONTAINER.nextSibling);
    }

    // Convert toolbar divs to buttons
    FSLIGHTBOX_TOOLBAR_BUTTONS.forEach(divButton => {
        const button = document.createElement('button');
        button.className = divButton.className;
        button.setAttribute('aria-label', divButton.title || 'Lightbox button');
        button.setAttribute('tabindex', '1');
        while (divButton.firstChild) button.appendChild(divButton.firstChild);
        if (divButton.onclick) button.onclick = divButton.onclick;
        divButton.replaceWith(button);
    });

    // Convert previous/next buttons
    [FSLIGHTBOX_PREV_BUTTON, FSLIGHTBOX_NEXT_BUTTON].forEach((btn, index) => {
        if (btn) {
            const newButton = document.createElement('button');
            newButton.className = btn.className;
            newButton.setAttribute('aria-label', index === 0 ? 'View the previous item' : 'View the next item');
            newButton.setAttribute('tabindex', '1');
            while (btn.firstChild) newButton.appendChild(btn.firstChild);
            if (btn.onclick) newButton.onclick = btn.onclick;
            btn.replaceWith(newButton);
        }
    });

    // Cast thumbnails into a list
    const listItems = [];
    if (FSLIGHTBOX_THUMB_WRAPPER) {
        FSLIGHTBOX_THUMB_WRAPPER.forEach(thumbWrapper => {
            const listItem = document.createElement('li');
            const img = thumbWrapper.querySelector('img');
            if (img) img.setAttribute('tabindex', '1');
            listItem.appendChild(thumbWrapper);
            listItems.push(listItem);
        });
    }

    if (FSLIGHTBOX_THUMBS_INNER) {
        const FSLIGHTBOX_THUMBS_INNERList = document.createElement('ul');
        FSLIGHTBOX_THUMBS_INNERList.className = "fslightbox-thumbs-list";
        FSLIGHTBOX_THUMBS_INNER.appendChild(FSLIGHTBOX_THUMBS_INNERList);
        listItems.forEach(listItem => FSLIGHTBOX_THUMBS_INNERList.appendChild(listItem));
    }
    // Add aria-label to each thumbnail
    FSLIGHTBOX_THUMBS_ARRAY.forEach((thumb, index) => {
        thumb.setAttribute('aria-label', `${index + 1}/${FSLIGHTBOX_THUMBS_ARRAY.length}`);
    });

    refreshFsLightbox();

    FSLIGHTBOX_THUMBS_ARRAY[0].focus();

    //Keyboard Navigation
    fsLightboxOnKeyDown = function (event) {

        var currentElement = document.activeElement;
        var activeThumb = document.querySelector('.fslightboxta');
        var thumbArray = Array.from(document.querySelectorAll('.fslightbox-thumb'));
        var lastThumb = thumbArray[thumbArray.length - 1];
        var firstThumb = thumbArray[0];
        var closeButton = document.querySelector('.fslightbox-toolbar-button.fslightbox-flex-centered[aria-label="Close"]');
        var nextButton = document.querySelector('.fslightbox-slide-btn-container-next');
        var prevButton = document.querySelector('.fslightbox-slide-btn-container-previous');
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            if (activeThumb) activeThumb.focus();
        }

        if (event.key === 'Tab') {
            event.preventDefault();
            if (currentElement === nextButton || currentElement === prevButton) {
                event.shiftKey ? closeButton?.focus() : activeThumb?.focus();
            }
            else if (currentElement.classList.contains('fslightbox-thumb')) {
                if (event.shiftKey) {
                    currentElement === firstThumb ? prevButton?.focus() : document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                } else {
                    currentElement === lastThumb ? nextButton?.focus() : document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                }
            }
            else if (currentElement === closeButton) {
                event.shiftKey ? prevButton?.focus() : nextButton?.focus();
            }
        }
    };


    //Force focus to remain in lightbox if clicked out of functional elements
    fsLightboxOnClick = function (event) {
        var excludedSelectors = ['.fslightbox-nav', '.fslightboxs', '.fslightbox-slide-btn-container', '.fslightbox-thumb-wrapper'];
        var target = event.target;
        var isExcluded = excludedSelectors.some(selector => target.closest(selector));
        if (!isExcluded) {
            var targetElement = document.querySelector('.fslightboxta');
            if (targetElement) {
                targetElement.focus();
            }
        }
    };
    //Initialize event listeners
    //setTimeout(() => {
    //    document.addEventListener('click', fsLightboxOnKeyDown);
        
    //}, 700);

    
    document.addEventListener('keydown', fsLightboxOnKeyDown);

    /**
    * 
    * -Remove Listeners
    * ---> Use in fslightbox.props.onClose
    * 
    **/

    return function cleanupFsLightboxAccessibility() {
        document.removeEventListener('keydown', fsLightboxOnKeyDown);
        document.removeEventListener('click', fsLightboxOnClick);
    };

}



