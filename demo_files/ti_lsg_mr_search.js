
(function ($) {
  Drupal.behaviors.aySearch = {attach: function (context) {
    var firstCol = $('.panel-col-first', context),
      firstColFacets = $('[class*="pane-facetapi-"]', firstCol),
      firstColFacetNone = $('.pane-custom.pane-2', firstCol);
    if (firstColFacets.length) {
      firstColFacetNone.hide();
    }
    else {
      firstColFacetNone.show();
    }
  }};
})(jQuery);


(function ($) {
    var pagePathName = document.location.pathname;
    var isMobilePage = pagePathName.indexOf("/m/") === 0 ? true : false;
    $(document).ready(function () {
        $(".search-icon").click(function (e) {
            $("#site-searchbox-overlay").fadeToggle(300);
            $("#edit-search-block-form").focus();
            e.stopImmediatePropagation();
            //Search overlay ad call for Desktop page
            if (!isMobilePage && !$(".sponsor-logo div").get(0)) {
                if (typeof adFactory != "undefined") {
                    var ad = adFactory.getAd(2, 1);
                    ad.setPosition(1);
                    ad.write('sponsor-logo');
                    var ad = adFactory.getAd(150, 45);
                    ad.setParam('cont', 'buildameal');
                    ad.setPosition(2);
                    ad.write('sponsor-logo');
                }
            }
        });
        if (!isMobilePage) {
            $(document).click(function (e) {
              if (!$(e.target).closest("#site-searchbox-overlay").get(0) && !$(e.target).closest(".autocomplete").get(0)) {
                $("#site-searchbox-overlay").fadeOut(300);
              }
          });
        }
        $(".search-overlay-close").on("click", function () {
            var $searchBoxOverlay = $('#site-searchbox-overlay');
            $searchBoxOverlay.fadeOut(300);
            $searchBoxOverlay.toggleClass('overlay-hidden');
        });
    });
    //Search overlay build a meal form toggle option on click - mobile page
    if (isMobilePage) {
        $(".build-a-meal-overlay .ingredients-chef-search-main-header").on("click", function () {
            $(".build-a-meal-overlay .ingredients-chef-search-header").fadeToggle("slow");
            $(".build-a-meal-overlay .build-a-meal-form").fadeToggle("slow");

        });
    }
})(jQuery);
