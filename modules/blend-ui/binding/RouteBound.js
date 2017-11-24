"use strict";

/**
 * @mixin $ui.RouteBound
 * @augments $widget.Widget
 */
$ui.RouteBound = $oop.getClass('$ui.RouteBound')
.expect($widget.Widget)
.define(/** @lends $ui.RouteBound# */{
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
