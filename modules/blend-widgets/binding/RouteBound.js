"use strict";

/**
 * @mixin $widgets.RouteBound
 * @augments $widget.Widget
 */
$widgets.RouteBound = $oop.getClass('$widgets.RouteBound')
.expect($oop.getClass('$widget.Widget'))
.define(/** @lends $widgets.RouteBound# */{
  /** @ignore */
  onAttach: function () {
    this.syncToActiveRoute();
    this.on(
        $router.EVENT_ROUTE_CHANGE,
        $router.RouteEnvironment.create(),
        this.onRouteChange);
  },

  /**
   * Updates parts of the widget's state that depend on the active route.
   * @ignore
   */
  syncToActiveRoute: function () {},

  /** @ignore */
  onRouteChange: function () {
    this.syncToActiveRoute();
  }
});
