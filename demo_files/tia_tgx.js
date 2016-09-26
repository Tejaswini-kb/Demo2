/**
 * TGX Compatibility Layer
 */

window.time_dfp = window.time_dfp || [];

/**
 * @description - A Function to enable GPT.
 * @function
 * @public
 */
function Tgx_init() {
    var gads = document.createElement('script');
    var node = document.getElementsByTagName('script')[0];
    gads.type = 'text/javascript';
    gads.src = '//www.googletagservices.com/tag/js/gpt.js';
    node.parentNode.insertBefore(gads, node);
}

Tgx_init();

window.TiiAdConfig = function(sitename) {

    var foo = function() {}, ti_dfp_config, filteredsn;

    window.time_dfp.push(function(){ window.time_dfp.log('Running TGX Compability mode'); });

    // Mappings to divs to mimic TGX <sitename>_# divs
    // filter sitename
    this.originalSitename           = sitename;



    this.popups                     = true;
    this.useBehaviorTracking        = false;

    this.setBehaviorTracking        = foo;

    this.useRevSciTracking          = false;

    this.useTacodaTracking          = false;
    this.setTacodaTracking          = foo;

    this.useQuantcastTracking       = false;
    this.setQuantcastTracking       = foo;

    this.disableInitLoad            = false;
    this.setdisableInitLoad         = function (v) { this.disableInitLoad = v;};

    this.singleRequestMode          = false;
    this.setsingleRequestMode       = function (v) { this.singleRequestMode = v;};

    this.useDequeueAds              = false;
    this.setDequeueAds              = foo;

    this.convertHyphens             = false;
    this.stripNonAlphaNumeric       = false;
    this.setConvertHyphens          = foo;
    this.setStripNonAlphaNumeric    = foo;

    this.lazyLoad                   = undefined;
    this.lazyRange                  = 200;
    this.setLazyLoad                = foo;
    this.setLazyRange               = foo;

    this.setSitename = function(sitename) {
        this.originalSitename  = sitename;
        this.sitename = this.filterSitename(sitename);
    };

    this.setCmSitename = function(sitename) {
        // remove numbers
        this.cmSitename = sitename.replace(/[0-9]/g, '');
    };

    this.filterSitename = function(sitename) {
        var mobflag = sitename.search("_mob|_tablet");
        var cmflag = sitename.search("cm.");
        if (mobflag !== -1) {
            sitename = sitename.replace(/_mob.*|_tablet/i, "");
        }
        if (cmflag !== -1) {
            sitename = sitename.replace(/[0-9]/g, '');
        }
        else {
            sitename = sitename.replace(/[^a-z]/g, '');
        }

        return sitename;
    };

    this.cmSitename = function(sitename) {
        this.sitename = sitename;
    };

    filteredsn                      = this.filterSitename(sitename);
    this.sitename                   = filteredsn;
    this.cmSitename                 = filteredsn;


    this.setPopups = function(popups) {
        this.popups = popups;
    };

    this.setRevSciTracking = function(shouldSet) {
        this.useRevSciTracking = shouldSet;
    };

};

window.TiiAdFactory = function() {
    // Detect if first argument is a string or an array
    var first = arguments[0], ti_dfp_config;
    var foo = function() {};
    var _this = this;

    this.tgx_div_mappings = {};

    this.getParentDiv = function (tgxid) {
        for (var i in this.tgx_div_mappings) {
            if (this.tgx_div_mappings.hasOwnProperty(i)) {
                if (this.tgx_div_mappings[i] === tgxid) {
                    return i;
                }
            }
        }
        return false;
    };

    this.setChannel = function(channel) {

    };

    this.setChannelPage = function () {

    };

    if (typeof first == "string") {
        this.sitename           = first;
        this.cmSitename         = first;
        this.lazyRange          = 200;
    } else if (typeof first == "object") {
        this.config             = first;
        this.sitename           = first.sitename;
        this.cmSitename         = first.cmSitename;
        this.lazyRange          = first.lazyRange ? first.lazyRange : 200;
    }

    this.oopSlotFired           = false;
    this.oopSlotID              = false;
    this.cmOopSlotFired         = false;
    this.cmOopSlotID            = false;
    this.cmOopSlotSet           = false;
    this.oopSlotSet             = false;
    this.adServer               = null;
    this.randomNumber           = foo;
    this.tileCounter            = 1;
    this.params                 = [];
    this.zone                   = (arguments.length == 2) ? arguments[1] : "";
    this.dcopt                  = false;
    this.behaviorTracked        = false;
    this.lazyLoad               = undefined;
    this.createAd               = function () {
        var width, height, zone, ad;

        if (arguments.length == 2) {
            width = arguments[0];
            height = arguments[1];
        } else {
            // Assume 3 arguments
            width = arguments[0];
            height = arguments[1];
            zone = arguments[2];
        }

        ad = new TiiAd(this, width, height, this.tileCounter);

        if (null !== zone && undefined !== zone) {
            ad.setZone(zone);
        }

        // Copy Factory params to this specific ad
        for (var key in this.params) {
            ad.setParam(key, this.params[key]);
        }

        var asiparam = [];

        this.tileCounter++;

        return ad;
    };
    this.refreshAds             = function (slots, updateCorrelator, loadOOPslots) {
        var dfpSlots = [], i;

        if (updateCorrelator === undefined) {
            updateCorrelator = true;
        }
        if (loadOOPslots === undefined) {
            loadOOPslots = true;
        }
        if (typeof slots === 'string') {
            dfpSlots = this.tgx_div_mappings[slots];
        }
        else if (slots === undefined) {
            dfpSlots = undefined;
        }
        else {
            for (i = 0; slots.length > i; i++) {
                if (this.tgx_div_mappings[slots[i]] !== undefined) {
                    dfpSlots.push(this.tgx_div_mappings[slots[i]]);
                }
            }
        }

        if (loadOOPslots) {
            if (!this.cmOopSlotFired && this.cmOopSlotID !== false) {
                dfpSlots.push(this.cmOopSlotID);
                this.cmOopSlotFired = true;
            }
            if (!this.oopSlotFired && this.oopSlotID !== false) {
                dfpSlots.push(this.oopSlotID);
                this.oopSlotFired = true;
            }
        }

        window.time_dfp.push(function () { window.time_dfp.refresh(dfpSlots, updateCorrelator);});
    };

    this.refreshBatchAds        = foo;
    this.clearRefreshBatchAds   = function  (slots,slotkeys,val) {
        time_dfp.push(function(){
            time_dfp.updateCorrelator();
        });

        this.refreshAds(slots, false, true);
    };
    this.clearRefreshAds        = this.clearRefreshBatchAds;
    this.resetOOP               = function (oop_parent_div_id, slot){
        this.cmOopSlotFired = false;
        this.oopSlotFired = false;
        this.cmOopSlotSet = false;
        this.oopSlotSet = false;
    };

    this.loadOop               = function (oop_parent_div_id, slot){
        var adobj = {};
        var oop_div;

        adobj = {
            oop: true
        };

        if (slot !== undefined) {
            adobj.targeting = slot.targeting;
            adobj.sitename = slot.sitename;
            adobj.zone = slot.zone;
        }

        // Fire OOP slot once per refresh
        if (adobj.sitename !== undefined && adobj.sitename.indexOf('cm.') > -1 && this.cmOopSlotSet !== false) {
            return;
        }
        else if ((adobj.sitename === undefined || adobj.sitename.indexOf('cm.') === -1) && this.oopSlotSet !== false) {
            return;
        }

        oop_div = this.sitename + '_' + this.tileCounter;
        this.tileCounter++;
        this.tgx_div(oop_parent_div_id, oop_div);
        adobj.id = oop_div;

        if (adobj.sitename !== undefined && adobj.sitename.indexOf('cm.') > -1) {
            this.cmOopSlotSet = true;
            this.cmOopSlotID = oop_div;
            if (this.config.disableInitLoad !== true) {
                this.cmOopSlotFired = true;
            }
        }
        else {
            this.oopSlotSet = true;
            this.oopSlotID = oop_div;
            if (this.config.disableInitLoad !== true) {
                this.oopSlotFired = true;
            }
        }

        window.time_dfp.push(function(){time_dfp.defineSlot(adobj);});
    };
    this.getAd                  = function(){
        var width, height, zone, ad, size;

        if (arguments.length == 1 && typeof arguments[0] === 'string' && arguments[0].indexOf('x') > 0) {
            size = arguments[0].split('x');

            ad = this.createAd(size[0], size[1]);

        }

        if (arguments.length == 2) {
            width = arguments[0];
            height = arguments[1];

            ad = this.createAd(width, height);

        } else if (arguments.length > 2) {
            width = arguments[0];
            height = arguments[1];
            zone = arguments[2];

            ad = this.createAd(width, height, zone);
        }

        if (this.dcopt === false) {
            ad.setParam("oop", "yes");
            this.dcopt = true;
        }

        return ad;
    };
    this.getCmAd                = function (width, height, position, type) {
        var ad = this.createAd(width, height);
        ad.setParam("cmpos", position);
        ad.setParam("cmtyp", type);
        ad.sitename = this.cmSitename;
        return ad;
    };

    this.getMultiCmAd           = function(sizes, position, type) {
        var width = sizes[0].split("x")[0];
        var height = sizes[0].split("x")[1];
        var ad = this.getCmAd(width, height, position, type);
        var sizeValue = sizes.join(",");
        ad.setParam("sz", sizeValue);
        return ad;
    };
    this.getMultiAd             = function(sizes, position, type) {
        var width = sizes[0].split("x")[0];
        var height = sizes[0].split("x")[1];
        var ad = this.getAd(width, height);
        var sizeValue = sizes.join(",");
        ad.setParam("sz", sizeValue);
        return ad;
    };
    this.getTransitionalAd      = foo;
    this.setArticleId           = function (v) { this.setParam('aid', v);};
    this.setChannel             = function (v) { this.setParam('ch', v);};
    this.setChannelPage         = function () { this.setParam('ptype', 'channel');};
    this.setContentPage         = function () { this.setParam('ptype', 'content');};
    this.setContentType         = function (v) { this.setParam('ctype', v);};
    this.setPackageId           = function (v) { this.setParam('pid', v);};
    this.clearParam             = function (keyremove) {
        if (keyremove) {
            var deletekey = keyremove;
            delete this.params[deletekey];
        }
        else {
            for (var key in this.params) {
                delete this.params[key];
            }
        }
    };
    this.setSubchannel          = function (v) { this.setParam('sch', v);};
    this.setZone                = function (zone) {
        var _this = this;
        this.zone = zone;
        window.time_dfp.push(function () { window.time_dfp.config.zone = _this.zone;});
    };

    this.slotRenderEnded        = TiiAdFactorySlotRenderEnded;
    this.setLazyLoad            = foo;
    this.updateCorrelator       = function(){
        window.time_dfp.push(function(){time_dfp.updateCorrelator();});
    };
    this.setLazyRange           = foo;

    this.setParam = function(key, value) {
        if (key === "dcopt") {
            key = "oop";
            value = "yes";
        }
        if (key === "slotname") {

        } else {
            if ((typeof key !== "undefined") && (typeof value !== "undefined")) {
                if (typeof (value) == "object") {
                    this.params[key] = value;
                    window.time_dfp.push(function () {
                        window.time_dfp.config.setGlobalTargeting[key] = value;
                    });
                } else {
                    if (value.toString() !== "") {
                        this.params[key] = value;
                        window.time_dfp.push(function () {
                            window.time_dfp.config.setGlobalTargeting[key] = value;
                        });
                    }
                }
            }
        }
    };

    this.tgx_div = function (original_div, tgx_div_id) {
        var divEl;

        divEl = document.createElement('div');

        if (typeof original_div === 'string') {
            original_div = document.getElementById(original_div);
        }

        if (original_div === false || original_div === undefined) {
            window.time_dfp.push(function () {
                window.time_dfp.log('TGX Comaptibilty - Could not determine parent for slot - ' + tgx_div_id + ' - appending to BODY');
            });
            original_div = document.body;
        }

        divEl.setAttribute('id', tgx_div_id);
        original_div.appendChild(divEl);
    };

    // Configure time_dfp
    ti_dfp_config = {
        setTargeting: {}, // additional targeting globally
        setGlobalTargeting: {},
        enableSingleRequest: this.config.singleRequestMode, // expecting the call to be done in SRA
        disableInitialLoad: this.config.disableInitLoad,
        collapseEmptyDivs: true, // this is different than jquery.dfp. if (false) we call googletag.pubads().collapseEmptyDivs(), if (true) we call googletag.pubads().collapseEmptyDivs(true)  see - https://support.google.com/dfp_premium/answer/3072674
        sitename: this.sitename,
        comscore: false,
        evidon: false,
        oop: false,
        zone: this.zone,
        gptAsync: false
    };

    if(!(typeof TGX_SITE_CONFIG  !== 'undefined' && TGX_SITE_CONFIG.comscore === false)){
        ti_dfp_config.comscore = true;
    }

    if(!(typeof(TGX_SITE_CONFIG) !== 'undefined' && TGX_SITE_CONFIG.evidon === false)){
        ti_dfp_config.evidon = true;
    }

    if(typeof TGX_SITE_CONFIG !== 'undefined' && typeof TGX_SITE_CONFIG.VR_CONFIG !== 'undefined' && typeof TGX_SITE_CONFIG.VR_CONFIG.enabled !== 'undefined' && TGX_SITE_CONFIG.VR_CONFIG.enabled) {
        ti_dfp_config.vr = {enable:true};
        if(typeof TGX_SITE_CONFIG.VR_CONFIG.id !== 'undefined'){
            ti_dfp_config.vr.id = TGX_SITE_CONFIG.VR_CONFIG.id;
        }

        if (typeof TGX_SITE_CONFIG.VR_CONFIG.automate !== 'undefined' && TGX_SITE_CONFIG.VR_CONFIG.automate) {
            ti_dfp_config.vr.automate = true;
        }
    }

    if(!(typeof(TGX_SITE_CONFIG) !== "undefined" && TGX_SITE_CONFIG.bluekai === false)){
        ti_dfp_config.bk = true;
    }

    // intialize time_dfp
    window.time_dfp.push(function () { window.time_dfp.init(ti_dfp_config);});

    this.slotAfterDefine = function (e) {
        var adSlot = e.detail.arg;
        var dfpId = adSlot.id;
        var parentId = this.getParentDiv(dfpId);
        if (parentId !== false) {
            tgxDo.slots[parentId] = adSlot.dfpSlot;
        }
    };

    window.addEventListener('dfp.slotAfterDefine', function(e) {
        _this.slotAfterDefine(e);
    });

};

window.TiiAd = function(factory, width, height, tileNumber) {
    var foo = function(){};
    var _this = this;

    this.factory            = factory;
    this.tileNumber         = tileNumber;
    this.width              = width;
    this.height             = height;
    this.params             = [];

    // Methods
    this.setParam = function(key, value) {
        if (key === "dcopt") {
            key = "oop";
            value = "yes";
        }
        if (key === "slotname") {

        } else {
            if ((typeof key !== "undefined") && (typeof value !== "undefined")) {
                if (typeof (value) == "object") {
                    this.params[key] = value;
                } else {
                    if (value.toString() !== "") {
                        this.params[key] = value;
                    }
                }
            }
        }
    };
    this.setMagicNumber     = foo;
    this.setPosition        = function (v) { this.setParam('pos', v);};
    this.setZone            = function (zone) {this.zone = zone;};
    this.write              = function (parentDivId, isCompanion) {
        var adobj = {}, parentDiv, tgx_id = this.sitename + '_' + this.tileNumber;
        var scripts = document.getElementsByTagName("script");

        if (parentDivId === undefined) {
            parentDiv = scripts[scripts.length - 1].parentNode;
            _this.factory.tgx_div_mappings[_this.factory.tgx_div_mappings.length] = tgx_id;
            window.time_dfp.push(function () {
                window.time_dfp.log('TGX Compatibilty -- No Parent DIV ID Supplied --> ' + _this.factory.tgx_div_mappings[parentDivId]);
            });
        }
        else {
            // Temporarily set the tgxDo slot value for sites that depend on it being set (Time/Money)
            tgxDo.slots[parentDivId] = tgx_id;
            parentDiv = document.getElementById(parentDivId);
            _this.factory.tgx_div_mappings[parentDivId] = tgx_id;

            window.time_dfp.push(function () {
                window.time_dfp.log('TGX Compatibilty -- Mapping DIV - ' + parentDivId + ' --> ' + _this.factory.tgx_div_mappings[parentDivId]);
            });
        }

        _this.factory.tgx_div(parentDiv, _this.factory.tgx_div_mappings[parentDivId]);

        adobj = {
            id: _this.factory.tgx_div_mappings[parentDivId],
            size: this.getSize(),
            targeting: this.params,
            sitename: _this.config.filterSitename(this.sitename),
            zone: this.zone
        };

        if (isCompanion !== undefined) {
            adobj.companion = true;
        }
        window.time_dfp.push(function(){time_dfp.defineSlot(adobj);});

        if (this.params.oop === 'yes') {
            _this.factory.loadOop(parentDivId, adobj);
        }
    };
    this.updateCorrelator = this.factory.updateCorrelator;



    // Private Methods
    this._formatParams      = foo;
    this._getAdParams       = foo;
    this._getAdTag          = foo;
    this._getAdUrl          = foo;
    this._getImageUrl       = foo;
    this._getClickUrl       = foo;
    this._getDebugHtml      = foo;
    this._getSecureAdTag    = foo;
    this._cleanValue        = foo;

    // Copy factory settings
    this.randomNumber       = factory.randomNumber;
    this.adServer           = factory.adServer;
    this.tileNumber         = factory.tileCounter;
    this.zone               = factory.zone;
    this.sitename           = factory.sitename;
    this.config             = factory.config;


    this.getSize            = function() {
        var size = [], sizes = [], t_size, i, len;
        if (this.params.sz === undefined) {
            if (this.width !== undefined && this.height !== undefined) {
                return [+this.width, +this.height];
            }
            return false;
        }
        else {
           sizes = this.params.sz.split(',');
        }

        if (sizes.length === 1) {
            size = sizes[0].split('x');
            size[0] = +size[0];
            size[1] = +size[1];
        }
        else {
            for (i = 0, len = sizes.length; i < len; i++) {
                t_size =sizes[i].split('x');
                t_size[0] = +t_size[0];
                t_size[1] = +t_size[1];
                size.push(t_size);
            }
        }

        return size;
    };
};

function TiiRefreshComScoreTag() {
    if (typeof(COMSCORE) == "object") {
        url = (arguments.length == 1 ? arguments[0] : document.location);
        COMSCORE.beacon({
            c1:2,
            c2:6035728,
            c4: url
        });
    }
}

function TgxData() {
    this.params             = [];
    this.bkparams           = [];
    this.pageparams         = [];
    this.slotparams         = [];
    this.refreshSlot        = null;
    this.istSlot            = null;
    this.istCmSlot          = null;
    this.parentDiv          = null;
    this.zone               = "";
    this.slotQueue          = [];
    this.renderingMode      = null;
    this.processMode        = null;
    this.disableinitMode    = null;
    this.singlerequestMode  = null;
    this.slots              = [];
    this.slotkeys           = [];
    this.oopslots           = [];
}

var tgxDo = new TgxData();

// Stubs for function not supported
var _stubTgxFunction = function () {
    var i, stub = function (function_name) {
        var f = (function () {
            var stubname = function_name;
            return function () {
                window.time_dfp.push(function () {
                    window.time_dfp.log('Running a stubbed TGX function consider replacing: ' + stubname);
                });
            };
        })();
        return f;
    };
    var function_list = [
        'TimeHatConfig',
        'TiiAdGetQuantcastSegments',
        'TiiAdTrackRevSci',
        'TiiAdQuantBlueKaiMindsetImpl',
        'TiiAdFactorySetbkParam',
        '_TiiAudsciTargeting',
        'TiiAdTrackBehavior',
        'TiiAdGetTacodaSegments',
        'TiiAdGetRevSciSegments',
        'TiiAdsGetVideoTestParam',
        'tiiAdSetType',
        'tiiAdSetTarget',
        'tiiHtmlAdWH',
        'TiiBkBeacon',
        'TiiBkFireBeacon',
        'TgxUtilGetRootDomain',
        'TgxUtilGetSubDomain',
    ];

    for (i = 0; i < function_list.length; i++) {
        window[function_list[i]] = stub(function_list[i]);
    }
};


// Support Functions
function TiiAdsParseQueryString(sParam) {
    var sQueryString = window.location.search;
    if (!sQueryString) {
        return;
    } else {
        sQueryString = decodeURI(sQueryString.substring(1));
    }
    var aPairs = sQueryString.split("&");
    var aParams = [];
    var aKeyValue = [];
    for (var i = 0; i < aPairs.length; i++) {
        aKeyValue = aPairs[i].split("=");
        if (aKeyValue.length>1){aParams[aKeyValue[0]]=aKeyValue[1];}
    }
    return aParams[sParam];
}

function TiiAdsIsTestMode() {
    return window.location.search.indexOf("testads") >= 0;
}

function TiiAd_isSecure() {
    return (document.location.protocol == "https:");
}

function TiiAdFactorySlotRenderEnded(callback, adslots) {
    var _callback = callback, _adslots = adslots;
    var cb = function(e) {
        var divId = e.detail.arg.slot.getSlotId().getDomId();
        var addiv, i;
        var adsize = e.detail.arg.size;
        if(divId) {
            addiv = document.getElementById(divId);
        }
        if(addiv && adslots.length > 0) {
            for ( i = 0; i < adslots.length; i++) {
                if (addiv.parentNode.id == adslots[i]) {
                    callback(adslots[i], adsize);
                }
            }
        }
    };
    window.addEventListener('dfp.slotRenderEnded', cb);
}

function TgxAdBridge(ad) {
    this.ad = ad;
    this._getScript = function () {

    };
}
_stubTgxFunction();

/* globals window */

/**
 * Track tracking for 3rd party tracking for DFP
 */

(function(window) {

    var tracking =  function () {
        var _this = this;

        window.addEventListener('dfp.beforeInit', function(e) {
            _this.fireEvents(_this.onInit, [e.detail.dfp]);
        });

        window.addEventListener('dfp.afterInit', function(e) {
            _this.fireEvents(_this.onAfterInit, [e.detail.dfp]);
        });

        window.addEventListener('dfp.defineSlot', function(e) {
            _this.fireEvents(_this.defineSlot, [e.detail.dfp, e.detail.arg]);
        });

        window.addEventListener('dfp.slotBeforeDisplay', function(e) {
            _this.fireEvents(_this.displaySlot, [e.detail.dfp, e.detail.arg]);
        });

        window.addEventListener('dfp.refresh', function(e) {
            _this.fireEvents(_this.onRefresh, [e.detail.dfp]);
        });

        window.addEventListener('dfp.slotRefresh', function(e) {
            _this.fireEvents(_this.onSlotRefresh, [e.detail.dfp, e.detail.arg]);
        });

        this.onInit = [];
        this.onAfterInit = [];
        // Before Refresh
        this.onRefresh = [];
        this.onSlotRefresh = [];
        this.defineSlot = [];
        this.displaySlot = [];
        this.blockLoad = false;
    };

    tracking.prototype.fireEvents = function (eventArray, e) {
        var i, len;
        for (i = 0, len = eventArray.length; i < len; i++) {
            try {
                eventArray[i].apply(window, e);
            }
            catch (error) {
                console.error('error: tracking.fireEvents - ' + eventArray[i].toString());
                console.error(error);
            }
        }
    };

    window.dfp_tracking = new tracking();

})(window);
/* globals window, document, googletag */

var amznads = amznads || {};

(function() {

    var onInit = function(dfp) {
        var startTime = Date.now(), sleepRound, session_complete = false;
        if( !( typeof dfp.config.amazon !== 'undefined' && dfp.config.amazon === false ) ) {
            sleepRound = dfp.sleep("amazon");
            amznads.asyncParams = {
                'id': '3042',
                'callbackFn': function() {
                    try {
                        amznads.setTargetingForGPTAsync('amznslots');
                    } catch (e) { /*ignore*/ }
                    /* Continue your DFP call here (optional) */
                    dfp.log('Amazon Loaded in ' + (Date.now() - startTime) + ' milliseconds');
                    if (!session_complete) {
                        dfp.wakeup("amazon", sleepRound);
                    }
                    else {
                        dfp.log('Amazon Already woke up dfp, bypassing wakeup()');
                    }
                    session_complete = true;
                },
                'timeout': 2e3
            };
            (function() {
                var head = document.head || document.getElementsByTagName('head')[0], a;
                a = document.createElement('script');
                a.type = 'text/javascript';
                a.async = true;
                //Amazone ads url was explicitely http protocol so i removed http: so that it will work on both protocols.
                a.src = '//c.amazon-adsystem.com/aax2/amzn_ads.js';
                head.appendChild(a); //append after gpt.js
            })();
        }
    };

    var onRefresh = function (dfp) {
        var sleepRound, _dfp = dfp;
        if( !( typeof dfp.config.amazon !== 'undefined' && dfp.config.amazon === false ) ) {
            sleepRound = dfp.sleep('amazon');
            (function() {
                googletag.cmd.push(function() {
                    googletag.pubads().clearTargeting('amznslots'); //clear custom targeting value by key
                    var amazonCallbackFunction = function() {
                        amznads.setTargetingForGPTAsync('amznslots');  //reset custom targeting value by key
                        _dfp.wakeup("amazon", sleepRound);
                    };
                    amznads.getAdsCallback('3042', amazonCallbackFunction);
                });
            })();
        }

    };

    if (window.dfp_tracking !== undefined) {
        window.dfp_tracking.onInit.push(onInit);
        window.dfp_tracking.onRefresh.push(onRefresh);
    }

})();

/* globals window, document, bk_addPageCtx, bk_doJSTag, TIICONSTANTS, s_time, s_account, navigator */

(function() {
    var BKCONSTANTS = {
        'bk_enabled_root_domains': 'content.timeinc.net,people.com,peoplestylewatch.com,celebritybabies.com,peoplepets.com,realsimple.com,ew.com,peopleenespanol.com,essence.com,instyle.com,time.com,timeforkids.com,sportsillustrated.cnn.com,si.com,sikids.com,golf.com,fannation.com,allyou.com,coastalliving.com,cookinglight.com,myrecipes.com,southernliving.com,thisoldhouse.com,myhomeideas.com,health.com,foodandwine.com,travelandleisure.com,departures.com,fortune.com,money.com',
        'bk_disabled_root_domains': 'eskyguide.com,executivetravelmagazine.com,sunset.com',
        'bk_enabled_sub_domains': 'westphoria.sunset.com',
        'bk_id': '13731',
        'bk_pixel_limit': '6',
        'bk_keys': 'aid, ch, ctype, path, oid, ptype, sch, rhost'
    };

    var onInit = function(dfp) {

        if( !( typeof dfp.config.bk !== "undefined" && dfp.config.bk === false )){
            var bk = {};
            bk.zone = "";
            bk.bkFireBeacon = function (){
                var key;
                if ( document.referrer === "" ) {
                    bk_addPageCtx( "ref", "n" );
                } else {
                    bk_addPageCtx( "ref", document.referrer.toString().substring( 0, 250 ) );
                }

                for ( key in dfp.config.setGlobalTargeting ) {
                    if ( BKCONSTANTS.bk_keys.indexOf( key ) >= 0 ) {
                        if( typeof dfp.config.setGlobalTargeting[ key ] !== 'undefined' ){
                            bk_addPageCtx( key, dfp.config.setGlobalTargeting[ key ]);
                        }
                    }
                }

                for ( key in dfp.config.setTargeting ) {
                    if ( BKCONSTANTS.bk_keys.indexOf( key ) >= 0 ) {
                        if( typeof dfp.config.setTargeting[ key ] !== 'undefined' ){
                            bk_addPageCtx( key, dfp.config.setTargeting[ key ]);
                        }
                    }
                }

                if ( typeof dfp.config.bk != "undefined" && typeof dfp.config.bk.params != "undefined" ) {
                    for ( key in dfp.config.bk.params ) {
                        if( dfp.config.bk.params.hasOwnProperty( key ) ){
                            bk_addPageCtx( key, ( typeof dfp.config.bk.params[ key ] !== "undefined" ) ? dfp.config.bk.params[ key ] : "" );
                        }
                    }
                }

                if ( typeof s_time != "undefined" ) {
                    bk_addPageCtx( "channel", ( typeof s_time.channel !== "undefined" ) ? s_time.channel : "" );
                    bk_addPageCtx( "p16", ( typeof s_time.prop16 !== "undefined" ) ? s_time.prop16 : "" );
                    bk_addPageCtx( "p11", ( typeof s_time.prop11 !== "undefined" ) ? s_time.prop11 : "" );
                    bk_addPageCtx( "e23", ( typeof s_time.eVar23 !== "undefined" ) ? s_time.eVar23 : "" );
                    bk_addPageCtx( "p12", ( typeof s_time.prop12 !== "undefined" ) ? s_time.prop12 : "" );
                    bk_addPageCtx( "p15", ( typeof s_time.prop15 !== "undefined" ) ? s_time.prop15 : "" );
                    bk_addPageCtx( "p20", ( typeof s_time.prop20 !== "undefined" ) ? s_time.prop20 : "" );
                    bk_addPageCtx( "p5", ( typeof s_time.prop5 !== "undefined" ) ? s_time.prop5 : "" );
                    bk_addPageCtx( "p7", ( typeof s_time.prop7 !== "undefined" ) ? s_time.prop7 : "" );

                    bk_addPageCtx( "e30", ( typeof s_time.eVar30 !== "undefined" ) ? s_time.eVar30 : "" );
                    bk_addPageCtx( "e31", ( typeof s_time.eVar31 !== "undefined" ) ? s_time.eVar31 : "" );
                    bk_addPageCtx( "e32", ( typeof s_time.eVar32 !== "undefined" ) ? s_time.eVar32 : "" );
                    bk_addPageCtx( "e33", ( typeof s_time.eVar33 !== "undefined" ) ? s_time.eVar33 : "" );
                    bk_addPageCtx( "e34", ( typeof s_time.eVar34 !== "undefined" ) ? s_time.eVar34 : "" );
                    bk_addPageCtx( "e38", ( typeof s_time.eVar38 !== "undefined" ) ? s_time.eVar38 : "" );

                    bk_addPageCtx( "events", ( typeof s_time.events !== "undefined" ) ? s_time.events : "" );
                    bk_addPageCtx( "pgname", ( typeof s_time.pageName !== "undefined" ) ? s_time.pageName : "" );
                    bk_addPageCtx( "e6", ( typeof s_time.eVar6 !== "undefined" ) ? s_time.eVar6:"");
                    bk_addPageCtx( "campaign", ( typeof s_time.campaign !== "undefined" ) ? s_time.campaign : "" );
                    bk_addPageCtx( "s_acct", ( typeof s_account !== "undefined" ) ? s_account : "" );
                    bk_addPageCtx( "p3", ( typeof s_time.prop3 !== "undefined" ) ? s_time.prop3 : "" );
                    bk_addPageCtx( "device", navigator.userAgent );
                }
                bk_doJSTag( BKCONSTANTS.bk_id, BKCONSTANTS.bk_pixel_limit );
            };
            bk.enabled = 0;

            ( function( d, a, u ) {
                var s = d.createElement( a ),
                    x = d.getElementsByTagName( a )[ 0 ];

                var core, subs, called;
                core = subs = called = false;
                s.async = true;
                s.src = u.isSecure() ?
                    "https://a248.e.akamai.net/f/1016/606/2d/tiads-ssl.timeinc.net/ads/tii_bk-coretag.js" :
                    "http://tiads.timeinc.net/ads/tii_bk-coretag.js";
                x.parentNode.insertBefore( s, x );

                var s2 = d.createElement( a ),
                    x2 = d.getElementsByTagName( a )[ 0 ];
                s2.async = true;
                s2.src = u.isSecure() ?
                    "https://a248.e.akamai.net/f/1016/606/2d/tiads-ssl.timeinc.net/ads/subsbk.js" :
                    "http://tiads.timeinc.net/ads/subsbk.js";
                x2.parentNode.insertBefore( s2, x2 );

                s2.onload = function(){
                    subs = true;
                    if(core === subs === true ){
                        afterload();
                    }
                };

                s.onload = function(){
                    core = true;
                    if(core === subs === true ) {
                        setTimeout(function () {
                            afterload();
                        },10);
                    }
                };

                function afterload(){
                    if(!called){
                        called = true;
                        bk.enabled = 1;
                        bk.bkFireBeacon();
                    }
                }

            })( document, "script", dfp.dfpUtil );
        }
    };

    if (window.dfp_tracking !== undefined) {
        window.dfp_tracking.onInit.push(onInit);
    }

})();

/* globals window, document, COMSCORE */

(function() {

    var onInit = function(dfp) {
        if( !( typeof dfp.config.comscore !== "undefined" && dfp.config.comscore === false )){
            ( function( d, a ) {
                var s = d.createElement( a ),
                    x = d.getElementsByTagName( a )[ 0 ];
                s.async = true;
                s.src = "//b.scorecardresearch.com/beacon.js?c1=2&c2=6035728";
                x.parentNode.insertBefore( s, x );
            })( document, "script" );
        }
    };

    /**
     * Backword compatibility if any one still using this method.
     * @type {Window.TiiRefreshComScoreTag}
     */
    var onRefresh = window.TiiRefreshComScoreTag = function () {
        var url;
        if ( typeof COMSCORE  == "object" ) {
            url = ( arguments.length == 1 ? arguments[ 0 ] : document.location );
            COMSCORE.beacon({
                c1:2,
                c2:6035728,
                c4: url
            });
        }
    };

    if (window.dfp_tracking !== undefined) {
        window.dfp_tracking.onInit.push(onInit);
        //window.dfp_tracking.onRefresh.push(onRefresh);  as nothing to do with ads refresh
    }

})();

(function() {

    var onInit = function(dfp) {
        var _qsegs, rsi_segs, rsi_cookie, segLen, segQS, segs, i;
        var _qsegs_cookie, segArray;
        var tcd_segs, segArr;
        var dfpUtil = dfp.dfpUtil;
        var platformVal = dfpUtil.getCookie('TI_PREFS');
        dfp.config.setTargeting = dfp.config.setTargeting || {};
        if(navigator.userAgent.match(/iPad/i) || platformVal === 'tablet'){
            dfp.config.setTargeting.plat = "tablet";
        } else if (navigator.userAgent.match(/Mobi/)||platformVal === 'phone'||platformVal === 'iphone'){
            dfp.config.setTargeting.plat = "mobile";
        } else {
            dfp.config.setTargeting.plat = "desktop";
        }

        dfp.config.setGlobalTargeting = dfp.config.setGlobalTargeting || {};
        /*
         if( typeof dfpUtil.zone !== "undefined" && typeof dfp.config.setTargeting.zone === "undefined"){
         dfp.config.setTargeting.zone = dfpUtil.zone;
         }
         //*/

        if (dfp.config.useBehaviorTracking  || dfp.config.useRevSciTracking) {
            rsi_segs = [];
            segs = [];
            rsi_cookie = dfpUtil.getCookie("rsi_segs");
            segLen = 10;
            segQS = "";
            segArr = [];
            if (rsi_cookie !== null) {
                rsi_segs.rsi_cookie.split("|");
            }
            if (rsi_segs.length < segLen){
                segLen = rsi_segs.length;
            }

            for (i = 0; i < segLen; i++){
                segArr = rsi_segs[i].split("_");
                if (segArr.length > 1) {
                    segs.push(segArr[1]);
                    //segQS += ("rsi" + "=" + segArr[1] + ";")
                }
            }

            dfp.config.setGlobalTargeting.rsseg = segs;
        }

        if (dfp.config.useQuantcastTracking) {
            _qsegs = [];
            _qsegs_cookie = dfpUtil.getCookie("__qseg");
            segLen = _qsegs.length;
            segArray = [];
            segs = [];
            if (_qsegs_cookie !== null) {
                _qsegs = _qsegs_cookie.split("|");
            }
            segs[0] = "";
            for (i = 0; i < segLen && i < 10; i++ ){
                segArray = _qsegs[i].split("_");
                if (segArray.length>1){
                    segs.push(segArray[1]);
                }
            }

            dfp.config.setGlobalTargeting.qc = segs;
        }

        if (dfp.config.useTacodaTracking) {
            cd_segs = [];
            tcd_segs_cookie = dfpUtil.getCookie("AxData");
            segs = [];
            if (tcd_segs_cookie !== null) {
                tcd_segs = tcd_segs_cookie.split("#");
            }

            if(tcd_segs.length > 0 && tcd_segs[1].indexOf("|") > 0) {
                tcd_segs = tcd_segs[1].split("|");
                segLen = "";
                segArr = [];
                segLen = tcd_segs.length;
                for (i = 0; i < segLen; i++){
                    segs.push(tcd_segs[i]);
                }
            } else {
                segs.push(tcd_segs[1]);
            }

            dfp.config.setGlobalTargeting.tcseg = segs;
        }

        var referrerDomain = document.referrer.split("/")[2];
        dfp.config.setGlobalTargeting.domain = document.URL.split("/")[2];
        if (document.referrer !== "") {
            dfp.config.setGlobalTargeting.rhost = referrerDomain;
        }

        if (typeof referrerDomain == "undefined" || referrerDomain != dfp.config.setGlobalTargeting.domain) {
            dfp.config.setGlobalTargeting.pu = 0;
        }

        return dfp.config;
    };

    if (window.dfp_tracking !== undefined) {
        window.dfp_tracking.onInit.push(onInit);
    }

})();

(function() {
    /**
     * Tealium UDO object for dfp
     * @type {object}
     * @class tealiumdfp
     */
    var tealiumdfp = {
        /**
         * Status for tealium
         * @type {boolian}
         */
        status: false,
        /**
         * Tealium udo mapping for the DFP
         */
        map:{
            "targeting":{
                "slot":{
                    "aid":"content_id",
                    "ch":"site_section1",
                    "pid":"content_package_id",
                    "sch":"site_section2",
                    "ptype":"pi_page_type",
                    "ctype":"template_type",
                },
                "page":{},
            }//,
            //"config":{
                //"sitename":"channel"
                //"cmsitename":"TBD",
                //"zone":"TBD"
            //}
        },
        /**
         * get Tealium value from page if defined
         * @param {string} key
         * @returns {*}
         */
        get:function(key){
            return window.Ti.udo_metadata[key];
        },
        /**
         * Adding page level targeting key value from tealium
         * @param {object} conf
         * @param {object} dfp
         */
        addDfpTargeting:function(conf, dfp){
            var self =this;
            for(var gk in conf){
                if(self.checkIsDefined(gk)){
                    dfp.config.setTargeting[gk] = self.get(conf[gk]);
                }
            }
        },
        /**
         * Adding slot lovel targeting key value from tealium
         * @param {object} conf
         * @param {object} dfp
         */
        addSlotTargeting:function(conf, dfp){
            var self =this;
            for(var sk in conf){
                if(self.checkIsDefined(sk)){
                    dfp.config.setGlobalTargeting[sk] = self.get(conf[sk]);
                }
            }
        },
        /**
         * Adding configuration value from tealium
         * @param {object} conf
         * @param {object} dfp
         */
        addConfig:function(conf, dfp){
            var self =this;
            for(var ck in conf){
                if(self.checkIsDefined(ck)){
                    dfp.config[ck] = self.get(conf[ck]);
                }
            }
        },
        /**
         * Check wheather tealium value exist
         * @param  {string} key
         * @returns {boolean}
         */
        checkIsDefined:function(key){
            return (typeof window.Ti !== 'undefined' && typeof window.Ti.udo_metadata[key] !== 'undefined');
        },
        /**
         * Initialize Tealium Udo object
         * @param {object} dfp
         */
        init:function(dfp){
            if(typeof Ti !== 'undefined' && typeof Ti.udo_metadata !== 'undefined'){
                this.status = true;
                var self = this;
                dfp.config.setTargeting = dfp.config.setTargeting || {};
                dfp.config.setGlobalTargeting = dfp.config.setGlobalTargeting || {};

                for (var key in this.map){
                    if(key == 'targeting'){
                        for (var ekey in this.map[key]){
                            if(ekey=='slot'){
                                self.addSlotTargeting(this.map[key][ekey],dfp);
                            }

                            if(ekey=='page'){
                                self.addDfpTargeting(this.map[key][ekey],dfp);
                            }
                        }
                    }else{
                        self.addConfig(this.map[key],dfp);
                    }
                }
            }
        }
    };

    if (window.dfp_tracking !== undefined) {
        window.dfp_tracking.onInit.push(tealiumdfp.init);
    }
})();

/* globals window, document */

(function() {

    var onInit = function(dfp) {
        if( !( typeof dfp.config.evidon !== "undefined" && dfp.config.evidon === false ) ) {
            (function( d) {
                var evidonscript = document.createElement( "script" );
                evidonscript.async = true;
                evidonscript.type = "text/javascript";
                evidonscript.src = d.isSecure() ?
                    "https://a248.e.akamai.net/f/1016/606/2d/tiads-ssl.timeinc.net/ads/evidon.js" :
                    "http://tiads.timeinc.net/ads/evidon.js";
                var evidonnode =document.getElementsByTagName( "script" )[0];
                evidonnode.parentNode.insertBefore(evidonscript, evidonnode);
            })( dfp.dfpUtil);
        }
    };

    if (window.dfp_tracking !== undefined) {
        window.dfp_tracking.onInit.push(onInit);
    }

})();

/* globals window, document, headertag */

(function() {

    var session_complete = false;
    var sleep_count = 0;
    var sleep_tries = 2;
    var propertyFileMap = {
        'rsm' : 'ls-realsimple.js',
        'ckl' : 'ls-cookinglight.js',
        'peo' : 'ls-people.js',
        'col' : 'ls-coastalliving.js',
        'enw' : 'ls-ew.js',
        'fw' : 'ls-foodandwine.js',
        'fort' : 'ls-fortune.js',
        'golf' : 'ls-golf.js',
        'hlt' : 'ls-health.js',
        'ins' : 'ls-instyle.js',
        'mre' : 'ls-myrecipes.js',
        'pesp' : 'ls-peopleenespanol.js',
        'si' : 'ls-si.js',
        'sol' : 'ls-southernliving.js',
        'sun' : 'ls-sunset.js',
        'thedrive' : 'ls-thedrive.js',
        'theoutfit' : 'ls-theoutfit.js',
        'thesnug' : 'ls-thesnug.js',
        'tim' : 'ls-time.js',
        'tl' : 'ls-travelandleisure.js',
        'mhi' : 'ls-myhomeideas.js',
        'ess' : 'ls-essence.js',
        'dep' : 'ls-departures.js',
        'xoj' : 'ls-xojane.js',
        'tfk' : 'ls-timeforkids.js',
        'fansided' : 'ls-fansided.js',
        'extracrispy' : 'ls-extracrispy.js'
    };


    var onInit = function(dfp) {
        if (typeof dfp.config.ix !== "undefined" && dfp.config.ix === false ) {
            return;
        }
        var src, head, a, startTime = Date.now(), loadEnd, sleepRound;
        if( !( typeof dfp.config.indexexchange !== "undefined" && dfp.config.indexexchange === false )) {
            sleepRound = dfp.sleep('Index Exchange');
            if (window.headertag_init_once) {
                return;
            }
            sleep_count++;
            window.headertag_init_once = true;
            try {
                src = ('https:' == document.location.protocol ? 'https://js-sec' : 'http://js') + '.indexww.com/ht/' + propertyFileMap[dfp.config.sitename];
                head = document.head || document.getElementsByTagName('head')[0];
                a = document.createElement('script');
                a.type = 'text/javascript';
                a.onload = function() {
                    dfp.log('Index Exchange loaded in ' + (Date.now() - startTime) + ' milliseconds');
                    headertag.envoke_on_or_after_session_end(function(){
                        dfp.log('Index Exchange Retrieve Demand in ' + (Date.now() - loadEnd) + ' milliseconds');
                        session_complete = true;
                        dfp.wakeup('Index Exchange', sleepRound);
                    });
                    loadEnd = Date.now();
                    headertag.retrieve_demand();
                };
                a.async = true;
                a.src = src;
                head.appendChild(a);
            }
            catch(e) {
                dfp.log('Index Exchange loading error.');
                console.log(e);
            }
        }
    };

    /**
     * Apply Index Exchange Slot Targeting
     *
     * @param dfp - DFP library
     * @param slot - Actual DFP slot
     */
    var applyIndexExchange = function (dfp, slot) {
        var _slot = slot, _dfp = dfp, startTime = Date.now(), sleepRound, slotID = "", i;

        if (typeof dfp.config.ix !== "undefined" && dfp.config.ix === false ) {
            return;
        }
        if (typeof headertag === 'object') {
            if (typeof _slot.getSlotId === 'function') {
                slotID = _slot.getSlotId().o;
            }
            else if(Array.isArray(_slot)) {
                for (i = 0; i < _slot.length; i++) {
                    if (typeof _slot[i].getSlotId === 'function') {
                        slotID += _slot[i].getSlotId().o + ' ';
                    }
                }
            }
            _dfp.log('Index Exchange called for: ' + slotID);
            if (session_complete || sleep_count < sleep_tries) {

                // only put to sleep if we have a previously successful retrieve demand (2 chances)
                // Otherwise it will hold up every render until it does.
                sleepRound = dfp.sleep('Index Exchange');
                sleep_count++;
                if (!session_complete) {
                    _dfp.log('Index Exchange sleep ' + sleep_count + "/" + sleep_tries);
                }
            }
            else {
                _dfp.log('Slot: ' + slotID + ' - Index Exchange Not Sleeping as we have not retrieved successful demand yet and executed ' + sleep_count + "/" + sleep_tries + ' sleeps');
            }
            session_complete = false;
            headertag.retrieve_demand(function(){
                _dfp.log('Index Exchange Retrieve Demand in ' + (Date.now() - startTime) + ' milliseconds');
                _dfp.log('Index Exchange Setting Targeting. - ' + slotID);
                headertag.set_slot_targeting(_slot);
                session_complete = true;
                sleep_count = 0;
                _dfp.wakeup('Index Exchange', sleepRound);
            }, {});
        }
    };

    var onSlotDisplay = function(dfp, slot) {
        if (typeof dfp.config.ix !== "undefined" && dfp.config.ix === false ) {
            return;
        }
        applyIndexExchange(dfp, slot);
    };

    /*
    var onSlotRefresh = function(dfp, slot) {
        applyIndexExchange(dfp, slot);
    };
*/
    var onRefresh = function (dfp) {
        if (typeof dfp.config.ix !== "undefined" && dfp.config.ix === false ) {
            return;
        }
        var slots = dfp.getAdSlot(), dpf_slots = [];
        for (var i = 0; i < slots.length; i++) {
            dpf_slots.push(slots[i].dfpSlot);
        }
        applyIndexExchange(dfp, dpf_slots);
    };

    if (window.dfp_tracking !== undefined) {
        window.dfp_tracking.onInit.push(onInit);
        window.dfp_tracking.onRefresh.push(onRefresh);
        window.dfp_tracking.displaySlot.push(onSlotDisplay);
        //window.dfp_tracking.onSlotRefresh.push(onSlotRefresh);
    }

})();

(function() {

    var onInit = function(dfp) {
        var dfpUtil = dfp.dfpUtil;
        var _dfp = dfp;
        var sleepRound;
        var domain = dfpUtil.getRootDomain();
        var startTime = Date.now();
        var wokenup = false;

        var onLoad = function() {
            var response = requestAlchemy.responseText, i, data = {message: "empty"};
            if (response !== "") {
                data = JSON.parse( response );
            }
            dfp.log('OneBot Response in ' + (Date.now() - startTime) + ' milliseconds');

            if ( typeof data.trending !== "undefined" && data.trending ){
                dfp.config.setTargeting.trend = "yes";
            }

            if(data.message !== 'not found' && data.message !== 'empty'){
                _dfp.log("OneBot Message Results");
                _dfp.log( JSON.stringify(data) );
                var tags; // Reuse defined variables as much as possible

                if( data.socialtags && data.socialtags.length > 0 ) {
                    tags = [];
                    for(i = 0; i < data.socialtags.length; i++ ) {
                        tags.push( data.socialtags[ i ] );
                    }

                    _dfp.config.setTargeting.Social_Tags = tags;
                }

                if ( data.taxons && data.taxons.length > 0 ) {
                    tags = [];
                    for (i = 0; i < data.taxons.length; i++ ) {
                        if ( data.taxons[ i ].score >= 0.5 ) {
                            tags.push( data.taxons[ i ].name.replace( /\s+/g, "" ).replace( /:/g, "" ).replace( /\?/g, "" ) );
                        }
                    }

                    _dfp.config.setTargeting.Taxons = tags;
                }

                if ( data.concepts && data.concepts.length > 0 ) {
                    tags = [];
                    for (i = 0; i < data.concepts.length; i++ ) {
                        if ( data.concepts[ i ].relevance >= 0.5 ) {
                            tags.push( data.concepts[ i ].name.replace( /\s+/g, "" ).replace( /:/g, "" ).replace( /\?/g, "" ) );
                        }
                    }

                    _dfp.config.setTargeting.Concepts = tags;
                }

                if(data.sentiment && data.sentiment.length > 0) {
                    var simpleSentiment;
                    if (data.sentiment[0] >= 0.75) {
                        simpleSentiment = 'Very Positive';
                    } else if (data.sentiment[0] >= 0.5) {
                        simpleSentiment = 'Positive';
                    } else if (data.sentiment[0] >= 0) {
                        simpleSentiment = 'Neutral';
                    } else if (data.sentiment[0] >= -0.5) {
                        simpleSentiment = 'Negative';
                    } else {
                        simpleSentiment = 'Very Negative';
                    }
                    _dfp.config.setTargeting.Sentiment = simpleSentiment;
                }
            }
            else {
                _dfp.log("OneBot Message Results - not found or empty");
                _dfp.log( JSON.stringify(data) );
            }
            // wakeup DFP
            if (!wokenup) {
                _dfp.wakeup("One Bot", sleepRound);
                wokenup = true;
            }
        };

        if(
            !(typeof dfp.config.onebot !== "undefined" &&
            dfp.config.onebot.allow_deny_mode == "allow" &&
            dfp.config.onebot.enabled_root_domains.indexOf(domain) >= 0)
        ) {
            try {
                var requestTrend, requestAlchemy,currentUrl,cleanUrl,OneBotUrl,OneBotTrendUrl;
                currentUrl = document.URL;
                // For the benefit of testing, remove on deploy
                if(currentUrl.indexOf('test-tiads.timeinc.net') > -1){
                    currentUrl = currentUrl.replace('test-tiads.timeinc.net/dev/test/alchemy-contextual/ads/test/','');
                } else if (currentUrl.indexOf('tiads.timeinc.net') > -1){
                    currentUrl = currentUrl.replace('tiads.timeinc.net/ads/test/','');
                }

                if ( currentUrl.indexOf( "?" ) > 0 ) {
                    cleanUrl = currentUrl.substring( 0, currentUrl.indexOf( "?" ) );
                } else {
                    cleanUrl = encodeURIComponent( currentUrl );
                }

                if (dfp.dfpUtil.isTestMode()) {
                    cleanUrl = 'http://www.ew.com/article/2015/07/23/hunger-games-mockingjay-part-2-trailer';
                }

                if ( dfpUtil.isSecure() ) {
                    OneBotUrl = "https://ape-tagit.timeinc.net/?url=" + cleanUrl;
                    OneBotTrendUrl = "https://d1oggnumqrlfic.cloudfront.net/trending.tidy.json?url=" + cleanUrl;
                } else {
                    OneBotUrl = "https://ape-tagit.timeinc.net/?url=" + cleanUrl;
                    OneBotTrendUrl = "http://cdn.api.onebot.timeinc.com/trending.tidy.json?url=" + cleanUrl;
                }

                requestTrend = new XMLHttpRequest();
                if ("withCredentials" in requestTrend) {
                    requestTrend.open( "GET", OneBotTrendUrl, true );
                } else if ( typeof XDomainRequest !== "undefined" ) {
                    requestTrend.open( "GET", OneBotTrendUrl, true );
                } else {
                    requestTrend = null;
                }

                if(!requestTrend){
                    console.error("OneBot Trending XMLHttpRequest Initialization Error");
                    return;
                }

                requestAlchemy = new XMLHttpRequest();
                if ("withCredentials" in requestAlchemy) {
                    requestAlchemy.open( "GET", OneBotUrl, true );
                } else if ( typeof XDomainRequest !== "undefined" ) {
                    requestAlchemy.open( "GET", OneBotUrl, true );
                } else {
                    requestAlchemy = null;
                }

                if(!requestAlchemy){
                    console.error("OneBot Treding+Alchemy XMLHttpRequest Initialization Error");
                    return;
                }


                sleepRound = _dfp.sleep("One Bot");
                _dfp.log('Checking trending+Alchemy via OneBot for - ' + cleanUrl );
                requestAlchemy.onload = onLoad;
                requestAlchemy.onerror = function() {
                    console.error( "OneBot Trending+Alchemy Request Error" );
                };
                requestAlchemy.send();

                _dfp.log('Checking trending via OneBot for - ' + cleanUrl );
                requestTrend.onload = onLoad;
                requestTrend.onerror = function() {
                    console.error( "OneBot Trending Request Error" );
                };
                requestTrend.send();
            }
            catch(e){
                console.error("Onebot catch error");
                console.error( e );
            }
        }
    };

    if (window.dfp_tracking !== undefined) {
        window.dfp_tracking.onInit.push(onInit);
    }

})();

/**
 * Output Debugging info for ad slot - ?debugads=1
 */

(function(window) {

    var debugDfp =  function () {
        var _this = this, startTime = Date.now();

        window.addEventListener('dfp.beforeInit', function(e) {
            if (e.detail.dfp.dfpUtil.isDebugMode()) {
                _this.addDebugStyle();
            }
        });

        window.addEventListener('dfp.slotAfterDisplay', function(e) {
            if (e.detail.dfp.dfpUtil.isDebugMode()) {
                // insert Debug Info
                _this.createDebugInfo(e.detail.arg);
            }
        });

        window.addEventListener('dfp.logMsg', function(e) {
            var seconds = (Date.now() - startTime)/1000;
            if (e.detail.dfp.dfpUtil.isDebugMode()) {
                console.log('dfp.logMsg ' + seconds + ': ' + e.detail.arg);
                if (e.detail.dfp.config !== undefined && e.detail.dfp.config.logtimeline !== undefined && console.timeStamp !== undefined) {
                    console.timeStamp('dfp.logMsg ' + seconds + ': ' + e.detail.arg);
                }
            }
        });
    };

    debugDfp.prototype.addDebugStyle = function () {
        var css = ".ads-debug-info { position: absolute; overflowY: auto; overflowX: auto; width: 300; height: 200; zIndex: 99999; background-color: yellow; text-align: left}",
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    };

    debugDfp.prototype.createDebugInfo = function(slot) {
        var AdId = slot.adUnit.id;
        var Id = AdId + '-debuginfo';
        var el, adDiv, rect, pos, debugHtml;
        if (document.getElementById(Id) === null) {
            adDiv = document.getElementById(AdId);
            rect = adDiv.getBoundingClientRect();
            pos = {
                top: rect.top + document.body.scrollTop,
                left: rect.left + document.body.scrollLeft
            };
            debugHtml = '<textarea id="' + Id + '" style="height: 20px; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 12px; line-height: normal; font-family: courier; border: 1px solid black; z-index: auto; background-color: rgb(255, 255, 189);">' + slot.debugcode.join('\n') + '</textarea>';
            adDiv.insertAdjacentHTML('beforebegin', debugHtml);
            el = document.getElementById(Id);
        } else {
            el = document.getElementById(Id);
        }
        return el;
    };

    return new debugDfp();
})(window);

/**
 * Track tracking for 3rd party tracking for DFP
 */

(function(window) {

    var global_targeting =  function () {
        var _this = this;
        var tile = 0;

        window.addEventListener('dfp.beforeInit', function(e) {
            var dfp = e.detail.dfp, domain, paths, urlParams = dfp.dfpUtil.getUrlTargeting().Query, value, i, rhost;
            // rhost
            rhost = document.referrer.split("/")[2];
            if (rhost !== undefined) {
                dfp.config.setGlobalTargeting.rhost = rhost;
            }

            // domain
            try {
                domain = window.location.hostname;
            } catch (er) {
                domain = document.URL.split("/")[2];
            }
            dfp.config.setGlobalTargeting.domain =  domain;

            // plat

            // Path
            paths = window.location.pathname.split("/");
            if(!paths[paths.length -1]) {
                paths = paths.slice(1, paths.length -1);
            }
            else {
                paths = paths.slice(1, paths.length);
            }
            dfp.config.setGlobalTargeting.path = paths;

            // debugads
            if (dfp.dfpUtil.isDebugMode()) {
                for (i = 0; i < urlParams.length; i++) {
                    if (urlParams[i].indexOf('debugads') >= 0) {
                        value = urlParams[i].split(':')[1];
                        dfp.config.setGlobalTargeting.debugads = (isNaN(value) ? 1 : value);
                    }
                }
            }

            // testads -- this is set by dfp.js

            // CID
            for (i = 0; i < urlParams.length; i++) {
                if (urlParams[i].indexOf('cid') >= 0) {
                    value = urlParams[i].split(':')[1];
                    dfp.config.setGlobalTargeting.cid = (isNaN(value) ? 1 : value);
                }
            }
        });

        window.addEventListener('dfp.slotBeforeDefine', function(e) {
            // set the 'sz' targeting
            var adUnit = e.detail.arg, dfp = e.detail.dfp, size_array;
            tile++;

            try {
                if (adUnit.targeting === undefined) {
                    adUnit.targeting = {};
                }
                if (adUnit.targeting.sz !== undefined) {
                    if (adUnit.targeting.sz.indexOf(",") != -1) {
                        adUnit.targeting.sz = adUnit.targeting.sz.split(',');
                    }
                }
                else {
                    adUnit.targeting.sz = dfp.dfpUtil.sizeToArray(adUnit.size);
                    if (adUnit.oop !== undefined && adUnit.oop) {
                        adUnit.targeting.sz = '1x1';
                    }
                }
                adUnit.targeting.id = adUnit.id;
                adUnit.targeting.tile = tile;
            }
            catch (err) {
                // failed to set sizing
            }
        });
    };

    return new global_targeting();

})(window);






/**
 * Track tracking for 3rd party tracking for DFP
 */

(function(window) {

    var autoOop = false;
    var autoRefresh = false;
    var oopId = null;
    var oop;
    var dfpLib;
    var lastOopFired = 0;
    var minimalOopInterval = 10000;

    var oopObj =  function () {

    };

    oopObj.prototype.defineOopSlot = function (dfp, beforeElementId) {
        var oopAd, divEl, parentEl, adEl = null, bodyEl;
        dfpLib = dfp;
        divEl = document.createElement('div');
        divEl.setAttribute('id', oopId);
        divEl.setAttribute('style', 'display:none;width:0px;height:0px');
        if (beforeElementId !== undefined) {
            adEl = document.getElementById(beforeElementId);
        }
        if (adEl !== null) {
            parentEl = adEl.parentNode;
            parentEl.insertBefore(divEl, adEl);
        }
        else {
            bodyEl = document.body;
            bodyEl.appendChild(divEl);
        }

        oopAd = {
            id: oopId,
            oop: true
        };
        dfpLib.defineSlot(oopAd);
    };

    oopObj.prototype.refreshOop = function () {
        if (autoRefresh && oopId !== null) {
            dfpLib.refresh(oopId);
        }
    };

    oop = new oopObj();


    window.addEventListener('dfp.beforeInit', function(e) {
        var dfp = e.detail.dfp;
        if (dfp.config.oop !== undefined) {
            autoOop = dfp.config.oop;
        }
        if (dfp.config.refreshoop !== undefined) {
            autoRefresh = dfp.config.refreshoop;
        }
        dfp.getOopSlotId = function () {
            return oopId;
        };
        dfp.resetOOPSlot = function (id, beforeId) {
            if (id !== undefined && id !== oopId) {
                oopId = id;
                oop.defineOopSlot(dfpLib, beforeId);
            }
            else {
                oop.refreshOop();

            }
        };
    });

    window.addEventListener('dfp.defineSlot', function(e) {
        var adUnit = e.detail.arg, dfp = e.detail.dfp;
        if (autoOop && oopId === null) {
            oopId = 'oop_' + Date.now();
            oop.defineOopSlot(dfp, adUnit.id);
        }
    });

    window.addEventListener('dfp.refresh', function(e) {
        if (autoOop && autoRefresh && (lastOopFired + minimalOopInterval < Date.now()) ) {
            lastOopFired = Date.now();
            dfpLib.refresh(oopId);
        }
    });


    return oop;

})(window);

/**
 * Time DFP
 */

(function(root, factory) {
    root.time_dfp = factory(root);
}(this,
    function(window) {
        /* globals document, googletag, CustomEvent */

        // Google DFP Utility functions
        var dfp;
        var dfpUtil = {
            getRootDomain: function() {
                var arr = window.location.hostname.split('.');
                if (typeof(arr[1]) == 'undefined') {
                    return (window.location.hostname);
                } else if (arr.length == 1) {
                    return (window.location.hostname);
                } else {
                    return (arr[arr.length - 2] + '.' + arr[arr.length - 1]);
                }
            },
            getSubDomain: function() {
                return document.domain;
            },
            isDebugMode:function(){
                var debug = false;
                if (window.location.search.indexOf( 'debugads' ) >= 0) {
                    debug = true;
                }
                if (dfp !== undefined && dfp.config.debug !== undefined && dfp.config.debug) {
                    debug = true;
                }
                return debug;
            },
            isTestMode: function(config) {
                var testads = false;
                if (window.location.search.indexOf('testads') >= 0) {
                    testads = true;
                }
                if (config !== undefined && config.testads !== undefined) {
                    testads = true;
                }
                return testads;
            },
            isSecure: function() {
                return (document.location.protocol == 'https:');
            },
            getCookie: function(sKey) {
                if (!sKey) {
                    return null;
                }
                return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
            },
            sizeToArray: function (size) {
                var i, sizes = [];
                var sizeArrayToString = function (ar) {
                    return ar[0] + 'x' + ar[1];
                };
                if (Array.isArray(size)) {
                    if (typeof size[0] === 'number') {
                        sizes = sizeArrayToString(size);
                    }
                    else {
                        for (i = 0; i < size.length; i++) {
                            sizes.push(sizeArrayToString(size[i]));
                        }
                    }
                }
                return sizes;
            },

            // extend({}, objA, objB) -- ripped from http://youmightnotneedjquery.com/#extend
            extend: function(out) {
                out = out || {};
                for (var i = 1; i < arguments.length; i++) {
                    if (!arguments[i]) {
                        continue;
                    }
                    for (var key in arguments[i]) {
                        if (arguments[i].hasOwnProperty(key)) {
                            out[key] = arguments[i][key];
                        }
                    }
                }
                return out;
            },

            /**
             * Create an array of paths so that we can target DFP ads to Page URI's
             * @return Array an array of URL parts that can be targeted.
             */
            getUrlTargeting: function(url) {

                // Get the url and parse it to its component parts using regex from RFC2396 Appendix-B (https://tools.ietf.org/html/rfc2396#appendix-B)
                var urlMatches = (url || window.location.toString()).match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
                var matchedAuthority = urlMatches[4] || '';
                var matchedPath = (urlMatches[5] || '').replace(/(.)\/$/, '$1');
                var matchedQuery = urlMatches[7] || '';

                // Get the query params for targeting against
                var params = matchedQuery.replace(/\=/ig, ':').split('&');

                return {
                    Host: matchedAuthority,
                    Path: matchedPath,
                    Query: params
                };

            },
            sanitize:function(value, config){
                if (typeof value == "string") {
                    if (config.convertHyphens){
                        value = value.replace(/-/ig, "_");
                    }
                    if (config.stripNonAlphaNumeric){
                        value = value.replace(/[^\w\/]/ig, "");
                    }
                }
                return value;
            }

        };

        var time_dfp = function() {
            var queue, i;
            this.dfpUtil = dfpUtil;
            this.log('Starting up...');


            this.config =  {
                setTargeting: {}, // Set googletag.pubads().setTargeting()
                setGlobalTargeting: {}, // global targeting that will be applied to each individual ad call
                setLocation: '', // set location for the Ad Calls - https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_setLocation
                setUrlTargeting: false,
                enableSingleRequest: false, // expecting the call to be done in SRA
                SRAInitialBatch: true, // if false there will be not inital batch every slot in the first call will need to be manually display()'ed - if true - all defineSlot()'s called before the first display() will be rendered on the first call to display()
                collapseEmptyDivs: false, // this is different than jquery.dfp. if (false) we call googletag.pubads().collapseEmptyDivs(), if (true) we call googletag.pubads().collapseEmptyDivs(true)  see - https://support.google.com/dfp_premium/answer/3072674
                refreshExisting: true,
                disablePublisherConsole: false,
                disableInitialLoad: false, // Prevent initial load -  https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_disableInitialLoad
                globalVar: 'time_dfp', // A global variable too look for and take over for true Async support
                sleepTime: 500, // Default time to sleep before giving up on external 3rd parties to respond
                oop: true,
                gptAsync: true, // Force GPT to be loaded synchrounously by setting to false. default for TGX compatibilty
                refreshoop: false
            };

            this.state = {
                count: 0,
                rendered: 0,
                dfpId: '8484',
                slots: [],
                sleep: 0, // amount of sleep calls made.. if > 0 then we are in 'sleep' state, gets reset to 0 on wakeup
                queue: [],
                purge_count: 0, // State if queue is being purged. We need to still queue .push() calls
                purging: false, // State if queue is being purged. We need to still queue .push() calls
                wewant: 'n"eNow',
                sleepTimeout: null,
                sleepInterval: null,
                sleepStart: null,
                sleepRound: 0,
                ver: '20160906.1'
            };

            if (window[this.config.globalVar] !== undefined && Array.isArray(window[this.config.globalVar])) {
                queue = window[this.config.globalVar];
                window[this.config.globalVar] = this;
                for (i = 0; i < queue.length; i++) {
                    this.push(queue[i]);
                }
            }
        };
        var p = time_dfp.prototype;

        p.init = function(config) {
            var dfp = this;

            this.log('init()');

            // Start loading GPT as soon as possible
            this.loadGPT();

            // extend internal config with global 'ti_dfp_config'
            dfpUtil.extend(this.config, config !== undefined ? config : {});

            this.setConfig();

            this.fireEvent('beforeInit', this);

            this.updateAdsTargeting(this.config);

            this.getGptCmd().push(function () {
                dfp.log('1st DFP Call');
            });

            if (this.config.disableInitialLoad !== undefined && this.config.disableInitialLoad)  {

                // Set diableInitialLoad.
                this.push(function() {
                    dfp.getGptCmd().push(
                        function () {
                            dfp.log('disableInitialLoad() is set.. need to .refresh() to display ads now.');
                            googletag.pubads().disableInitialLoad();
                        }
                    );
                });
            }

            if (this.config.enableSingleRequest !== undefined && this.config.enableSingleRequest)  {
                // Set single request architecture.
                this.push(function() {
                    dfp.getGptCmd().push(
                        function () {
                            dfp.log('enableSingleRequest is set.. in SRA mode');
                            googletag.pubads().enableSingleRequest();
                        }
                    );
                });
            }

            // Initiate Services
            this.push(function() {
                dfp.getGptCmd().push(function () {
                    dfp.log('enableServices()');
                    googletag.enableServices();
                });
            });

            if (this.config.enableSingleRequest !== undefined && this.config.enableSingleRequest)  {
                this.push(function() {
                    dfp.getGptCmd().push(
                        function () {
                            dfp.log('enableSingleRequest is set all slots defined before 1st .display() will be call and rendered all at once');
                        }
                    );
                });
            }

            if (this.config.collapseEmptyDivs !== undefined)  {
                var collapse = dfp.config.collapseEmptyDivs;
                if (!collapse) {
                    collapse = undefined;
                }
                this.push(function() {
                    dfp.getGptCmd().push(
                        function () {
                            dfp.log('collapseEmptyDivs is set to: ' + dfp.config.collapseEmptyDivs);
                            googletag.pubads().collapseEmptyDivs(collapse);
                        }
                    );
                });
            }

            // Setup Call back for 'slotRenderEnded'
            this.getGptCmd().push(
                function(){
                    var _dfp = dfp;
                    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                        _dfp.eventSlotRendered(event);
                    });
                }
            );
            // Setup Global Targeting
            this.push(function() {
                dfp.getGptCmd().push(
                    function () {
                        dfp.log('googletag.pubads().setTargeting()..');
                        for (var i in dfp.config.setTargeting) {
                            if (dfp.config.setTargeting.hasOwnProperty(i)) {
                                googletag.pubads().setTargeting(i, dfp.config.setTargeting[i]);
                            }
                        }

                    }
                );
            });

            this.push(function() {
                dfp.fireEvent('afterInit', dfp);
            });
            return this;
        };

        p.setConfig = function () {
            var urlParams = dfpUtil.getUrlTargeting().Query, value, key;
            var params = ['amazon', 'ix', 'debugads', 'onebot', 'logtimeline'];
            for (var i = 0; i < urlParams.length; i++) {
                key = urlParams[i].split(':')[0];
                if (params.indexOf(key) > -1) {
                    value = urlParams[i].split(':')[1];
                    if (value === 0 || value === "0" || value === "false") {
                        value = false;
                    }
                    this.config[key] = value;
                }
            }
        };

        p.push = function (func) {
            var _queue;
            if (func === undefined && !this.state.purging) {
                this.log('Running Queued calls... purge: ' + this.state.purge_count);
                // copy and reset queue - prevents double execution if there is a 2nd wakeup during the queue process
                _queue = this.state.queue;
                this.state.queue = [];
                this.state.purging = true;
                // Wakeup
                while (_queue.length) {
                    try {
                        _queue.shift().apply(this, []);
                    }
                    catch(error) {
                        this.log('Error trying to wake up running one of the queued function. Purge:' + this.state.purge_count);
                        console.error(error);
                        break;
                    }
                }
                this.log('Ending Queue purge: ' + this.state.purge_count);
                this.state.purge_count++;
                this.state.purging = false;
                // Were any calls pushed to the new queue during the execution of the old one
                if (this.state.queue.length > 0 && this.state.sleep <= 0) {
                    this.log('Calling calls queued during purge.');
                    this.push();
                }
                return;
            }
            else if(func === undefined && this.state.purging) {
                // Queue will be purged when he current purge is done
                return;
            }

            // Otherwise call passed function
            if (this.state.sleep <= 0 && !this.state.purging) {
                func.apply(this, []);
            }
            else if(this.state.sleep <= 0 && this.state.purging) {
                this.log('push().. purging queue.. queuing function');
                this.state.queue.push(func);
            }
            else {
                this.log('push().. in sleep mode.. queuing function');
                this.state.queue.push(func);
            }
        };

        p.sleep = function (msg, ms) {
            var _this = this, _sleepRound = this.state.sleepRound, _sleepDuration;
            if (msg !== undefined) {
                msg = ' - MSG: ' + msg;
            }
            else {
                msg = "";
            }

            // only allow sleeping set once
            if (this.state.sleep > 0) {
                this.state.sleep++;
                this.log('sleep().. cannot sleep.. already sleeping' + msg + " - SleepRound:" + _sleepRound);
                return this.state.sleepRound;
            }

            this.state.sleep++;
            if (ms === undefined || ms === null) {
                ms = this.config.sleepTime;
            }

            _sleepDuration = ms;

            this.log('sleep() for ' + ms + ' milliseconds' + msg + " - SleepRound:" + _sleepRound);

            this.state.sleepTimeout = setTimeout(function(){
                _this.log('sleep() Timeout Over');
                _this.wakeup('time_dfp - Sleep Timeout', _sleepRound, true); // force wakeup
            },ms);

            this.state.sleepStart = Date.now();
            this.state.sleepInterval = setInterval(function(){
                var now = Date.now();
                _this.log('sleepInterval at: ' + (now - _this.state.sleepStart));
                if (now - _this.state.sleepStart > _sleepDuration) {
                    _this.log('sleep() Interval Over');
                    _this.wakeup('time_dfp - Sleep Timeout', _sleepRound, true); // force wakeup
                }
            }, ms/5);

            return this.state.sleepRound;
        };

        p.wakeup = function(msg, sleepRound, force) {
            if (msg !== undefined) {
                msg = ' - MSG: ' + msg;
            }
            else {
                msg = '';
            }

            if (sleepRound !== undefined && sleepRound !== this.state.sleepRound) {
                inSleepRound = true;
                this.log('wakeup() ' + msg + ' -- Not in sleep round');
                return false;
            }


            this.state.sleep--;
            this.log('wakeup() ' + msg + ' -- Sleeps left: ' + this.state.sleep + ' -- ' + ((force !== undefined && force) ? ' - Forced' : ''));
            if (this.state.sleep <= 0 || (force !== undefined && force !== null && force)) {
                this.state.sleep = 0;
                window.clearTimeout(this.state.sleepTimeout);
                window.clearInterval(this.state.sleepInterval);
                this.state.sleepRound++;
                this.push();
            }
        };

        p.loadGPT = function () {
            var gads, node, msg = 'async';
            if (window.googletag !== undefined && window.googletag.pubads !== undefined) {
                return;
            }
            window.googletag = window.googletag || {};
            window.googletag.cmd = window.googletag.cmd || [];

            gads = document.createElement('script');
            gads.async = true;

            if (this.config.gptAsync !== undefined && !this.config.gptAsync) {
                gads.async = false;
                msg = 'sync';
            }
            this.log('loading GPT in ' + msg);

            gads.type = 'text/javascript';
            gads.src = '//www.googletagservices.com/tag/js/gpt.js';

            node = document.getElementsByTagName('script')[0];
            node.parentNode.insertBefore(gads, node);

        };

        p.eventSlotRendered = function (event) {
            this.fireEvent('slotRenderEnded', event);
        };

        /**
         * Update Ads targeting all Ads
         * @param Object dfpOptions options related to ad instantiation
         * @param jQuery $adCollection collection of ads
         * @return Array an array of ad units that have been created.
         */
        p.updateAdsTargeting = function(config) {
            // Display Test ads
            if (dfpUtil.isTestMode(config)) {
                this.log('updateAdsTargeting() In Test Mode');

                var urlParams = dfpUtil.getUrlTargeting().Query, value;
                if (this.config.testads !== undefined) {
                    this.config.setGlobalTargeting.test = (isNaN(this.config.testads) ? 1 : this.config.testads);
                }
                for (var i = 0; i < urlParams.length; i++) {
                    if (urlParams[i].indexOf('testads') >= 0) {
                        value = urlParams[i].split(':')[1];
                        this.config.setGlobalTargeting.test = (isNaN(value) ? 1 : value);
                    }
                }
            }
        };

        p.getGptCmd = function () {
            window.googletag = window.googletag || {'version': 'timeinc', cmd: []};
            return window.googletag.cmd;
        };

        p.adUnitPath = function (adUnit) {
            var zone = (adUnit !== undefined && adUnit.zone !== undefined) ?
                adUnit.zone :
                    this.config.zone !== undefined ? this.config.zone :
                        '';

            zone = (zone !== '' && zone !== '/') ?
                (zone.charAt(0) === '/' ? '' : '/') +
                    this.dfpUtil.sanitize(zone, {stripNonAlphaNumeric: true}) :
                    '';

            return '/' + this.state.dfpId + '/' +
                ((adUnit !== undefined && adUnit.sitename !== undefined) ? adUnit.sitename : this.config.sitename) +
                zone;
        };

        /**
         * Get the DFP adSlot object, based on the ID
         *
         * @param adId - leave undefined to get all dfp slots
         * @returns {*}
         */
        p.getAdSlot = function (adId, destroy) {
            // Find the ad slot in the array
            var len, i, slot = null, slots = [];
            for (i = 0, len = this.state.slots.length; i < len; i++) {
                if (adId === undefined) {
                 slots.push(this.state.slots[i]);
                }
                else {
                    if (this.state.slots[i].id === adId) {
                        if (destroy !== undefined && destroy ) {
                            slot = this.state.slots.splice(i, 1);
                            slot = slot[0];
                        }
                        else {
                            slot = this.state.slots[i];
                        }
                        break;
                    }
                }
            }
            if (adId === undefined) {
                return slots;
            }
            return slot;
        };

        p.getAdIdBySlot = function (slot) {
            // Find the ad slot in the array
            var len, i, id;
            for (i = 0, len = this.state.slots.length; i < len; i++) {
                if (this.state.slots[i].dfpSlot === slot) {
                    id = this.state.slots[i].id;
                    break;
                }
            }
            return id;
        };

        /**
         * Sets the targeting for the 'slot', value are pulled globally defined targeting and on the 'adUnit'.
         *
         * @param slot
         * @param adUnit
         */
        p.setTargeting = function(slot, adUnit) {
            var i;
            // First set Global Targeting
            for (i in this.config.setGlobalTargeting) {
                if (this.config.setGlobalTargeting.hasOwnProperty(i)) {
                    slot.setTargeting(i, this.config.setGlobalTargeting[i]);
                }
            }

            // AdUnit Specific targeting
            if (adUnit.targeting !== undefined) {
                for (i in adUnit.targeting) {
                    if (adUnit.targeting.hasOwnProperty(i)) {
                        slot.setTargeting(i, adUnit.targeting[i]);
                    }
                }
            }
        };

        /**
         * Define an ad Slot user JSON objects
         *
         * @param adUnit
         */
        p.defineSlot = function(adUnit) {
            var _adUnit = adUnit, dfp = this, exists;
            if (this.getAdSlot(adUnit.id) !== null){
                // We need to remove the existing ad slot or dfp will fail on duplicate IDs
                this.getGptCmd().push(function(){
                    var slot = dfp.getAdSlot(_adUnit.id, true);
                    googletag.destroySlots([slot.dfpSlot]);
                });
            }
            this.fireEvent('defineSlot', _adUnit);
            this.log('defineSlot() called for ' + adUnit.id + ' - queuing up');
            this.push(function() {
                dfp.getGptCmd().push(function(){
                    var slot = {}, debugcode = [], size, sizemapping, i;
                    try {
                        dfp.fireEvent('slotBeforeDefine', _adUnit);
                        slot.id = _adUnit.id;
                        slot.adUnit = _adUnit;
                        // Standard Ad Declaration
                        size = _adUnit.size;
                        if (_adUnit.sizes !== undefined) {
                            // SizeMap construction for responsive ad - https://developers.google.com/doubleclick-gpt/reference#googletagsizemappingbuilder
                            sizemapping = googletag.sizeMapping();
                            for (i = 0; i < _adUnit.sizes.length; i++) {
                                sizemapping.addSize(_adUnit.sizes[i][0], _adUnit.sizes[i][1]);
                            }
                            sizemapping = sizemapping.build();
                        }
                        if (_adUnit.oop !== undefined && _adUnit.oop) {
                            // define OutOfPage Slot - https://developers.google.com/doubleclick-gpt/reference#googletag.defineOutOfPageSlot
                            slot.dfpSlot = googletag.defineOutOfPageSlot(dfp.adUnitPath(_adUnit), _adUnit.id);
                            debugcode.push('googletag.defineOutOfPageSlot(\'' + dfp.adUnitPath(_adUnit) + '\', \'' + _adUnit.id + '\');');
                        }
                        else {
                            // Define standard AdSlot - https://developers.google.com/doubleclick-gpt/reference#googletag.ç
                            slot.dfpSlot = googletag.defineSlot(dfp.adUnitPath(_adUnit), size, _adUnit.id);
                            debugcode.push('googletag.defineSlot(\'' + dfp.adUnitPath(_adUnit) + '\', ' + JSON.stringify(_adUnit.size) + ', \'' + _adUnit.id + '\');');
                        }
                        if (sizemapping !== undefined) {
                            // DefineSizeMapping - https://developers.google.com/doubleclick-gpt/reference#googletag.Slot_defineSizeMapping
                            slot.dfpSlot.defineSizeMapping(sizemapping);
                            debugcode.push('slot.defineSizeMapping(<sizemapping>); sizemapping = ' + JSON.stringify(_adUnit.sizes));
                        }
                        dfp.setTargeting(slot.dfpSlot, _adUnit);
                        debugcode.push(dfp.getSlotTargeting(slot.dfpSlot));


                        if (_adUnit.companion !== undefined && _adUnit.companion) {
                            // Companion Ad service - https://developers.google.com/doubleclick-gpt/reference#googletag.companionAds
                            slot.dfpSlot.addService(googletag.companionAds());
                            debugcode.push('.addService(googletag.companionAds();');

                        }

                        // Standard DFP service - https://developers.google.com/doubleclick-gpt/reference#googletag.Slot_addService
                        slot.dfpSlot.addService(googletag.pubads());
                        debugcode.push('.addService(googletag.pubads();');


                        dfp.state.slots.push(slot);

                        // For SRA .enableServices needs to be called after all the ads have been defined
                        if (dfp.config.enableSingleRequest === undefined || !dfp.config.enableSingleRequest) {
                            googletag.enableServices();
                            debugcode.push('googletag.enableServices();');
                        }

                        if (_adUnit.collapse !== undefined) {
                            if (Array.isArray(_adUnit.collapse)) {
                                slot.dfpSlot.setCollapseEmptyDiv.apply(slot.dfpSlot, _adUnit.collapse);
                            }
                            else {
                                slot.dfpSlot.setCollapseEmptyDiv(_adUnit.collapse);
                            }
                            debugcode.push('.setCollapseEmptyDiv(' + _adUnit.collapse + ')');
                        }
                        else {
                            slot.dfpSlot.setCollapseEmptyDiv();
                            debugcode.push('.setCollapseEmptyDiv();');
                        }
                        dfp.fireEvent('slotAfterDefine', slot);
                        slot.debugcode = debugcode;

                        dfp.log('slot defined for - ' + _adUnit.id);

                        // For SRA display slot is called later
                        // If disableInitialLoad is enabled we call display() anyways. as the call goes out on the refresh() only
                        if ((dfp.config.enableSingleRequest === undefined || !dfp.config.enableSingleRequest) ||
                            (dfp.config.disableInitialLoad !== undefined && dfp.config.disableInitialLoad)){
                            dfp.displaySlot(slot);
                        }
                    }
                    catch (e) {
                        console.error('error: defineSlot - ');
                        console.error(slot);
                        console.error(e);
                    }
                });
            });
        };

        // Set a config value.. e.g. time_dfp.set('enableSingleRequest', false); // disables SRA
        p.set = function (key, value) {
            this.config[key] = value;
        };

        // Display Ad.. used for SRA
        p.display = function (id) {
            var _id = id, dfp = this;
            dfp.log('.display()');

            this.push(function () {
                dfp.getGptCmd().push(function () {
                    var slot, i;
                    dfp.log('.display() via gpt.push()');

                    // display All slot
                    if (_id === undefined) {
                        slot = dfp.getAdSlot();
                        for (i = 0; i < slot.length; i++) {
                            dfp.displaySlot(slot[i]);
                        }
                    }
                    // Display Slot by ID. e.g id = 'slot_id'
                    if (typeof _id == 'string') {
                        slot = dfp.getAdSlot(_id);
                        dfp.displaySlot(slot);

                    }
                    // Display Array of slots by ID ['id1', 'id2', 'id3']
                    else if (Array.isArray(_id)) {
                        for (i = 0; i < _id.length; i++) {
                            slot = dfp.getAdSlot(_id[i]);
                            dfp.displaySlot(slot);
                        }
                    }
                });
            });

        };

        p.displaySlot = function (slot) {
            var dfp = this, _slot = slot;
            this.push(function () {
                dfp.getGptCmd().push(function () {
                    dfp.log('before displaying slot - ' + slot.id);
                    dfp.fireEvent('slotBeforeDisplay', _slot.dfpSlot);
                    dfp.log('displaying slot - ' + slot.id);
                    if (dfp.config.disableInitialLoad !== undefined && dfp.config.disableInitialLoad) {
                        dfp.log('slot - ' + slot.id + ' - may not be rendered and need to be refresh()\'ed as disableInitialLoad is set.');
                    }
                    dfp.push(function () {
                        dfp.getGptCmd().push(function () {
                            dfp.log('gpt .display() - ' + slot.id);
                            googletag.display(slot.id);
                            _slot.debugcode.push('googletag.display(\'' + _slot.id + '\');');
                            dfp.fireEvent('slotAfterDisplay', _slot);
                        });
                    });
                });
            });
        };

        p.getSlotTargeting = function (slot) {
            var targeting = {}, i;
            var keys = slot.getTargetingKeys(slot);
            var globalTargeting = {};
            var output = '';
            for (i = 0; i < keys.length; i++) {
                targeting[keys[i]] = slot.getTargeting(keys[i]);
            }
            for (i in this.config.setTargeting) {
                if (this.config.setTargeting.hasOwnProperty(i)) {
                    globalTargeting[i] = this.config.setTargeting[i];
                }
            }
            output += "\nTargeting ---- \nGLOBAL: " + JSON.stringify(globalTargeting);
            output += "\nSLOT: " + JSON.stringify(targeting) + "\n ------ \n";

            return output;
        };

        /**
         * Refresh all or specific ad slots. Correlator updates unless specifies as 'false'.
         *
         * @param slots
         * @param updateCorrelator
         */
        p.refresh = function(slots, changeCorrelator) {

            var slot, refreshSlots = [], refreshOptions = {}, i, len, dfp = this;
            var _refresh = function () {
                dfp.fireEvent('refresh', slots);


                if (changeCorrelator === undefined) {
                    changeCorrelator = true;
                }
                refreshOptions.changeCorrelator = changeCorrelator;

                if (slots === undefined) {
                    slots = null;
                    refreshSlots = slots;
                }

                dfp.log('refresh() slots: ' + slots);


                try {
                    // if 'slots' is just a string, it's a single slot ID
                    if (typeof slots === 'string') {
                        slot = dfp.getAdSlot(slots);
                        refreshSlots.push(slot.dfpSlot);
                    }

                    // If slots is an array of strings
                    if (Array.isArray(slots)) {
                        for (i = 0, len = slots.length; i < len; i++) {
                            if (typeof slots[i] === 'string') {
                                slot = dfp.getAdSlot(slots[i]);
                                refreshSlots.push(slot.dfpSlot);
                            }
                        }
                    }
                }
                catch(e) {
                    dfp.log('Error refreshing slots');
                    console.log(e);
                }

                _refreshSlots = refreshSlots;

                dfp.push(function(){
                    dfp.push(function(){
                        dfp.getGptCmd().push(function(){
                            dfp.fireEvent('slotRefresh', refreshSlots);
                            dfp.log('dfp refreshing slots');
                            googletag.pubads().refresh(refreshSlots, refreshOptions);
                        });
                    });
                });
            };

            this.push(
                function() {
                    dfp.getGptCmd().push(function() {
                        _refresh();
                    });
                }
            );
        };

        /**
         * Manually update the DFP correlator value.
         */
        p.updateCorrelator = function () {
            var dfp = this;
            this.log('updateCorrelator()');

            // TODO: need to see if we should run this through dfp.push() in case of sleep or not?
            // Update DFP correlator - https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_updateCorrelator
            this.getGptCmd().push(function(){
                dfp.fireEvent('updateCorrelator');
                googletag.pubads().updateCorrelator();
            });
        };

        p.log = function(msg) {
            this.fireEvent('logMsg', msg);
        };

        /**
         * To fire off custom events.
         *
         * @param type
         * @param arg1
         */
        p.fireEvent = function(type, arg1) {
            var adUnit, slot, slots, dfp, customEvent;

            if (type === 'beforeInit') {
                dfp = arg1;
            }

            if (type === 'afterInit') {
                dfp = arg1;
            }

            if (type === 'updateCorrelator') {

            }

            if (type === 'defineSlot') {
                adUnit = arg1;
            }

            if (type === 'slotBeforeDefine') {
                adUnit = arg1;
            }

            if (type === 'slotAfterDefine') {
                slot = arg1;
            }

            if (type === 'refresh') {
                slots = arg1;
            }

            if (type === 'slotRefresh') {
                slots = arg1;
            }

            if (type === 'slotRenderEnded') {

            }

            if (type === 'logMsg') {

            }

            if (typeof window.CustomEvent === 'function') {
                customEvent = new CustomEvent('dfp.' + type, {detail: {arg: arg1, dfp: this}});
            } else {
                customEvent = document.createEvent('CustomEvent');
                customEvent.initCustomEvent('dfp.' + type, true, true, {arg: arg1, dfp: this});
            }
            window.dispatchEvent(customEvent);
        };

        dfp = new time_dfp();
        return dfp;
    })
);
