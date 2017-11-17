"use strict";

/**
 * @mixin $widgets.RouteBound
 * @augments $widget.Widget
 */
$widgets.RouteBound = $oop.getClass('$widgets.RouteBound')
.expect($oop.getClass('$widget.Widget'))
.define(/** @lends $widgets.RouteBound# */{
  /**
   * To be optionally implemented by host class.
   * @function $widgets.RouteBound#onRouteChange
   */

  /** @ignore */
  onAttach: function () {
    if (this.onRouteChange) {
      this.on(
          $router.EVENT_ROUTE_CHANGE,
          $router.RouteEnvironment.create(),
          this.onRouteChange);
    }
  }
});
