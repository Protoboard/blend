"use strict";

/**
 * @function $router.PushStateRouter.create
 * @returns {$router.PushStateRouter}
 */

/**
 * Synchronizes application route state to browser URL pathname.
 * @class $router.PushStateRouter
 * @extends $router.Router
 */
$router.PushStateRouter = $oop.createClass('$router.PushStateRouter')
.blend($router.Router)
.define(/** @lends $router.PushStateRouter# */{
  /** @ignore */
  init: function () {
    this._syncActiveRouteToHistory();
  },

  /**
   * @private
   */
  _syncActiveRouteToHistory: function () {
    var pathName = window.location.pathname,
        route = $router.Route.fromString(pathName.substr(1));
    $router.RouteEnvironment.create()
    .setActiveRoute(route);
  },

  /**
   * @param {$router.RouteChangeEvent} event
   * @ignore
   */
  onRouteChange: function (event) {
    var routeAfter = event.routeAfter,
        pathNameAfter = '/' + routeAfter.toString();
    window.history.pushState(routeAfter, '', pathNameAfter);
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onPopState: function (event) {
    var eventTrail = $event.EventTrail.create(),
        wrapperEvent = $event.WrapperEvent.fromEventName('popStateWrapper')
        .wrap(event),
        pathName = window.location.pathname,
        routeEnvironment = $router.RouteEnvironment.create(),
        routeAfter = $router.Route.fromString(pathName.substr(1)),
        routeBefore = routeEnvironment.activeRoute;

    if (!routeBefore.equals(routeAfter)) {
      eventTrail.push(wrapperEvent);
      this._syncActiveRouteToHistory();
    }
  }
})
.build();

$router.Router
.forwardBlend($router.PushStateRouter, function () {
  return $router.browserRoutingMethod === 'pushState' && $utils.isBrowser();
});

if ($utils.isBrowser()) {
  window.addEventListener('popstate', function (event) {
    if ($router.browserRoutingMethod === 'pushState') {
      $router.PushStateRouter.create().onPopState(event);
    }
  });
}
