document.addEventListener("DOMContentLoaded", () => {    
    geoCheck();

    function closePopup() {
        var popup = document.getElementById("geoPopup");
        popup.setAttribute('aria-hidden', 'true');
        popup.style = "display:none";
    }

    var popups = document.querySelectorAll('.popup');
    var closeButtons = document.querySelectorAll('.geo-close');

    closeButtons.forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
            var popup = closeBtn.closest('.popup');
            closePopup(popup);
        });
    });

    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('popup')) {
            closePopup(event.target);
        }
    });

    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            popups.forEach(function (popup) {
                if (popup.getAttribute('aria-hidden') === 'false') {
                    closePopup(popup);
                }
            });
        }
    });

    function trapFocus(popup) {
        var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
        var focusableElements = popup.querySelectorAll(focusableElementsString);
        var firstFocusableElement = focusableElements[0];
        var lastFocusableElement = focusableElements[focusableElements.length - 1];

        function handleFocus(event) {
            if (event.key === 'Tab') {
                if (event.shiftKey) { // shift + tab
                    if (document.activeElement === firstFocusableElement) {
                        event.preventDefault();
                        lastFocusableElement.focus();
                    }
                } else { // tab
                    if (document.activeElement === lastFocusableElement) {
                        event.preventDefault();
                        firstFocusableElement.focus();
                    }
                }
            }
        }

        popup.addEventListener('keydown', handleFocus);
        popup.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closePopup(popup);
            }
        });
    }
});

async function geoCheck() {
    try {
        var p = "home";
        if (window.location.pathname != "/") {
            p = window.location.pathname;
        }

        const response = await fetch(`/api/default/pages/Default.Model(url=@param)?@param='${p}'`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const data = await response.json();
            const rg = data;
            const support = checkForSupport(rg.Culture);

            if (checkGeoCookie() || support) {
                try {
                    const response = await fetch("https://api.ipstack.com/check?access_key=bc6456c374e5013ad7d8fc96b7519c29");
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    } else {
                        const j = await response.json();

                        //gets the regionCode and Name
                        const r = GetRegion(j);
                        var regionCode = r[0].toLowerCase();
                        var regionName = r[1];

                        var c = rg.Culture.toLowerCase();
                        if (c == "en") {
                            c = "en-us";
                        }

                        //LATAM Country redirects - Guatemala, Hondurras, El Savador, Costa Rica, Colombia
                        if (regionCode == "es-gt" || regionCode == "es-hn" || regionCode == "es-sv" || regionCode == "es-cr" || regionCode == "es-co") {
                            regionCode = "es-mx";
                        }

                        //New Zealand redirect to Australia
                        if (regionCode == "en-nz" || regionCode == "mi-nz") {
                            regionCode = "en-au";
                        }

                        //check for support page match & region match
                        if (c == regionCode) {
                            //do nothing;
                        } else {
                            const langModel = rg.Fields.AvailableLanguages;
                            if (langModel.length > 1) {
                                var exist = false;
                                for (const [key, value] of Object.entries(langModel)) {
                                    var v = value.toLowerCase();
                                    if (v == "en") { v = "en-us"; }

                                    if (v == regionCode) {
                                        exist = true;
                                        break;
                                    }
                                }
                            }

                            if (regionCode == "en-ca" || regionCode == "fr-ca") {
                                if (support) {
                                    window.location.replace("https://www.crayola.ca/contact");
                                } else {
                                    window.location.replace("https://www.crayola.ca/");
                                }
                            } else if (exist && support) {
                                if (regionCode == "en-us") {
                                    window.location.replace("/support");
                                } else { window.location.replace("/" + regionCode + "/support"); }
                            } else if (support) {
                                window.location.replace("/support/global-support");
                            } else if (exist) {
                                if (c == "en-us") {
                                    document.getElementById("lnkGeoLocal").href = regionCode + window.location.pathname;
                                } else if (regionCode == "en-us") {
                                    var p = window.location.pathname.replace("/" + c, "");
                                    document.getElementById("lnkGeoLocal").href = p;
                                } else {
                                    var p = window.location.pathname.replace(c, regionCode);
                                    document.getElementById("lnkGeoLocal").href = p;
                                }

                                document.getElementById("lnkGeoLocal").innerHTML = regionName;
                                document.getElementById("geoPopup").style.visibility = 'visible';
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching ipstack:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching data for site:', error);
    }
}
function checkGeoCookie() {
    // If the cookie isn’t present, set it for 30 days
    const nameEQ = "geolocation=";
    const ca = document.cookie.split(';'); // Split into individual cookie strings
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') { // Remove leading spaces
            c = c.substring(1);
        }
        if (c.indexOf(nameEQ) === 0) { // Check if the cookie starts with the desired name
            // Cookie already exists
            return false;
        }
    }
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    document.cookie = `geolocation=1; expires=${expirationDate.toUTCString()}; secure; samesite=strict`;
    return true;
}
function checkForSupport(culture) {
    var path = "/support";
    if (culture != "en") {
        path = "/" + culture + "/support";
    }
    if (window.location.pathname.toLowerCase() == path.toLowerCase()) {
        return true;
    } else {
        return false;
    }
}
function GetRegion(json) {
    // Gets the 2 letter country code
    var countryCode = json["country_code"];
    // Gets the full Country Name
    var countryName = json["country_name"];
    // Gets the 2 letter lanugage code
    var languageCode = json["location"]["languages"][0]["code"];
    // Gets the full language name
    var langName = json["location"]["languages"][0]["name"];
    //Combines the language with the country codes to create the region code to compare with Sitefinity
    var regionCode = languageCode + "-" + countryCode;
    // Combines the names of the language and country to create a string to match the labels in Sitefinity
    var regionName = langName + " (" + countryName + ")";
    const region = [regionCode, regionName];

    return region;
}