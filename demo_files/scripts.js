(function($, Drupal, undefined) {
  Drupal.behaviors.brightcovePreRoll = {
    attach: function (context, settings) {
      bcTemplateLoaded  = function(experienceID){
        player = brightcove.api.getExperience(experienceID);
        modVP = player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
        modExp = player.getModule(brightcove.api.modules.APIModules.EXPERIENCE);
        modCon = player.getModule(brightcove.api.modules.APIModules.CONTENT);
        modAd = player.getModule(brightcove.api.modules.APIModules.ADVERTISING);
        var adPolicy = new Object();
        var adzone = ad.zone || "food/howto";
        //console.log("Adzone="+adzone);
        var overlayAdzone = "video_bc/" + adzone.split("/")[0] + "_bc";
        if (adzone.split("/")[1] != "main") var subch = "subch="+adzone.split("/")[1];
        adPolicy.adServerURL = "http://pubads.g.doubleclick.net/gampad/ads?sz=1000x1&iu=/8484/ckl/" + overlayAdzone + "&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]";
        adPolicy.prerollAds = true;
        var currentVideoOverlayAdKeyValuePairs = subch || "";
        //console.log(currentVideoOverlayAdKeyValuePairs);
        // TODO Expand Key Value Pairs.
        adPolicy.prerollAdKeys = currentVideoOverlayAdKeyValuePairs.replace(/\|/g,";").replace(/\s/g,"%20");
        modAd.setAdPolicy(adPolicy);
        modExp.addEventListener(brightcove.api.events.ExperienceEvent.TEMPLATE_READY, onTemplateReady);
      };
    }
  };

  Drupal.behaviors.menuLinkControl = {
    attach: function (context, settings) {
        $('.block-menu-menu-mobile-main-menu', context).click(function() {
            $('.menu-menu-mobile-main-menu', context).toggle();
        });
    }
  };

  Drupal.behaviors.convertUlListToSelectNav = {
    attach: function (context, settings) {
        $('ul.menu-menu-channel-menu').each(function() {
            var list = $(this);
            var select = $(document.createElement('select')).insertBefore($(this).hide());

            $(document.createElement('option')).appendTo(select).html('Select...');

            $('>li', this).each(function() {
                var ahref = $(this).children('a'),
                    target = ahref.attr('target'),
                    option = $(document.createElement('option'))
                        .appendTo(select)
                        .val(ahref.attr('href'))
                        .html(ahref.html());

                if (ahref.attr('class') === 'dlspb-selected') {
                    option.attr('selected', 'selected');
                }
            });

            select.change(function() {
                window.location.href = this.value;
            });
        });
    }
  };

  Drupal.behaviors.contentCollapsed = {
    attach: function (context, settings) {
        var blogs_collapsed = false;
        $('.pane-node-field-blogs-header', context).click(function() {
            if (blogs_collapsed) {
                // Show content.
                $('.pane-node-field-blog-touts').show();
                blogs_collapsed = false;
                $(this).removeClass('collapse');
            }
            else {
                // Hide content.
                $('.pane-node-field-blog-touts').hide();
                blogs_collapsed = true;
                $(this).addClass('collapse');
            }
        });

        var editorial_collapsed = false;
        $('.pane-node-field-editorial-touts-header', context).click(function() {
            if (editorial_collapsed) {
                // Show content.
                $('.pane-node-field-editorial-touts').show();
                editorial_collapsed = false;
                $(this).removeClass('collapse');
            }
            else {
                // Hide content.
                $('.pane-node-field-editorial-touts').hide();
                editorial_collapsed = true;
                $(this).addClass('collapse');
            }
        });

        var popular_recipes_collapsed = false;
        $('.block-ti-lsg-mr-most-popular-most-popular header h3', context).click(function() {
            if (popular_recipes_collapsed) {
                // Show content.
                $('.block-ti-lsg-mr-most-popular-most-popular .item-list').show();
                popular_recipes_collapsed = false;
                $(this).removeClass('collapse');
            }
            else {
                // Hide content.
                $('.block-ti-lsg-mr-most-popular-most-popular .item-list').hide();
                popular_recipes_collapsed = true;
                $(this).addClass('collapse');
            }
        });
        
        var more_recipes_collapsed = false;
        $('.pane-ti-lsg-mr-recipe-recipes-related h2', context).click(function() {
            if (more_recipes_collapsed) {
                // Show content.
                $('.pane-ti-lsg-mr-recipe-recipes-related .item-list').show();
                more_recipes_collapsed = false;
                $(this).removeClass('collapse');
            }
            else {
                // Hide content.
                $('.pane-ti-lsg-mr-recipe-recipes-related .item-list').hide();
                more_recipes_collapsed = true;
                $(this).addClass('collapse');
            }
        });
    }
  };

  Drupal.behaviors.homepageFeaturePromoLogic = {
    attach: function (context, settings) {

        var gallery, el, i, page, slides = [];
        var dots = $('#slides-navigation li');
        dots.eq(0).addClass("selected");

        dots.click(function(event){
            event.preventDefault();
            dots.removeClass("selected");
            gallery.goToPage($(this).index());
            $(this).addClass("selected");
        });

        if (typeof Drupal.settings.ti_lsg_mr_homepage !== "undefined" && Drupal.settings.ti_lsg_mr_homepage) {
            slides = Drupal.settings.ti_lsg_mr_homepage;

            gallery = new SwipeView('#slides', { numberOfPages: slides.length });

            // Load initial data.
            for (i=0; i<3; i++) {
                page = i==0 ? slides.length-1 : i-1;
                var container = document.createElement('div');
                container.className = 'hero-tout-image-data';

                el = document.createElement('div');
                el.className = 'hero-tout-image';
                el.innerHTML = slides[page].field_hero_tout_image;
                el.onload = function () { this.className = ''; }
                container.appendChild(el);

                el = document.createElement('div');
                el.className = 'hero-tout-data';
                el.innerHTML = slides[page].field_hero_tout_desc;
                container.appendChild(el);

                gallery.masterPages[i].appendChild(container);
            }

            gallery.onFlip(function () {
                var el,
                    upcoming,
                    i;

                for (i=0; i<3; i++) {
                    upcoming = gallery.masterPages[i].dataset.upcomingPageIndex;

                    if (upcoming != gallery.masterPages[i].dataset.pageIndex) {
                        el = gallery.masterPages[i].querySelector('.hero-tout-image');
                        el.innerHTML = slides[upcoming].field_hero_tout_image;

                        el = gallery.masterPages[i].querySelector('.hero-tout-data');
                        el.innerHTML = slides[upcoming].field_hero_tout_desc;
                    }
                }

                dots.removeClass("selected");
                dots.eq(gallery.pageIndex).addClass("selected");
            });

            gallery.onMoveOut(function () {
                gallery.masterPages[gallery.currentMasterPage].className = gallery.masterPages[gallery.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
            });

            gallery.onMoveIn(function () {
                var className = gallery.masterPages[gallery.currentMasterPage].className;
                /(^|\s)swipeview-active(\s|$)/.test(className) || (gallery.masterPages[gallery.currentMasterPage].className = !className ? 'swipeview-active' : className + ' swipeview-active');
            });
        }
    }
  };

  // Make banner ad sticky for all mobile pages
  $(document).ready(function($) {
    $.getScript('/sites/all/themes/myrecipes_mobile/js/jquery.sticky-ads.js').done(function(){
      //get left offset of the ads parent
      var leftPos = jQuery('.block-ti-lsg-mr-ads-mobile-320x50').parent().offset().left;

      $('.block-ti-lsg-mr-ads-mobile-320x50').stickyAd({
        stickyDelay: 2000,
        //set the left property to approx the left offset of the parent
        customCSS: ('width:300px;height:47px;left:' + (leftPos - 14) + 'px!important;')
      });
    });
  });

})(jQuery, Drupal);

// change search sort ul to select
window.jQuery(document).ready(function($){
  var sort_block = ".pane-apachesolr-search-sort";

  // create select box from ul
  var $select = $('<select />');
  $(sort_block + ' ul li').each(function() {
    $(this).find('a').each(function() {
      var $option = $('<option />');
      $option.attr('value', $(this).attr('href')).html($(this).html());
      $select.append($option);
    });

    $(this).replaceWith($select);
  });

  // set change event
  $(sort_block + ' select').bind('change', function () {
    var url = $(this).val(); // get selected value
    if (url) { // require a URL
      window.location = url; // redirect
    }
    return false;
  });

  // select proper option on load
  var term = getUrlParameter('solrsort');
  if (term !== undefined) {
    base = window.location.protocol + '//' + window.location.host;
    nav_string = window.location.href.replace(base, "").split("%")[0];
    $(sort_block + ' select option')
      .each(function() {
        this.selected = (this.value.indexOf(nav_string) !== -1);
      });
  }

  // make visible
  $(sort_block + ' ul').css("visibility", "visible");
});

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}
