try {
    function a() {
        // if (!ck_order_id) {
        //     location.reload()
        // }
        let count = localStorage.getItem('ck_count') ? parseInt(localStorage.getItem('ck_count')) : 0
        if (!ck_order_id & count != 3) {
            count += 1
            localStorage.setItem('ck_count', count)
            location.reload()
        } else {
            localStorage.removeItem('ck_count')
        }
        var ckSurvivalDays = 7;
        // Function to retrieve data from local storage with a specific prefix
        function getCKLocalData(prefix) {
            var keysAndValues = {};
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key.indexOf(prefix) === 0) {
                    var value = localStorage.getItem(key);
                    keysAndValues[key] = value;
                }
            }
            return keysAndValues;
        }

        // Function to retrieve data from cookies with a specific prefix
        function getCKCookieData(prefix) {
            var cookies = {};
            var cookieArray = document.cookie.split(';');
            for (var i = 0; i < cookieArray.length; i++) {
                var cookie = cookieArray[i].trim();
                var cookieParts = cookie.split('=');
                var cookieName = cookieParts[0];
                var cookieValue = cookieParts[1];
                if (cookieName.indexOf(prefix) === 0) {
                    cookies[cookieName] = cookieValue;
                }
            }
            return cookies;
        }

        // Function to delete data from local storage with a specific prefix
        function deleteCKLocalData(prefix) {
            Object.keys(localStorage).forEach(function (key) {
                if (/^ck_/.test(key)) {
                    localStorage.removeItem(key);
                }
            });
        }

        // Function to perform a postback based on provided data
        function ckPostback(data) {
            console.log(data, data.ck_clickid, ck_order_id)
            if (data && data.ck_clickid && ck_order_id) {
                var url = 'https://offers-cashkaro.affise.com/postback?clickid=' + data.ck_clickid + '&secure=' + ck_secure_id + '&action_id=' + ck_order_id + '&sum=' + ck_order_value + '&status=2&custom_field1=' + ck_order_value + '&custom_field2=' + data.ck_utm_campaign + '&custom_field3=' + ck_discount_code;
                fetch(url)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data);
                    });
                console.log('CK UTM source : ' + data.ck_utm_source + '\nCK UTM campaign : ' + data.ck_utm_campaign);
            }
        }

        // Get data from local storage with a 'ck_' prefix
        var ckLocalData = getCKLocalData('ck_');

        console.log('ckLocalData ', ckLocalData)
        // Check if local data exists and the timestamp is within a certain range
        if (ckLocalData && ckLocalData.ck_timestamp && (ckLocalData.ck_utm_source === 'cashkaro')) {
            var epochTimestamp = ckLocalData.ck_timestamp;
            var date = new Date(epochTimestamp * 1000);
            var year = date.getFullYear();
            var month = String(date.getMonth() + 1).padStart(2, '0');
            var day = String(date.getDate()).padStart(2, '0');
            var hours = String(date.getHours()).padStart(2, '0');
            var minutes = String(date.getMinutes()).padStart(2, '0');
            var seconds = String(date.getSeconds()).padStart(2, '0');
            var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
            var providedDate = new Date(formattedDateTime);
            var currentDate = new Date();
            var timeDifference = currentDate - providedDate;
            var daysDifference = timeDifference / (1000 * 86400 * ckSurvivalDays);

            // Perform postback if conditions are met
            if (daysDifference <= ckSurvivalDays) {
                if (!('ck_gclid' in ckLocalData) && !('ck_fbclid' in ckLocalData) && !('ck_igshid' in ckLocalData) && !('ck_gad_source' in ckLocalData) && !('ck_msclkid' in ckLocalData)) {
                    ckPostback(ckLocalData);
                }
            } else {
                // Delete local data if the timestamp is too old
                deleteCKLocalData('ck_');
            }
        } else {
            // If local data doesn't exist or conditions are not met, check cookies
            var ckCookieData = getCKCookieData('ck_');
            var keysArray = Object.keys(ckCookieData);
            if (keysArray.length > 0) {
                if (ckCookieData.ck_utm_source === 'cashkaro') {
                    if (!('ck_gclid' in ckCookieData) && !('ck_fbclid' in ckCookieData) && !('ck_igshid' in ckCookieData) && !('ck_gad_source' in ckCookieData) && !('ck_msclkid' in ckCookieData)) {
                        ckPostback(ckCookieData);
                    }
                }
            }
        }
    }
    a()
} catch (error) {
    console.log(error)
}