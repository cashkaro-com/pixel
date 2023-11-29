function a() {
    // Define the number of days for cookie survival
    var ckSurvivalDays = 7;

    // Function to extract query parameters from the URL
    function getCKSearchParams() {
        var searchParams = new URLSearchParams(window.location.search);
        var params = {};
        // Iterate through the query parameters and store them in the 'params' object
        searchParams.forEach(function (value, key) {
            params[key] = value;
        });
        return params;
    }

    // Function to store query parameters in local storage
    function storeCKInLocalStorage(params) {
        // Remove specific items from local storage if they are not present in 'params'
        if (!('gclid' in params)) {
            localStorage.removeItem('ck_gclid');
        }
        if (!('fbclid' in params)) {
            localStorage.removeItem('ck_fbclid');
        }
        if (!('igshid' in params)) {
            localStorage.removeItem('ck_igshid');
        }
        if (!('gad_source' in params)) {
            localStorage.removeItem('ck_gad_source')
        }
        if (!('msclkid' in params)) {
            localStorage.removeItem('ck_msclkid')
        }

        // If any of the specified parameters are present, clear all 'ck_' items from local storage
        if ('gclid' in params || 'fbclid' in params || 'igshid' in params || 'gad_source' in params || 'msclkid' in params) {
            Object.keys(localStorage).forEach(function (key) {
                if (/^ck_/.test(key)) {
                    localStorage.removeItem(key);
                }
            });
        } else {
            // Store each query parameter in local storage with a 'ck_' prefix
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    localStorage.setItem("ck_" + key, params[key]);
                }
            }

            // Store the current timestamp in local storage
            var currentTimestamp = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
            localStorage.setItem('ck_timestamp', currentTimestamp);
        }
    }

    // Function to store query parameters in cookies
    function storeCKInCookies(params) {
        // Remove specific cookies if they are not present in 'params'
        if (!('gclid' in params)) {
            document.cookie = "ck_gclid=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
        }
        if (!('fbclid' in params)) {
            document.cookie = "ck_fbclid=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
        }
        if (!('igshid' in params)) {
            document.cookie = "ck_igshid=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
        }
        if (!('gad_source' in params)) {
            document.cookie = "ck_gad_source=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
        }
        if (!('msclkid' in params)) {
            document.cookie = "ck_msclkid=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
        }

        // If any of the specified parameters are present, clear all 'ck_' cookies
        if ('gclid' in params || 'fbclid' in params || 'igshid' in params || 'gad_source' in params || 'msclkid' in params) {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.indexOf('ck_') === 0) {
                    var cookieName = cookie.split("=")[0];
                    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                }
            }
        } else {
            // Store each query parameter as a cookie with a 'ck_' prefix
            var expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + ckSurvivalDays);
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    document.cookie = "ck_" + key + "=" + params[key] + "; expires=" + expirationDate.toUTCString() + "; path=/";
                }
            }
        }
    }

    // Get the query parameters from the URL
    var ckSearchParams = getCKSearchParams();
    // Store the query parameters in local storage
    storeCKInLocalStorage(ckSearchParams);
    // Store the query parameters in cookies
    storeCKInCookies(ckSearchParams);

}
a()