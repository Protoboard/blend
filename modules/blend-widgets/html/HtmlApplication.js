"use strict";

/**
 * @mixin $widgets.HtmlApplication
 * @extends $widget.HtmlWidget
 * @augments $widgets.Application
 */
$widgets.HtmlApplication = $oop.getClass('$widgets.HtmlApplication')
.blend($widget.HtmlWidget)
.expect($oop.getClass('$widgets.Application'))
.define(/** @lends $widgets.HtmlApplication# */{
  /**
   * @member {$router.Route} $widgets.HtmlApplication#activeRoute
   */

  /** @ignore */
  syncToActiveRoute: function () {
    var activeRouteBefore = this.activeRoute,
        activeRouteAfter = $router.getActiveRoute();

    if (activeRouteBefore) {
      this
      .removeCssClass(activeRouteBefore.__classId)
      .removeCssClass('route-' + activeRouteBefore);
    }

    this
    .addCssClass(activeRouteAfter.__classId)
    .addCssClass('route-' + activeRouteAfter);

    this.activeRoute = activeRouteAfter;
  },

  /** @ignore */
  onRouteChange: function () {
    this.syncToActiveRoute();
  }
});

$oop.getClass('$widgets.Application')
.forwardBlend($widgets.HtmlApplication, function () {
  return $widget.isHtml();
});
