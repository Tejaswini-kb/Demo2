/* mobile.js */

//version 1.0.4

//create a global namespace for the cookie functions
(function(_window,  $){

  _window.MR_TOOLS = _window.MR_TOOLS || {};

  _window.MR_TOOLS.getCookie = function(name) {
    var ca = document.cookie.split(';');
    for (var i=0; ca[i]; i++) {
        ca[i] = $.trim(ca[i]);
        if (ca[i].indexOf(name + "=") == 0) {
            return ca[i].substring(name.length + 1);
        }
    }
    return null;
  };

  _window.MR_TOOLS.setCookie = function(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/; domain=myrecipes.com";
    return (getCookie(name) == value);
  };

  _window.MR_TOOLS.deleteCookie = function(name){
    if (getCookie(name)) {
        document.cookie = name + "=; path=/; domain=myrecipes.com";
    }
  };
})(window, jQuery);

if (window.jQuery.ui) {
    /*
     * jQuery UI Touch Punch 0.2.2
     *
     * Copyright 2011, Dave Furfero
     * Dual licensed under the MIT or GPL Version 2 licenses.
     *
     * Depends:
     *  jquery.ui.widget.js
     *  jquery.ui.mouse.js
     */
    (function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return;}var c=b.ui.mouse.prototype,e=c._mouseInit,a;function d(g,h){if(g.originalEvent.touches.length>1){return;}g.preventDefault();var i=g.originalEvent.changedTouches[0],f=document.createEvent("MouseEvents");f.initMouseEvent(h,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,0,null);g.target.dispatchEvent(f);}c._touchStart=function(g){var f=this;if(a||!f._mouseCapture(g.originalEvent.changedTouches[0])){return;}a=true;f._touchMoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown");};c._touchMove=function(f){if(!a){return;}this._touchMoved=true;d(f,"mousemove");};c._touchEnd=function(f){if(!a){return;}d(f,"mouseup");d(f,"mouseout");if(!this._touchMoved){d(f,"click");}a=false;};c._mouseInit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchStart")).bind("touchmove",b.proxy(f,"_touchMove")).bind("touchend",b.proxy(f,"_touchEnd"));e.call(f);};})(jQuery);
}

var getCookie = function(name) {
    var ca = document.cookie.split(';');
    for (var i=0; ca[i]; i++) {
        ca[i] = jQuery.trim(ca[i]);
        if (ca[i].indexOf(name + "=") == 0) {
            return ca[i].substring(name.length + 1);
        }
    }
    return null;
};
var setCookie = function(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/; domain=myrecipes.com";
    return (getCookie(name) == value);
};
var deleteCookie = function(name){
    if (getCookie(name)) {
        document.cookie = name + "=; path=/; domain=myrecipes.com";
    }
};

var getMeta = function(name){
    var $meta = jQuery('meta[name="' + name + '"]');
    if ($meta.length) {
        return $meta.attr("content");
    }
    return null;
};

function getQueryParam(name){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    return (results ? results[1] : null);
}

//compare two URLs by removing index.html and trailing slash from both
var compareUrls = function(url1, url2) {
    url1 = url1.replace(/index.html$/, "").replace(/\/$/, "");
    url2 = url2.replace(/index.html$/, "").replace(/\/$/, "");
    return (url1 === url2);
};

var swipeSlider = function($this) {
    var ulMarginLeft = 0, starttime, lastDistance, slideWidth;
    var afterAniFunc = function(t) {
        ulMarginLeft = $this.find("ul").css("marginLeft");
        ulMarginLeft = Number(ulMarginLeft.substring(0, ulMarginLeft.length - 2));
        /* this omni call is specific to recipe page; if we use this swipe plugin elsewhere we'll have to refactor it to send a customized afterAniFunc to each instance */
        omniCommunityTracker('preparation ' + t);
    };
    var moveSlides = function(procent) {
        $this.find("ul").css("marginLeft",(ulMarginLeft + procent*slideWidth) + "px");
    };
    $this.setOption("afterAniFunc", afterAniFunc);
    /* swipe for prep*/
    $this.swipe(
        {
            threshold:30,
            allowPageScroll:"vertical",
            click: function(event, target) {
            },
            swipe: function(event, direction, distance, duration) {
                if (event.type == "touchmove" && (direction == "left" || direction == "right")) {
                    slideWidth = $(event.currentTarget).find("li").eq(0).width();
                    lastDistance = Number(distance);
                    moveSlides(lastDistance/slideWidth * (direction == "left" ? -1 : 1));
                }
                else if (event.type == "touchstart") {
                    starttime = new Date();
                }
                else if (event.type == "touchend" || event.type == "touchcancel") {
                    var duration = ((new Date() - starttime)/lastDistance) * (slideWidth - lastDistance);
                    duration = duration > 1000 ? 1000 : duration;
                    $this.goToSlide((direction == "left") ? 'next' : 'prev', duration);
                }
            }
        }
    );
};

var hideAddressBar = function() {
    if (!window.location.hash && !window.pageYOffset) {
        if (document.height < window.outerHeight) {
            document.body.style.height = (window.outerHeight + 50) + 'px';
        }
        setTimeout(function(){window.scrollTo(0, 1);}, 50);
    }
};

var initBottomNavBar = function() {
    /* unhides the bottom tabs after the DOM has fully loaded, to ensure it's sitting on the bottom of viewport */
  jQuery("#menu2").addClass("enabled");

    /*hide bottom nav bar when virtual keyboard might be visible, due to iOS bug*/
  jQuery("input").on("focus", function() {
      jQuery("#menu2").removeClass("enabled");
    });
  jQuery("input").on("blur", function() {
      jQuery("#menu2").addClass("enabled");
    });
};

var validateSearch = function() {
  jQuery("#searchbox").closest("form").submit(function(){
        jQuery("#searchbox").val(jQuery.trim(jQuery("#searchbox").val()));
        return (jQuery("#searchbox").val() != "");
    });
};

(function($) {
$(document).ready(function(){
    initBottomNavBar();

    //add link to full site
    /*homepage slider*/
    if(getMeta('ctype') === 'lu-homepage') {
        var config = {
                loop: true,
                data_array: slides,
                template: 'hero-slide-template',
                callback: function(swipeview) {
                    var idx = swipeview.pageIndex;
                    $('#controls li').removeClass('current').eq(idx).addClass('current');
                }
            },
            set_dots = function() {
                var wrapper = $("#controls .controls"),
                    SV = $('#swipeview-slider').parent().data('swipe-view');

                if (wrapper.length) {
                    for (var i = 0; i < slides.length; i += 1 ){
                        wrapper.append('<li rel=' + i + '><a href=""><span>' + i + '</span></a></li>');
                    }
                    wrapper.find('li:eq(0)').addClass('current');
                    wrapper.on('click', 'a', function(e) {
                        var idx = $(this).parent().attr('rel');
                        e.preventDefault();
                        SV.goToPage(+idx);
                    })
                }
            }

        $('#hero-slider').swipe_view_init(config);
        set_dots();
    }


    var page_href = window.location.href;
    var page_hostname = window.location.hostname;
    var page_pathname = window.location.pathname;
    if (page_pathname !== '/m/features/' && page_hostname !== 'youvegottotastethis.myrecipes.com' && page_hostname !== 'dev-wpcom.timeinc.net' && getMeta('ctype') !== '404-page') {
        var full_site_page_href = page_href;

        if (full_site_page_pathname_match_array = page_pathname.match(/(\/m\/recipe\/.*\/)images\/.*/)) {
            full_site_page_href = 'http://' + page_hostname + full_site_page_pathname_match_array[1];
        }
        if(full_site_page_href.indexOf("\?") > -1) {
            $("p.copyright").before('<p class="fullSite"><a href="' + full_site_page_href.replace("/m/", "/") + '&nomobile=1' + '">Go to Full Site</a></p>');
        } else {
            $("p.copyright").before('<p class="fullSite"><a href="' + full_site_page_href.replace("/m/", "/") + '?nomobile=1' + '">Go to Full Site</a></p>');
        }
    }


    $("p.fullSite").find("a").bind("click", function(){
        omniCommunityTracker('ft-full-site');
        return setCookie("noMobile", "1");
    });

    //adMorsels info icon
    if ($().colorbox) {
        $("img.adMorsels").colorbox({opacity:0.4, width:"300px", html:'MyRecipes <i>AdMorsels</i> allows marketers to connect directly with the MyRecipes audience by enabling them to create content - and participate in the conversation - on <a href="http://' + window.location.hostname + '/m/">MyRecipes.com</a>. Each <i>AdMorsels</i> is written and edited by the marketer. For more on <i>AdMorsels</i>, email us directly at <a href="mailto:Lifestyle_DigitalSales@timeinc.com">Lifestyle_DigitalSales@timeinc.com</a>.'})
    }

    //collapsible elements
    $(".horizTouts, .recipeBox, #mostPop").children("h3").click(function(){
        $(this).parent().toggleClass("collapsed");
        return false;
    });

    //drop down navigation
    $("#menu").append('<div class="subOverlay"></div>').find(".subMenu").append('<div class="callout"></div>');
    $("#menu .menu > a, #menu .subOverlay").click(function(){
        $("#menu").find(".subMenu, .subOverlay").toggle();
        return false;
    });
    $("#menu").append('<div class="subOverlay2"></div>').find(".subMenu-signIn").append('<div class="callout"></div>');
    $("#menu .signIn > a, #menu .subOverlay2").click(function(){
        $("#menu").find(".subMenu-signIn, .subOverlay2").toggle();
        return false;
    });

    //highlight bottom tab if needed
    var page_url = window.location.protocol + "//" + page_hostname + page_pathname;
    $("#menu2").find("a").each(function(){
        if (compareUrls(page_url, $(this).attr("href"))) {
            $(this).addClass("current");
        }
    });

    /*home page - set up sudoSlider for hero
     if ($().sudoSlider && $("#hero").length) {
     var $slider_home = $("#hero").wrapInner('<div class="slider"></div>').find(".slider").sudoSlider({prevNext:false, numeric:true, continuous:true});
     swipeSlider($slider_home);
     }*/

    //search page - dropdown for filtering search results
    $(".viewBy").find("select").change(function(){
        $(this).closest("form").submit();
    }).siblings("input:submit").hide();

    //video child page - dropdown for filtering video results
    $(".videoFilter").find("select").change(function(){
        $(this).closest("form").submit();
    }).siblings("input:submit").hide();

    //channel page - dropdown for channel nav
    var $channelFilter = $(".channelFilter");
    if ($channelFilter.length) {
        $channelFilter.append('<form><fieldset><label for="channelCategory">Category:</label><select id="channelCategory"><option>Select...</option></select></fieldset></form>');
        $channelFilter.find("a").each(function(){
            $channelFilter.find("select").append('<option value="' + $(this).attr("href") + '">' + $(this).text() + '</option>');
            $(this).remove();
        });
        $channelFilter.find("select").change(function(){
            window.location.href = $(this).find("option:selected").attr("value");
        });
    }

    //recipe page
    var recipeNameMeta = getMeta('ka_recipeName');
    $("#recipeTab-details").click(function(){
        $(this).addClass("current").siblings().removeClass("current");
        $("#recipeTabContent").removeClass().addClass("recipeTabContent-details");
        omniCommunityTracker(recipeNameMeta +'-details');
        return false;
    }).click();
    $("#recipeTab-ingredients").click(function(){
        $(this).addClass("current").siblings().removeClass("current");
        $("#recipeTabContent").removeClass().addClass("recipeTabContent-ingredients");
        omniCommunityTracker(recipeNameMeta +'-ingredients');
        return false;
    });
    $("#recipeTab-preparation").click(function(){
        $(this).addClass("current").siblings().removeClass("current");
        $("#recipeTabContent").removeClass().addClass("recipeTabContent-preparation");
        if ($("#prepSlider .slider").length == 0) {
            $("#prepSlider").append('<ul></ul>').find("ul").append($(".recipeBox.preparation ol li").clone());
            var $slider_recipe = $("#prepSlider").wrapInner('<div class="slider"></div>').find(".slider").sudoSlider({numeric:true});
            swipeSlider($slider_recipe);
        }
        return false;
    });

    //MRF page - dropdown for saved recipes
    var $recipeFolders = $(".recipeFolders");
    if ($recipeFolders.length) {
        $recipeFolders.append('<form><fieldset><label for="folders">Folders:</label> <select id="folders"></select></fieldset></form>');
        $recipeFolders.find("a").each(function(){
            var checked = window.location.href === $(this).attr("href");
            $recipeFolders.find("select").append('<option value="' + $(this).attr("href") + '"' + (checked?'checked="checked"':'') + '>' + $(this).text() + '</option>');
            $(this).remove();
        });
        $recipeFolders.find("select").change(function(){
            window.location.href = $(this).find("option:selected").attr("value");
        });
    }

    validateSearch();
    hideAddressBar();
});

function mrGetEnv() {
    var hostName = document.location.hostname;
    var mrEnv = '';
    if (hostName === 'www.myrecipes.com' || hostName === 'editor.myrecipes.com') {
        mrEnv = 'prod'
    } else if (hostName === 'qa.myrecipes.com' || hostName === 'qa-editor.myrecipes.com') {
        mrEnv = 'qa'
    } else if (hostName === 'www.myrecipes.local' || hostName === 'dev.myrecipes.com' ||
               hostName === 'editor.myrecipes.local' || hostName === 'dev-editor.myrecipes.com') {
        mrEnv = 'dev'
    }

    return mrEnv;
}

var this_c_type = getMeta("ctype") || "";

//fid ad targeting (relational ad targeting)
var mrfids = getMeta('fids') || "";
if (mrfids != "" && typeof(adFactory) != "undefined") {
    mrSetAdParam("fid", mrfids);
}

//raid ad targeting (persistent ad targeting)

var cookiePersistentAdKeyValuePairs = "";

if (document.referrer && document.referrer.indexOf("myrecipes.com/") > -1) {

    var c = getCookie("raid");

    if (c) {
        var ka_path_name = document.location.pathname;
        var ka_path_name_array = ka_path_name.split('/');
        var ka_action = ka_path_name_array[1] + '/' + ka_path_name_array[2];
        var doApplyPersistentAdKeyValuePairs = 0;
        if (ka_action == 'm/recipe') {
            var ka_seo_array = ka_path_name_array[3].split('-');
            var ka_id = ka_seo_array[ka_seo_array.length - 1];
            if (ka_id != null && ka_id != "" && c.indexOf("r=" + ka_id + "|") > -1) {
                doApplyPersistentAdKeyValuePairs = 1;
                if (typeof(mrPersistentAdKeyValuePairs) == "undefined" && typeof(mrPersistentAdKeyValuePairsURLs) == "undefined") {
                    //Forces inheritance of persistent ad key-value pairs off any sub-directory under a recipe URL
                    mrPersistentAdKeyValuePairs = c.split("|")[0];
                    mrPersistentAdKeyValuePairsURLs = "r=" + ka_id + "|";
                }
            }
        } else if (ka_action == 'm/menu') {
            var ka_seo_array = ka_path_name_array[3].split('-');
            var ka_id = ka_seo_array[ka_seo_array.length - 1];
            if (ka_id != null && ka_id != "" && c.indexOf("m=" + ka_id + "|") > -1) {
                doApplyPersistentAdKeyValuePairs = 1;
                if (typeof(mrPersistentAdKeyValuePairs) == "undefined" && typeof(mrPersistentAdKeyValuePairsURLs) == "undefined") {
                    //Forces inheritance of persistent ad key-value pairs off any sub-directory under a menu URL
                    mrPersistentAdKeyValuePairs = c.split("|")[0];
                    mrPersistentAdKeyValuePairsURLs = "m=" + ka_id + "|";
                }
            }
        }
        if (doApplyPersistentAdKeyValuePairs == 1 || c.indexOf("|" + document.location.pathname + "|") > -1 || c.indexOf("|" + document.location + "|") > -1) {
            cookiePersistentAdKeyValuePairs = c.split("|")[0];
            if (mrfids != "" && this_c_type === "gallery" && cookiePersistentAdKeyValuePairs.match(/\+fid=/) == null) {
                cookiePersistentAdKeyValuePairs += '+fid=' + mrfids;
            }
            //Can remove the following if statement once the entire site, Endeca and Templates, is using mrCreateAd function.
            //KA will already be using it once KA Phase 2 rolls out.
            if (typeof(adFactory) != "undefined") {
                mrParseAndSetAdParams(cookiePersistentAdKeyValuePairs.replace(/\+/g,';'));
            }
        }
    }

}

deleteCookie("raid");
if (typeof(mrPersistentAdKeyValuePairs) != "undefined" && typeof(mrPersistentAdKeyValuePairsURLs) != "undefined") {
    if (cookiePersistentAdKeyValuePairs == "") {
        cookiePersistentAdKeyValuePairs = mrPersistentAdKeyValuePairs;
        if (mrfids != "" && this_c_type === "gallery" && cookiePersistentAdKeyValuePairs.match(/\+fid=/) == null) {
            cookiePersistentAdKeyValuePairs += '+fid=' + mrfids;
        }
        //Can remove the following if statement once the entire site, Endeca and Templates, is using mrCreateAd function.
        //KA will already be using it once KA Phase 2 rolls out.
        if (typeof(adFactory) != "undefined") {
            mrParseAndSetAdParams(cookiePersistentAdKeyValuePairs.replace(/\+/g,';'));
        }
    }
    var cookiePersistentAdKeyValuePairsURLs = mrPersistentAdKeyValuePairsURLs.replace(/&amp;/g, "&");
    var mrEnv = mrGetEnv();
    if (mrEnv == "prod") {
        cookiePersistentAdKeyValuePairsURLs = cookiePersistentAdKeyValuePairsURLs.replace(/http(?:s)?:\/\/(?:www|editor)\.myrecipes\.com\//g, "/");
    } else if (mrEnv == "qa") {
        cookiePersistentAdKeyValuePairsURLs = cookiePersistentAdKeyValuePairsURLs.replace(/http(?:s)?:\/\/qa(?:\-editor)?\.myrecipes\.com\//g, "/");
        cookiePersistentAdKeyValuePairsURLs = cookiePersistentAdKeyValuePairsURLs.replace(/http(?:s)?:\/\/www\.myrecipes\.com\//g, "/");
    } else if (mrEnv == "dev") {
        cookiePersistentAdKeyValuePairsURLs = cookiePersistentAdKeyValuePairsURLs.replace(/http(?:s)?:\/\/dev(?:\-editor)?\.myrecipes\.com\//g, "/");
        cookiePersistentAdKeyValuePairsURLs = cookiePersistentAdKeyValuePairsURLs.replace(/http(?:s)?:\/\/(?:www|editor)\.myrecipes\.local\//g, "/");
    }
    var cookiePersistentAdKeyValuePairsURLs2 = '';
    var cookiePersistentAdKeyValuePairsURLsArray = cookiePersistentAdKeyValuePairsURLs.split('|');
    for (var ka_path_name = 0; ka_path_name < cookiePersistentAdKeyValuePairsURLsArray.length; ka_path_name++) {
        var ka_path_name_array = cookiePersistentAdKeyValuePairsURLsArray[ka_path_name].split('/');
        var ka_action = ka_path_name_array[1] + '/' + ka_path_name_array[2];
        if (ka_action == 'm/recipe') {
            var ka_seo_array = ka_path_name_array[3].split('-');
            var ka_id = ka_seo_array[ka_seo_array.length - 1];
            cookiePersistentAdKeyValuePairsURLs2 = cookiePersistentAdKeyValuePairsURLs2 + 'r=' + ka_id + '|';
        } else if (ka_action == 'm/menu') {
            var ka_seo_array = ka_path_name_array[3].split('-');
            var ka_id = ka_seo_array[ka_seo_array.length - 1];
            cookiePersistentAdKeyValuePairsURLs2 = cookiePersistentAdKeyValuePairsURLs2 + 'm=' + ka_id + '|';
        } else if (cookiePersistentAdKeyValuePairsURLsArray[ka_path_name] != '') {
            cookiePersistentAdKeyValuePairsURLs2 = cookiePersistentAdKeyValuePairsURLs2 + cookiePersistentAdKeyValuePairsURLsArray[ka_path_name] + '|';
        }
    }
    setCookie("raid", cookiePersistentAdKeyValuePairs + "|" + cookiePersistentAdKeyValuePairsURLs2);
}

function isSearchCampaign(){
    return (location.search.indexOf("xid=google") != -1 || location.search.indexOf("xid=yahoo")  != -1 || location.search.indexOf("xid=bing")  != -1 || location.search.indexOf("xid=partner")  != -1);
}

//Turn off pop-up ads when coming to myrecipes from paid search campaigns
//this is used if global.js is after the ads code on the page.
//Can remove the following if statement once the entire site, Endeca and Templates, is using mrCreateAd function.
//KA will already be using it once KA Phase 2 rolls out.
if (typeof adConfig!="undefined" && isSearchCampaign()) {
    adConfig.setPopups(false);
}

function mrCreateAd(zone) {
    adConfig = new TiiAdConfig("3475.mre_mob");
    adConfig.setCmSitename("cm.mre");
    adConfig.setRevSciTracking(true);
    //Turn off pop-up ads when coming to myrecipes from paid search campaigns
    //this is used if global.js is after the ads code on the page.
    if (isSearchCampaign()) {
        adConfig.setPopups(false);
    }
    adFactory = new TiiAdFactory(adConfig, zone);
    if (typeof(adFactory) != "undefined") {
        if (cookiePersistentAdKeyValuePairs != "") {
            mrParseAndSetAdParams(cookiePersistentAdKeyValuePairs.replace(/\+/g,';'));
        }
        if (mrfids != "") {
            mrSetAdParam("fid", mrfids);
        }
    }
}

function mrFormatAdTagValue(ad_tag_value) {
    ad_tag_value = ad_tag_value.replace(/1 List, 5 Meals/g,'1 List 5 Meals');
    ad_tag_value = ad_tag_value.replace(/Fake It, Don\'t Make It/g,'Fake It Don\'t Make It');
    ad_tag_value = ad_tag_value.replace(/Beverages, Alcoholic/g,'Beverages Alcoholic');
    ad_tag_value = ad_tag_value.replace(/Beverages, Nonalcoholic/g,'Beverages Nonalcoholic');
    ad_tag_value = ad_tag_value.replace(/'|\u00A9|\u24B8|\u24D2|\u00AE|\u24C7|\u2122|&|\/|-|!|;|~|:|\?|@|{|}|\^|\$|%|\+|\||\\/g,'');
    ad_tag_value = ad_tag_value.replace(/\t/g," ").replace(/ {2,}/g, " ");
    ad_tag_value = ad_tag_value.replace(/Smuckers Jam, Jelly, Preserves/g,'Smuckers Jam Jelly Preserves');
    return ad_tag_value.toLowerCase();
}

function mrSetAdParam(key, value) {
    value = value.toString();
    var ret_val = mrFormatAdTagValue(value);
    var splitValues = ret_val.split(',');
    adFactory.setParam(key, splitValues);
    if (typeof(__sn_qs) != "undefined") {
        __sn_qs += "|" + key + ":" + value;
    } else {
        __sn_qs = '';
    }
    return ret_val;
}

function mrParseAndSetAdParams(adtags) {
    var adTagArray = adtags.split(';');
    for (var i=0; adTagArray[i]; i++) {
        var pos = adTagArray[i].indexOf("=");
        if (pos > 0)  {
            var key = adTagArray[i].substr(0, pos).replace(/^\s+/g, "").replace(/\s+$/g, "");
            var value = adTagArray[i].substring(pos + 1).replace(/^\s+/g, "").replace(/\s+$/g, "");
            if (key.length > 0 && value.length > 0) {
                mrSetAdParam(key, value);
            }
        }

    }
}

function mrSetGSAdParam(key, value) {
    value = value.toLowerCase();
    value = value.replace(/[^a-z0-9]/gi,'');
    if (value != "") {
        adFactory.setParam(key, value);
    }
}

// This is needed for iFrameAjax to work.  RequireJS is setting the 'wrong' document domain which is restricting
// the iframe overlay to load from www.myrecipes.com
if (window.location.host.match(/(^|\.)myrecipes\.com(:|$)/)) {
    document.domain = "myrecipes.com";
}

//new recipe page design
//to roll-back, simply delete the folling self-executing function:


(function(){
    var win = window,
        $ = win.jQuery,
        logg = function(msg) {if(msg && window.console && window.console.log){console.log(msg)}; },
        console = win.console,
        dirr = (console ? console : function(){}),
        utils = {};

    //utils containers
    //constants
    utils.constants = {};
    //dom
    utils.dom = {};
    //html
    utils.html = {};
    //state
    utils.state = {};
    utils.state.loggedInUser =  false;
    utils.state.pollForSPX_Interval = null;
    //utils.omniture
    utils.omniture = {};
    //extend utils.constants
    utils.constants.WEB_BASE = window.location.protocol + '//' + window.location.hostname;
    utils.constants.SET_TIMEOUT_DELAY = 50;
    utils.constants.$CONTENT_MAIN = null;
    utils.constants.$OLD_CONTENT = null;

    utils.init = function(){
        logg('utils.init ->');
        if (!utils.isRecipePage()){logg('>> EXITING APP');return;}
        $(document.getElementsByTagName('head')[0]).append('<style>' + utils.getCustomCss() + '</style>');

        //initialize the app
        $(document).ready(function(){
            utils.setupMr3163();
        });
    };
    utils.setupMr3163 = function(){
        logg('utils.setupMr3163 ->');

        window.mr3163 = utils;

        //inject the CSS
        //this element is tricky to get ahold of
        utils.getMoreFromElement();
        //setup DOM constants
        utils.setupDomConstants();
        //remove un needed DOM elements
        utils.removeUnNeededDomElements();
        //utils.prepareDom();
        utils.setupLogger();
        utils.startApp();
    };
    utils.startApp = function(){
        logg('utils.startApp ->');

        //run DOM setup tasks
        utils.prepareDom();
        //inject the widget
        utils.injectHtml();
    };
    utils.removeUnNeededDomElements = function(){
        logg('utils.removeUnNeededDomElements ->');

        //utils.constants.$OLD_CONTENT.hide();

        var recipeBoxH3Css = {'background':'none','border':'none','margin':'0 0 10px 10px','padding':'0'}
        $content = $('#content'),
            $article = $content.find('article'),
            $recipeContent = $article.find('#recipeTabContent'),
            $recipeBoxH3 = $recipeContent.find('.recipeBox > h3'),
            $relatedRecipes = $recipeContent.find('.recipeBox.related'),
            $moreFrom_mr3163 = $('.recipeBox.moreFrom_mr3163');

        $article.find('.recipeHd').hide();
        $article.find('#recipeTabs').hide();
        $recipeContent.find('.recipeDetails').hide();
        $recipeContent.find('.recipeBox.ingredients > h3').hide();
        $recipeContent.find('.recipeBox.ingredients .addToSL').hide();

        $('.recipeBox.collapsed').removeClass('collapsed');
        $('.recipeBox.moreFrom_mr3163 ul.linkList').css({'list-style-type':'none','margin':'0'});


        utils.delay(function(){
            //move more-from above related recipes
            $(".recipeBox.related").insertAfter(".recipeBox.moreFrom_mr3163");

            //change Reviews to Review if no reviews yet
            if ($('#ratings_mr3163 i').length){
                $('#writeReview_mr3163').html('Review')
            }
        },1000);

        $recipeBoxH3.css(recipeBoxH3Css);
        $recipeBoxH3.unbind();
    };
    utils.updateCss = function(){
        logg('utils.updateCss ->');

        var sharedCss = {'background' : 'url(data:image/png;base64,' + utils.constants.CSS_SPRITE_DATA_URI + ')'},
            $seeAllImagesIcon = $('#seeAllImagesIcon'),
            $playVideoIcon = $('#playVideoIcon'),
            $socialButtons_mr3163 = $('#socialButtons_mr3163'),
            $pinterestButton = $socialButtons_mr3163.find('.pinterest'),
            $facebookButton = $socialButtons_mr3163.find('.facebook'),
            $emailButton = $socialButtons_mr3163.find('.email');

        $seeAllImagesIcon.css(sharedCss).css({'background-position' : '0 -145px'});
        $playVideoIcon.css(sharedCss).css({'background-position' : '0 -72px'});
        $pinterestButton.css(sharedCss).css({'background-position' : '-129px -163px'});
        $facebookButton.css(sharedCss).css({'background-position' : '-174px -163px'});
        $emailButton.css(sharedCss).css({'background-position' : '-217px -163px'});

        if (navigator.userAgent.indexOf('Android') > -1){
            $('#brandLogo_mr3163').css({
                'top' : '6px'
            });
        }
    };
    utils.injectHtml = function(){
        logg('utils.injectHtml ->');

        var $mainContainer = $(utils.html.mainContainer()),
            $title = $(utils.html.title()),
            $ratingsAndBrandLogoContainer =	$(utils.html.ratingsAndBrandLogoContainer()),
            $mainImage = $(utils.html.mainImage()),
            $saveAndSocialContainer = $(utils.html.saveAndSocialContainer()),
            $deck_mr3163 = $(utils.html.deck_mr3163()),
            $addRecipeToShoppingListButton_mr3163 = $(utils.html.addRecipeToShoppingListButton_mr3163());
        //$ingredientList_mr3163 = utils.html.ingredientList_mr3163(),
        //$preparation_mr3163 = utils.html.preparation(),
        //$nutrition_mr3163 = $(utils.html.nutrition_mr3163()),
        //$moreFrom_mr3163 = $(utils.html.moreFrom_mr3163()),
        //$related_mr3163 = $(utils.html.related_mr3163());

        $mainContainer
            .append($title)
            .append($ratingsAndBrandLogoContainer)
            .append($mainImage)
            .append($saveAndSocialContainer)
            .append($deck_mr3163)
            .append($addRecipeToShoppingListButton_mr3163)
        //.append($ingredientList_mr3163)
        //.append($preparation_mr3163)
        //.append($nutrition_mr3163)
        //.append($moreFrom_mr3163)
        //.append($related_mr3163)
        //.append(utils.html.outbrain_mr3163());

        $('#content').before($mainContainer);

        //css tweaks that need to come from the CSS
        utils.updateCss();
        //evnet  handlers
        utils.setupEventHandlers();
    };


    utils.setupEventHandlers = function(){
        logg('utils.setupEventHandlers ->');

        var $newSocialButtons = $('#socialButtons_mr3163');

        //setup the save recipe button
        utils.setupSaveRecipeButton();
        utils.checkIfRecipeAlreadySaved();

        $('#seeAllImagesIcon').click(function(){
            //$('.photoCount a strong').click();
            window.location.href = $('.featuredPhoto .photo .photoCount a').attr('href');
        });

        $('#playVideoIcon').click(function(){
            window.location.href = $('.detailsB a.video').attr('href');
        });

        //setup pinterest button
        if ($newSocialButtons.length) {
          $newSocialButtons.find('.pinterest').parent()
            .attr('href', $('#pinterestButton_old').attr('href'))
            .attr('onclick', $('#pinterestButton_old').attr('onclick'));

          $newSocialButtons.find('.facebook').parent()
            .attr('href', $('#facebookButton_old').attr('href'))
            .attr('onclick', $('#facebookButton_old').attr('onclick'));

          $newSocialButtons.find('.email').click(function () {
            $('#email_recipe').click();
          });
        }

        $('#writeReview_mr3163').click(function(){
            var url = window.location.href.replace('/m','');

            url = url + 'ratings/';
            window.location.href = url;
        });

        $('#addRecipeToShoppingListButton_mr3163').click(function(){
            utils.saveToShoppingList();
        });

        $('#content_mr3163 .inner.horizTouts.horizTouts75 .x4-editorial-tout-headline-clickable-75x75').click(function(e){
            e.preventDefault();
            e.stopPropagation();

            var destination = $(this).attr('href');
            utils.delay(function(){
                window.location.href = destination;
            },utils.constants.PAGE_UNLOAD_DELAY);
        });
    };
    utils.html.mainContainer = function(){
        logg('utils.html.mainContainer ->');

        return [
            '<div id="content_mr3163"></div>'
        ].join('');
    };
    utils.html.title = function(){
        return [
            '<h1>',
            utils.constants.TITLE_TEXT,
            '</h1>',
        ].join('');
    };
    utils.html.writeReview = function(){
        return [
            '<a id="writeReview_mr3163" title="Write a Review / Read Reviews">',
            'Reviews',
            '</a>',
        ].join('');
    };
    utils.html.ratings = function(){
        var retVal = '<div></div>',
            $clone = null,
            $recipeHd = $('.recipeHd');

        if ($recipeHd.length){
            $clone = $recipeHd.clone();
            $clone.find('h1').remove();

            retVal = '<div id="ratings_mr3163">' + $.trim($clone.html()) + '</div>';
        }

        return retVal;
    };
    utils.html.brandLogo = function(){
        var retVal = '<div></div>',
            $clone = null,
            $brandLogo = $('#recipeTabContent .recipeDetails .detailsA .featuredPhoto .attr a');

        if ($brandLogo.length){
            $clone = $brandLogo.clone();

            retVal = '<div id="brandLogo_mr3163">' + $.trim($clone.html()) + '</div>';
        }

        return retVal;
    };
    utils.html.ratingsAndBrandLogoContainer = function(){
        return [
            '<div id="ratingsAndBrandLogoContainer">',
            utils.html.ratings(),
            utils.html.writeReview(),
            utils.html.brandLogo(),
            '</div>'
        ].join('');
    };
    utils.html.seeAllImagesIcon = function(){
        return [
            '<div id="seeAllImagesIcon"></div>'
        ].join('');
    };
    utils.html.playVideoIcon = function(){
        return [
            '<div id="playVideoIcon"></div>'
        ].join('');
    };
    utils.html.mainImage = function(){
        var retVal = '<div></div>',
            $clone = null,
            $mainImage = $('#recipeTabContent .recipeDetails .detailsA .featuredPhoto .photo');

        if ($mainImage.length){
            $clone = $mainImage.clone();

            $clone
                .find('img')
                .removeAttr('height')
                .removeAttr('width')
                .end()
                .find('.photoCount').remove();

            retVal = [
                '<div id="mainImage_mr3163">',
                $.trim($clone.html()),
                utils.html.seeAllImagesIcon(),
                ($('.detailsB a.video img').length ? utils.html.playVideoIcon() : ''),
                '</div>'
            ].join('');
        }
        return retVal;
    };
    utils.html.saveAndSocialContainer = function(){
        return [
            '<div id="saveAndSocialContainer">',
            utils.html.saveRecipeButton_mr3163(),
            utils.html.shareCountContainer_mr3163(),
            utils.html.socialButtons_mr3163(),
            '</div>'
        ].join('');
    };
    utils.html.saveRecipeButton_mr3163 = function(){
        return [
            '<div id="saveRecipeButton_mr3163" class="saveAndSocial">+&nbsp;Save</div>'
        ].join('');
    };
    utils.html.shareCountContainer_mr3163 = function(){
        return [
            '<div id="shareCountContainer_mr3163" class="saveAndSocial">',
            '<span class="count"></span>',
            '<span class="label"></span>',
            '</div>'
        ].join('');
    };
    utils.html.socialButtons_mr3163 = function(){
        return [
            '<div id="socialButtons_mr3163" class="saveAndSocial">',
            '<a target="_blank"><span class="socialButton pinterest"></span></a>',
            '<a target="_blank"><span class="socialButton facebook"></span></a>',
            '<a><span class="socialButton email"></span></a>',
            '</div>'
        ].join('');
    };
    utils.html.deck_mr3163 = function(){
        return [
            '<div id="deck_mr3163">',
            '<p>',
            utils.constants.OLD_DECK_HTML,
            '</p>',
            utils.html.yield_mr3163(),
            ($('time[itemprop="total"]').length ? utils.html.totalTime_mr3163() : ''),
            '</div>'
        ].join('');
    };
    utils.html.yield_mr3163 = function(){
        return [
            '<div id="yield_mr3163">',
            ('<span class="value">' + utils.constants.YIELD_TEXT  + '</span>'),
            '</div>'
        ].join('');
    };
    utils.html.totalTime_mr3163 = function(){
        return [
            '<div id="totalTime_mr3163">',
            ('<span class="label">' + utils.constants.TOTAL_TIME_TEXT_LABEL + '</span>'),
            ('<span class="value">' + utils.constants.TOTAL_TIME_TEXT + '</span>'),
            '</div>'
        ].join('');
    };
    utils.html.addRecipeToShoppingListButton_mr3163 = function(){
        return [
            '<h2>Ingredients</h2>',
            '<div id="addRecipeToShoppingListButton_mr3163">',
            '<span>+&nbsp;Add To Shopping List</span>',
            '</div>'
        ].join('');
    };
    utils.html.ingredientList_mr3163 = function(){
        logg('utils.html.ingredientList_mr3163 ->');

        return [
            '<div id="ingredientList_mr3163">',
            '</div>'
        ].join('');
    };
    utils.html.genericCheckBox = function(){
        return [
            '<input type="checkbox" class="checkbox_mr3163" checked="true">'
        ].join('');
    };
    utils.html.preparation = function(){
        return [
            '<div id="preparation_mr3163">',
            utils.constants.PREPARATION_TEXT,
            '</div>'
        ].join('');
    };
    utils.html.nutrition_mr3163 = function(){
        return [
            '<div id="nutrition_mr3163">',
            utils.constants.NUTRITION_TEXT,
            '</div>'
        ].join('');
    };
    utils.html.moreFrom_mr3163 = function(){
        return [
            '<div id="moreFrom_mr3163">',
            utils.constants.MORE_FROM_TEXT,
            '</div>'
        ].join('');
    };
    utils.html.related_mr3163 = function(){
        return [
            '<div id="related_mr3163">',
            utils.constants.RELATED_TEXT,
            '</div>'
        ].join('');
    };
    utils.html.outbrain_mr3163 = function(){
        return utils.constants.$OUTBRAIN_WIDGET;
    };

    //################################################################################

    utils.getMoreFromElement = function(){
        logg('utils.setupDomConstants');

        $('#recipeTabContent.recipeTabContent-details  .recipeBox').each(function(){
            var $me = $(this),
                $h3 = $(this).find('h3'),
                h3Text = '';

            if ($h3.length){
                h3Text = $h3.text();
                if (h3Text.indexOf('More From') > -1){
                    //$me.attr('id','moreFrom_mr3163');
                    $me.addClass('moreFrom_mr3163');
                }
            };
        });

        logg('>> utils.setupDomConstants > length: ' + $('#moreFrom_mr3163').length);
    };

    utils.setupDomConstants = function(){
        logg('utils.setupDomConstants');

        utils.constants.$CONTENT_MAIN = $('#content');
        utils.constants.$OLD_CONTENT = utils.constants.$CONTENT_MAIN.find('article');
        utils.constants.$CONTAINER = $('<div id="mr3163"></div>');
        utils.constants.$title = $('.recipeHd h1 a').text();
        utils.constants.$seeAllPhotosLink_mr3163 = $('#seeAllPhotosLink').clone().attr('id','seeAllPhotosLink_mr3163');
        utils.constants.OLD_DECK_HTML = $.trim($('#recipeTabContent .detailsB p.dek + p').html());
        utils.constants.YIELD_TEXT = $('span[itemprop="yield"]').text();
        utils.constants.TOTAL_TIME_TEXT = $('time[itemprop="total"]').text();
        utils.constants.TOTAL_TIME_TEXT_LABEL = $('time[itemprop="total"]').parent().parent().find('b').text();
        utils.constants.INGREDIENTS_LIST_TEXT = $.trim($('.recipeBox.ingredients .inner > ul').parent().html());
        utils.constants.PREPARATION_TEXT = $.trim($('#recipeTabContent .recipeBox.preparation').html());
        utils.constants.NUTRITION_TEXT = $.trim($('#recipeTabContent .recipeBox.nutrition').html());
        //utils.constants.MORE_FROM_TEXT = $('#recipeTabContent .recipeBox.nutrition + .recipeBox').clone();
        utils.constants.MORE_FROM_TEXT = $('#content .moreFrom_mr3163').clone();
        utils.constants.MORE_FROM_TEXT.find('script').remove();
        utils.constants.MORE_FROM_TEXT = utils.constants.MORE_FROM_TEXT.html();
        utils.constants.RELATED_TEXT = $.trim($('#recipeTabContent .recipeBox.related').html());
        utils.constants.TITLE_TEXT = $.trim($('.recipeHd h1 a').text());
        utils.constants.$OUTBRAIN_WIDGET = $('#outbrain_widget_0').clone();
    };
    utils.getRecipePermalink = function(){
        logg('lib.utils.getRecipePermalink ->');

        var retVal = false,
            permalinkPattern = /.+\/recipe\/.+-?-\d+\//,
            loc = window.location.href;

        if (loc.match(permalinkPattern)) {
            retVal = loc.match(permalinkPattern)[0].match(/[a-zA-Z0-9-]*?-\d{1,}/)[0]
        }

        return retVal;
    };
    utils.getRecipeId = function(permalink){
        logg('utils.getRecipeId -> permalink: ' + permalink);

        var permalinkPattern = /.+\/recipe\/.+-\d+\//,
            reval = false,
            match = false;

        if(!permalink || typeof permalink != 'string'){return; }

        match = permalink.match(/\d{1,}/);

        if(match){
            retVal = match[0];
        }

        return retVal;
    };
    utils.saveToShoppingList = function () {
        logg('utils.saveToShoppingList ->');

    }

    utils.checkIfRecipeAlreadySaved = function(){
        logg('utils.checkIfRecipeAlreadySaved -> utils.state.loggedInUser -> ' + utils.state.loggedInUser);

    };

    utils.setupSaveRecipeButton = function(){
        logg('utils.setupSaveRecipeButton ->');

    };
    utils.saveToShoppingCartLinkExists = function(){
        logg('utils.saveToShoppingCartLinkExists');

        var retVal = false,
            $saveLink = $('#recipeTabContent .recipeBox.ingredients .addToSL a');

        if($saveLink.length && $saveLink.text() === '+ Add To Shopping List'){
            retVal = true;
        }

        return retVal;
    };
    utils.recipeAlreadySavedToShoppingListTextExists = function(){
        logg('utils.recipeAlreadySavedToShoppingListTextExists');

        var retVal = false;

        if($('#recipeTabContent .recipeBox.ingredients .addToSL span[title="Added to Shopping List"]').length){
            retVal = true;
        }

        return retVal;
    };
    utils.recipeAlreadySavedToShoppingList = function(){
        logg('utils.recipeAlreadySavedToShoppingList');

        var retVal = false;

        if(!utils.saveToShoppingCartLinkExists() && utils.recipeAlreadySavedToShoppingListTextExists()){
            retVal = true;
        }

        return retVal;
    };
    utils.prepareDom = function(){
        logg('utils.prepareDom');

        var $oldContentShareBtnToolBar = $('#recipeTabContent .shareBtnToolBar');

        $oldContentShareBtnToolBar.find('.shareBtn.shareBtnPinterest').attr('id','pinterestButton_old');

        $oldContentShareBtnToolBar.find('.shareBtn.shareBtnFacebook').attr('id','facebookButton_old');
    };
    utils.omniture.report = function(message){
        logg('utils.omniture.report  ->');

        if (!message || !(typeof message === 'string') || !window.omniCommunityTracker){return; }

        logg(('>> about to fire omniCommunityTracker userEngagement:' + message));

        //send the omniCommunityTracker userEngagement
        omniCommunityTracker(message);
    };
    utils.delay = function(func, delayTime){
        logg('utils.delay ->');

        var delay = delayTime || utils.constants.SET_TIMEOUT_DELAY;

        if (!func || !func instanceof Function){return; }

        setTimeout(func,delay);
    };
    utils.setupLogger = function(){
        logg('utils.setupLogger ->');
        //overwrite the log method
        //logg = tohLib.logger.log;

        //set the logger prefix
       // tohLib.setConfig({loggerPrefix: 'newMobileDesign -> '});
    };
    utils.isRecipePage = function(){
        logg('utils.isRecipePage ->');

        var is404 = ( $('meta[name=ctype]').length &&  $('meta[name=ctype]').attr('content') === '404-page'),
            pattern = /myrecipes.(local|com)\/m\/recipe\//,
            loc = window.location.href,
            retVal = false;

        if (loc.match(pattern) && ( loc.indexOf('/images') === -1) && !is404){
            retVal = true;

            logg('>> this is a recipe page');
        } else {
            logg('>> this is not a recipe page.');
        }

        return retVal;
    };
    utils.getCustomCss = function(){
        logg('utils.getCustomCss ->');

        return [
            //hid the original content
            //'#content{display:none;}',
            //fix that ad!
            '#ad300x50{margin:0 auto 20px!important;}',
            '#content{margin-top:20px;}',
            '#content_mr3163{width:320px;margin:0 auto;}',
            '#ratings_mr3163 .rating{display:inline-block;}',
            '#mainImage_mr3163{position:relative;}',
            '#mainImage_mr3163 a{display:block;}',
            '#mainImage_mr3163 a img{display:block;width:320px;}',
            '#ratingsAndBrandLogoContainer{position:relative;margin:10px 0;height:25px;}',
            '#ratingsAndBrandLogoContainer #ratings_mr3163{display: inline-block;margin-left: 10px;}',
            '#ratings_mr3163 i{display:none;}',
            '#ratingsAndBrandLogoContainer #brandLogo_mr3163{position:absolute;top:0;right:10px;}',
            '#brandLogo_mr3163 img{width:80px;}',
            '#seeAllImagesIcon{position: absolute;width:25px;height:25px;left:10px;top:10px;}',
            '#seeAllImagesIcon:hover{cursor:pointer;}',
            '#playVideoIcon{position:absolute;height:30px;width:130px;bottom:10px;right:25px;}',
            '#playVideoIcon:hover{cursor:pointer;}',
            '#saveAndSocialContainer{margin:15px 0;}',
            '#saveRecipeButton_mr3163, #addRecipeToShoppingListButton_mr3163{width:85px;margin:0;height:30px;line-height:30px;text-align:center;background-color: #CA1517;color:#fff;border-radius:5px;}',
            '#saveRecipeButton_mr3163:hover{cursor:pointer;}',
            '#saveRecipeButton_mr3163.noPointer:hover{cursor:default;}',
            '#saveRecipeButton_mr3163.saved, #addRecipeToShoppingListButton_mr3163.saved{background-color: #B8B8B8;}',
            '#saveRecipeButton_mr3163,#socialButtons_mr3163, #shareCountContainer_mr3163{position:relative;display:inline-block;}',
            '#shareCountContainer_mr3163{/* display:none; */font-size:12px;}',
            '#shareCountContainer_mr3163{left:10px;font-size:12px;font-weight:bold;color:#CA1517;}',
            '#shareCountContainer_mr3163 .label{margin-left:5px;}',
            '#socialButtons_mr3163{float:right;top: -5px;vertical-align:middle;}',
            '#socialButtons_mr3163 .pinterest, #socialButtons_mr3163 .facebook, #socialButtons_mr3163 .email{display: inline-block;width:33px;height:33px;margin-left:10px;}',
            '#socialButtons_mr3163 .pinterest:hover, #socialButtons_mr3163 .facebook:hover, #socialButtons_mr3163 .email:hover{cursor:pointer;}',
            '#deck_mr3163{margin-top:0;}',
            '#yield_mr3163, #totalTime_mr3163{color:#666;}',
            '#yield_mr3163{margin-top: 0;}',
            '#addRecipeToShoppingListButton_mr3163{width:50%;}',
            '#addRecipeToShoppingListButton_mr3163:hover{cursor:pointer;}',
            '#ingredientList_mr3163 ul, #ingredientList_mr3163 li,#preparation_mr3163 ol,#preparation_mr3163 li,#nutrition_mr3163 ul,#nutrition_mr3163 li{margin:0;padding:0;list-style-type: none!important;}',
            '#moreFrom_mr3163 ul, #moreFrom_mr3163 li {margin:10px 0!important;list-style-type:none!important;}',
            '#ingredientList_mr3163 li.header{margin:10px 0;font-weight:bold;}',
            '#ingredientList_mr3163 li.list{margin:20px 0;}',
            '#ingredientList_mr3163 li.list span{display:none;padding:10px 0;margin:20px 0;}',
            '#ingredientList_mr3163 li.list .ingredientCheckboxContainer .checkbox, #ingredientList_mr3163 li.list .ingredientCheckboxContainer label{display:inline-block;vertical-align: middle;}',
            '#ingredientList_mr3163 li.list .ingredientCheckboxContainer .checkbox{width:30px;}',
            '#ingredientList_mr3163 li.list .ingredientCheckboxContainer label{width:270px;}',
            '#ingredientList_mr3163 .dollar_mr3163{position:relative;left:5px;color:#CA1517;font-weight:bold;}',
            '#ingredientList_mr3163 .dollar_mr3163:hover{cursor:pointer;}',
            '#preparation_mr3163 li, #nutrition_mr3163 li{margin:10px 0;}',
            '#ratingsAndBrandLogoContainer, #saveAndSocialContainer, #deck_mr3163, #ingredientList_mr3163, #preparation_mr3163, #nutrition_mr3163, #moreFrom_mr3163, #related_mr3163{padding:0 10px;}',
            '#content_mr3163 > h1, #content_mr3163 > h2, #addRecipeToShoppingListButton_mr3163{margin-left:10px!important;}',
            '#addRecipeToShoppingListButton_mr3163{display:block;}',

            '#ingredientList_mr3163 .recipeBox.ingredients > h3,#ingredientList_mr3163 .recipeBox.ingredients > .addToSL{display:none;}',
            '#ingredientList_mr3163 .recipeBox.ingredients .inner li{margin: 10px 0;}',
            '#writeReview_mr3163{margin-left:10px;font-size:14px;font-weight:bold;}',
            '#writeReview_mr3163:hover{cursor:pointer;}',
            'body.recipes #content {border:none;}',
            '#saveRecipeButton_mr3163{font-size: 16px;font-weight: bold;}',
            '#addRecipeToShoppingListButton_mr3163 span{font-weight: bold;}'

        ].join('');
    };

    utils.constants.CSS_SPRITE_DATA_URI = 'iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowQzc5NUY2NUM4QkExMUUzOTQwMkJGQjI3ODJEMURCMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowQzc5NUY2NkM4QkExMUUzOTQwMkJGQjI3ODJEMURCMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBDNzk1RjYzQzhCQTExRTM5NDAyQkZCMjc4MkQxREIwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBDNzk1RjY0QzhCQTExRTM5NDAyQkZCMjc4MkQxREIwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wvmdbwAARx1JREFUeNrsXQec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';

    //##################TOH LIB - UILITIES
    //removed because it is loaded earlier
    //##################TOH LIB - UILITIES

    //initialize the app
    utils.init();
})();

})(jQuery);

//Cozi Implementation
//to roll-back: comment out the following function
jQuery(document).ready(function(){
    var winLocationHref = window.location.href,
      winLocProt = window.location.protocol,
      scriptUrl = '',
      //scriptName = 'mr-cozi-mobile.js',
      scriptName = 'mr-cozi-app-mobile.js',
      constants = {};

    constants.JS_CDN_PREFIX = '';
    constants.JS_CDN_PATH = 'cdn-js.myrecipes.com/sites/all/themes/myrecipes_mobile/js/';

    if (winLocationHref.indexOf('dev.myrecipes.com') > -1){
        constants.JS_CDN_PREFIX = winLocProt + '//dev-';
    } else if (winLocationHref.indexOf('qa.myrecipes.com') > -1){
        constants.JS_CDN_PREFIX = winLocProt + '//qa-';
    } else {
        constants.JS_CDN_PREFIX = winLocProt + '//';
    }

    scriptUrl = constants.JS_CDN_PREFIX +  constants.JS_CDN_PATH + scriptName;

    jQuery.getScript(scriptUrl);
});

//Related video load on mobile recipe page
jQuery(document).ready(function() {
 if(jQuery('.pane-ti-lsg-mr-recipe-recipe-related-videos').length) {
   if (jQuery('.node-type-recipe').find('.field-instructions').length > 0) {
     var ptextcount = 0;
     var i = 0;
     var video_content = jQuery('.pane-ti-lsg-mr-recipe-recipe-related-videos').wrapAll('<div>').parent().html();
     jQuery('.pane-ti-lsg-mr-recipe-recipe-related-videos').html('');
     jQuery('.field-instructions p').each(function() {
       var ptextcontent = jQuery(this).text();
       var ptexttrim = jQuery.trim(ptextcontent);
       var ptextlength = ptexttrim.length;
       if (ptextlength > 0) {
         if(i == 1) {
             jQuery(this).before(video_content);
             jQuery('#recipe-related-video').css("display", "block");
         }
         i++;
         ptextcount += ptextlength;
       }
     });
   }
 }
});

function elementInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top >= window.pageYOffset &&
    left >= window.pageXOffset &&
    (top + height) <= (window.pageYOffset + window.innerHeight) &&
    (left + width) <= (window.pageXOffset + window.innerWidth)
  );
}


console.log("testing log");
document.onscroll = function(){
    

var d = document.getElementById("block-ti-lsg-mr-ads-mobile-320x320");

console.log(d);
    if(elementInViewport(d)) {
       d.classList.add('zoomad');
      d.classList.remove('zoomoutad');
      
    } else {
      d.classList.add('zoomoutad');
     d.classList.remove('zoomad');
     
    }
 };
