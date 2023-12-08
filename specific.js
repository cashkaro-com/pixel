try {
    var a = function () {
        // declare these variables above
        // var ck_order_id = '';
        // var ck_discount_code = '{{ order.discounts[0].code }}';
        // var ck_secure_id = '1a79cab13eb1583b19cfe9b0c12136ad';
        // var ck_order_count ={% if customer.orders_count == 1 %}1{% else %}2{% endif %} ;
        // var ck_specific_list =['abc','cde];

        var user_type = 'new';
        if (ck_order_count > 1) {
            user_type = 'old';
        }
        var item_name_specific = [];
        var item_name_generic = [];
        var specific_price = 0;
        var generic_price = 0;
        var count = localStorage.getItem('ck_count') ? parseInt(localStorage.getItem('ck_count')) : 0;
        var ckSurvivalDays = 7;
        if (!ck_order_id && count <= 3) {
            count += 1;
            localStorage.setItem('ck_count', count);
            location.reload();
        } else {
            localStorage.removeItem('ck_count');
        }
        for (var i = 0; i < dataLayer.length; i++) {
            var iterator = dataLayer[i];
            console.log('iterator : ',iterator)
            if (iterator.event == 'tp_purchase') {
                ck_order_id = iterator.ecommerce.order_number;
                for (var j = 0; j < iterator.ecommerce.items.length; j++) {
                    var item_obj = iterator.ecommerce.items[j];
                    console.log('item_obj : ',item_obj)
                    console.log('item_obj878876876 : ',ck_specific_list.includes(parseInt(item_obj.item_id)))
                    if (ck_specific_list.includes(parseInt(item_obj.item_id))) {
                        item_name_specific.push(item_obj.item_name);
                        specific_price += item_obj.price * item_obj.quantity;
                    } else {
                        if (item_obj.price != 0) {
                            item_name_generic.push(item_obj.item_name);
                            generic_price += item_obj.price * item_obj.quantity;
                        }
                    }
                }
            }
        }
        console.log('specific_price:', specific_price, '*******', 'generic_price:', generic_price);
        console.log('ck_order_id ', ck_order_id);
        item_name_specific = item_name_specific.join('|');
        item_name_generic = item_name_generic.join('|');
        console.log('item_name_specific:', item_name_specific, '********', 'item_name_generic:', item_name_generic);
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

        function deleteCKLocalData(prefix) {
            Object.keys(localStorage).forEach(function (key) {
                if (/^ck_/.test(key)) {
                    localStorage.removeItem(key);
                }
            });
        }

        function ckPostback(data) {
            if (data && data.ck_clickid && ck_order_id) {
                if (item_name_specific != '' && specific_price > 0) {
                    ck_order_id = ck_order_id + '_1';
                    var url = 'https://offers-cashkaro.affise.com/postback?clickid=' + data.ck_clickid + '&secure=' + ck_secure_id + '&action_id=' + ck_order_id + '&sum=' + specific_price + '&status=2&custom_field1=' + specific_price + '&custom_field2=' + data.ck_utm_campaign + '&custom_field3=' + ck_discount_code + '&custom_field4=' + item_name_specific + '&goal=specific_' + user_type;
                    fetch(url)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            console.log(data);
                        });
                }

                if (item_name_generic != '' && generic_price > 0) {
                    ck_order_id = ck_order_id + '_2';
                    var url = 'https://offers-cashkaro.affise.com/postback?clickid=' + data.ck_clickid + '&secure=' + ck_secure_id + '&action_id=' + ck_order_id + '&sum=' + generic_price + '&status=2&custom_field1=' + generic_price + '&custom_field2=' + data.ck_utm_campaign + '&custom_field3=' + ck_discount_code + '&custom_field4=' + item_name_generic + '&goal=generic_' + user_type;
                    fetch(url)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            console.log(data);
                        });
                }

                console.log('CK UTM source : ' + data.ck_utm_source + '\nCK UTM campaign : ' + data.ck_utm_campaign);
            }
        }

        var ckLocalData = getCKLocalData('ck_');

        console.log('ckLocalData ', ckLocalData);

        if (ckLocalData && ckLocalData.ck_timestamp && (ckLocalData.ck_utm_source === 'cashkaro')) {
            console.log('1')
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

            if (daysDifference <= ckSurvivalDays) {
                console.log('2')
                if (!('ck_gclid' in ckLocalData) && !('ck_fbclid' in ckLocalData) && !('ck_igshid' in ckLocalData) && !('ck_gad_source' in ckLocalData) && !('ck_msclkid' in ckLocalData)) {
                    console.log('3')
                    ckPostback(ckLocalData);
                }else{
                    console.log('4')
                }
            } else {
                console.log('5')
                deleteCKLocalData('ck_');
            }
        } else {
            console.log('6')
            var ckCookieData = getCKCookieData('ck_');
            var keysArray = Object.keys(ckCookieData);

            if (keysArray.length > 0) {
                console.log('7')
                if (ckCookieData.ck_utm_source === 'cashkaro') {
                    if (!('ck_gclid' in ckCookieData) && !('ck_fbclid' in ckCookieData) && !('ck_igshid' in ckCookieData) && !('ck_gad_source' in ckCookieData) && !('ck_msclkid' in ckCookieData)) {
                        ckPostback(ckCookieData);
                    }
                }
            }
        }
    };

    a();
} catch (error) {
    console.log('ck_error : ', error);
}
