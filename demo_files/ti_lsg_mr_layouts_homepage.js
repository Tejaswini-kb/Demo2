/**
 * @ingroup ti_lsg_mr_layouts_homepage
 * @file ti_lsg_mr_homepage.js
 *
 * Overrides FlexSlider behavior to navigate
 * carousel on hover and to allow links in nav
 * to click through to actual content.
 */
(function($, Drupal, undefined) {
  Drupal.behaviors.homepageCarousel = {
    attach: function(context, settings) {
      $('.hero-rotator-link', context).mouseover(function() {
        $(this).click();
      });
      $('.hero-rotator-link__title a', context).click(function(e) {
        e.stopPropagation();
      });
    }
  }
})(jQuery, Drupal);
