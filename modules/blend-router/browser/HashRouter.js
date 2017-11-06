"use strict";

/**
 * @function $router.HashRouter.create
 * @returns {$router.HashRouter}
 */

/**
 * Synchronizes application route state to browser URL hash.
 * @class $router.HashRouter
 * @extends $router.Router
 */
$router.HashRouter = $oop.getClass('$router.HashRouter')
.blend($oop.getClass('$router.Router'))
.define(/** @lends $router.HashRouter# */{
  /**
   * @param {$router.RouteChangeEvent} event
   * @ignore
   */
  onRouteChange: function (event) {
    var routeAfter = event.routeAfter;
    window.location.hash = '#' + routeAfter.toUrlPath();
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onDocumentLoad: function (event) {
    var eventTrail = $event.EventTrail.create(),
        wrapperEvent = $event.WrapperEvent.fromEventName('documentLoadWrapper')
        .wrap(event),
        hash = window.location.hash,
        routeEnvironment = $router.RouteEnvironment.create(),
        route = $router.Route.fromUrlPath(hash.substr(1));

    eventTrail.push(wrapperEvent);
    routeEnvironment.setActiveRoute(route);
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onHashChange: function (event) {
    var eventTrail = $event.EventTrail.create(),
        wrapperEvent = $event.WrapperEvent.fromEventName('hashChangeWrapper')
        .wrap(event),
        hash = window.location.hash,
        routeEnvironment = $router.RouteEnvironment.create(),
        routeAfter = $router.Route.fromUrlPath(hash.substr(1)),
        routeBefore = routeEnvironment.activeRoute;

    if (!routeBefore.equals(routeAfter)) {
      eventTrail.push(wrapperEvent);
      routeEnvironment.setActiveRoute(routeAfter);
    }
  }
});

$oop.getClass('$router.Router')
.forwardBlend($router.HashRouter, function () {
  return $router.routingMode === 'hash' && $utils.isBrowser();
});

if ($utils.isBrowser()) {
  document.addEventListener('DOMContentLoaded', function (event) {
    if ($router.routingMode === 'hash') {
      $router.HashRouter.create().onDocumentLoad(event);
    }
  }, false);

  window.addEventListener('hashchange', function (event) {
    if ($router.routingMode === 'hash') {
      $router.HashRouter.create().onHashChange(event);
    }
  });
}