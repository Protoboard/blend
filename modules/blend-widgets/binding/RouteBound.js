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
   * @protected
   */
  _syncToActiveRoute: function () {},

  /** @ignore */
  onAttach: function () {
    this._syncToActiveRoute();
    this.on(
        $router.EVENT_ROUTE_CHANGE,
        $router.RouteEnvironment.create(),
        this.onRouteChange);
  },

  /** @ignore */
  onRouteChange: function () {
    this._syncToActiveRoute();
  }
});
