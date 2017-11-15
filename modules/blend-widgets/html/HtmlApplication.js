"use strict";

/**
 * @function $widgets.HtmlApplication.create
 * @returns {$widgets.HtmlApplication}
 */

/**
 * @class $widgets.HtmlApplication
 * @extends $widgets.Application
 * @extends $widget.HtmlWidget
 */
$widgets.HtmlApplication = $oop.getClass('$widgets.HtmlApplication')
.blend($oop.getClass('$widgets.Application'))
.blend($widget.HtmlWidget)
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
  }
});

$oop.getClass('$widgets.Application')
.forwardBlend($widgets.HtmlApplication, function () {
  return $widget.isHtml();
});
