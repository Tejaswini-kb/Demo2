
   // Onebot global namespace object declaration
   if (typeof window.Onebot === 'undefined') {
        window.Onebot = {};
   }

   // Register the count api
   if (typeof window.Onebot.count === 'undefined') {
        window.Onebot.count = {
        // default opts
        async : true,
        serviceUrl: '//cdn.api.onebot.timeinc.com/stats/com/myrecipes.count.json?s=',
        ajaxErrorHandler : function(jqXHR, textStatus, errorThrown) {  console.log("Failed: "+textStatus+"-"+errorThrown); },
        errorHandler : function(msg) { console.log(msg) },
        debug : false,
        get : function (service, callback, urlArr, opts) {
            if (typeof window.jQuery === "undefined") {
                console.log("jQuery is required to use this method");
                return;
            }
            // instance
            var _self = null;
            if (typeof Object.create !== 'undefined') {
                // Use modern Object.create method
                _self = Object.create(this);
            } else {
                // Fallback to jQuery extend
                 _self = jQuery.extend({}, this);
            }
            // extend
            if (typeof service === 'string') { // legacy argument based
                if (opts != null) {
                    // opts override
                    jQuery.extend(_self, opts);
                }
                _self.urlArr = urlArr;
                _self.resultHandler = callback;
                _self.service = service;
            } else if (typeof service === 'object') { // configuration object based
                jQuery.extend(_self, service);
            }
            if (!_self.urlArr || !_self.urlArr instanceof Array) {
                _self.errorHandler('urlArr of '+_self.urlArr + " is not an array.");
                return;
            }
            // Removed duplicates from Array.prototype.unOnebot
            _self.urlArr = jQuery.unique(_self.urlArr);
            var urls = [];
            var badUrls = [];
            for (var i = 0, j=_self.urlArr.length;i != j;i++) {
                var url = _self.parseUrl(_self.urlArr[i]);
                if (null!=url) {
                    urls.push(encodeURIComponent(url));
                } else {
                    badUrls.push(_self.urlArr[i]);
                    console.log('failed to parse '+_self.urlArr[i]+', skipped');
                }
            }


            if (urls.length == 0) {
                _self.errorHandler("urls argument is empty, nothing to do."+(badUrls.length > 0 ? '[failed to parse: '+badUrls+']': ''));
                return;
            }
            var batch = _self.getBatch(urls);
            if (_self.debug) { console.log('batches: '); console.log(batch); }
            if (batch.length == 1) { // only 1 batch, just call it
                var ajaxUrl = _self.serviceUrl + _self.service + '&urls=' +urls.join(' ');
                if (_self.debug) { console.log("Requesting... "+ajaxUrl) }
                jQuery.get(ajaxUrl, _self.resultHandler, 'json').fail(_self.ajaxErrorHandler)
            } else {
                if (_self.debug) { console.log("Async: "+_self.async); }
                if (_self.async) {
                    // Execute each batch and invoke the callback;
                    for (var i=0,j=batch.length;i!=j;i++) {
                        var ajaxUrl = _self.serviceUrl + _self.service + '&urls=' +batch[i].join(' ');
                        if (_self.debug) { console.log("Requesting... "+ajaxUrl) }
                        jQuery.get(ajaxUrl, _self.resultHandler, 'json').fail(_self.ajaxErrorHandler)
                    }
                }
                else {
                    // Wait till all batches are completed before invoking the callback;
                    var requests = [];
                    for (var i=0,j=batch.length;i!=j;i++) {
                        var ajaxUrl = _self.serviceUrl + _self.service + '&urls=' +batch[i].join(' ');
                        if (_self.debug) { console.log("Requesting... "+ajaxUrl) }
                        requests.push(jQuery.get(ajaxUrl, 'json'));
                    }
                    var defer = jQuery.when.apply($, requests);
                    defer.done(function(){
                        // This is executed only after every ajax request has been completed
                        var result = [];
                        for (var i =0;i!=arguments.length;i++) {
                            result = result.concat(arguments[i][0]);
                        }
                        _self.resultHandler(result);
                    }).fail(_self.ajaxErrorHandler);
                }
            }
        },
        parseUrl : function (url) {
            if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) { // didn't start with http
                return null;
            }
            if (this.getDomainBase() == 'all') {
                return url;
            }
            var strArr = url.split('/');
            if (!strArr[2] || strArr[2].indexOf(this.getDomainBase()) == -1) { // too short or not a valid domain
                return null;
            }
            var subDomain = strArr[2].replace(this.getDomainBase(),'').replace(/\.$/, '');
            return subDomain +'/'+ strArr.slice(3).join('/');
        },
        getDomainBase : function () {
            // Lazy load once
            if (!this.domainBase) {
                var paths = "//cdn.api.onebot.timeinc.com/stats/com/myrecipes".split('/').reverse();
                var i =0;
                for (i;i!=paths.length;i++) {
                    if (paths[i] === 'stats') {
                        break;
                    }
                }
                this.domainBase = paths.slice(0,i).join('.');
            }
            return this.domainBase;
        },
        getBatch : function(arr) {
            // Make a shallow copy
            var newArr = arr.slice(0);
            var byteSize = newArr.join(' ').length;
            var quotient = Math.ceil(byteSize/this.getMaxUrlLength());
            var batchLength = Math.floor(arr.length/quotient);
            var batch = [];
            while (newArr.length > 0) {
                batch.push(newArr.splice(0,batchLength));
            }
            return batch;
        },
        getMaxUrlLength : function () {
            // Based on  http://support.microsoft.com/kb/208427/EN-US
            // IE has limit of 2k where as most modern browser supports much more
            var userAgent = navigator.userAgent.toLowerCase();
            var k = 1024;
            if (/msie/.test(userAgent)) {
                return 2*k;
            } else {
                // cdn and varnish server supports about 10k
                return 7*k;
            }
        }
       };
   }

     // Register the query api
    if (typeof window.Onebot.query === 'undefined') {
        window.Onebot.query = {
            serviceUrl : '//cdn.api.onebot.timeinc.com/stats/com/myrecipes.query.',
            get : function (service, callback) {
                if (typeof window.jQuery === "undefined") {
                    console.log("jQuery is required to use this method");
                    return;
                }
                var ajaxUrl = this.serviceUrl + service + '.json';
                // console.log("Requesting... "+ajaxUrl);
                jQuery.get(ajaxUrl, callback, 'json')
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.log("Failed: "+textStatus+"-"+errorThrown); }
                )
            }
        };
    }
