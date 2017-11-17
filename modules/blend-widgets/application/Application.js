"use strict";

/**
 * @function $widgets.Application.create
 * @returns {$widgets.Application}
 */

/**
 * @class $widgets.Application
 * @extends $widget.RootWidget
 * @extends $widgets.RouteBound
 */
$widgets.Application = $oop.getClass('$widgets.Application')
.blend($widget.RootWidget)
.blend($oop.getClass('$widgets.RouteBound'))
.define(/** @lends $widgets.Application# */{
  /**
   * @member {$router.Route} $widgets.Application#activeRoute
   */

  /** @ignore */
  onAttach: function () {
    this.syncToActiveRoute();
  },

  /** @ignore */
  syncToActiveRoute: function () {
    var activeRouteBefore = this.activeRoute,
        activeRouteAfter = $router.getActiveRoute();

    if (activeRouteBefore) {
      this
      .setStateValue(activeRouteBefore.__classId, false)
      .setStateValue('route-' + activeRouteBefore, false);
    }

    this
    .setStateValue(activeRouteAfter.__classId, true)
    .setStateValue('route-' + activeRouteAfter, true);

    this.activeRoute = activeRouteAfter;
  },

  /** @ignore */
  onRouteChange: function () {
    this.syncToActiveRoute();
  }
});
