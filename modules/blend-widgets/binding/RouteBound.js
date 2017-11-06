"use strict";

/**
 * @mixin $widgets.RouteBound
 * @augments $widget.Widget
 */
$widgets.RouteBound = $oop.getClass('$widgets.RouteBound')
.expect($oop.getClass('$widget.Widget'))
.define(/** @lends $widgets.RouteBound# */{
  /**
   * Updates parts of the widget's state that depend on the active route.
   * To be optionally implemented by host class.
   * @function $widgets.ModuleBound#syncToActiveRoute
   */

  /** @ignore */
  onAttach: function () {
    if (this.syncToActiveRoute) {
      this.syncToActiveRoute();
      this.on(
          $router.EVENT_ROUTE_CHANGE,
          $router.RouteEnvironment.create(),
          this.onRouteChange);
    }
  },

  /** @ignore */
  onRouteChange: function () {
    this.syncToActiveRoute();
  }
});
