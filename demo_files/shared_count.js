(function ($) {
    $(document).ready(function () {
        var url = window.location.protocol + "//www.myrecipes.com" + window.location.pathname;
        // construct a configuration
        var config = {
            // enable the debug flag
            debug: false,
            // service for facebook, twitter, pinterest, googleplus
            service: 'f t p g',
            // custom resultHandler
            resultHandler: function (responseResult) {
                // Handle JSON response here
                console.log(responseResult);
                var count = responseResult[0].total;
                if (count > 1000) {
                    count = (Math.floor(count / 100)) / 10 + "k";
                }

                if (count) {
                    $("#totalShareCount").text(count).after(" Shares").parent().show();
                }
            },
            // urls requesting the social data
            urlArr: [
                url
            ],
            // depends on the size of urlArr, resultHandler may be called multiple times.
            async: true,
            // execution error handling
            errorHandler: function (status) {
                console.log(status);
            },
            // ajax request error handling
            ajaxErrorHandler: function (jqXHR, textStatus, errorThrown) {
                console.log("Request Failed: " + textStatus + "-" + errorThrown);
            }
        };
        // invoke the API call
        Onebot.count.get(config);
    });
})(jQuery);
