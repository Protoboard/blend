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
$router.HashRouter = $oop.createClass('$router.HashRouter')
.blend($router.Router)
.define(/** @lends $router.HashRouter# */{
  /** @ignore */
  init: function () {
    this._syncActiveRouteToHash();
  },

  /**
   * @private
   */
  _syncActiveRouteToHash: function () {
    var hash = window.location.hash,
        route = $router.Route.fromString(hash.substr(1));
    $router.RouteEnvironment.create()
    .setActiveRoute(route);
  },

  /**
   * @param {$router.RouteChangeEvent} event
   * @ignore
   */
  onRouteChange: function (event) {
    var routeAfter = event.routeAfter;
    window.location.hash = '#' + routeAfter.toString();
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onDocumentLoad: function (event) {
    var eventTrail = $event.EventTrail.create(),
        wrapperEvent = $event.WrapperEvent.fromEventName('documentLoadWrapper')
        .wrap(event);

    eventTrail.push(wrapperEvent);
    this._syncActiveRouteToHash();
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
        routeAfter = $router.Route.fromString(hash.substr(1)),
        routeBefore = routeEnvironment.activeRoute;

    if (!routeBefore.equals(routeAfter)) {
      eventTrail.push(wrapperEvent);
      this._syncActiveRouteToHash();
    }
  }
})
.build();

$router.Router
.forwardBlend($router.HashRouter, function () {
  return $router.browserRoutingMethod === 'hash' && $utils.isBrowser();
});

if ($utils.isBrowser()) {
  document.addEventListener('DOMContentLoaded', function (event) {
    if ($router.browserRoutingMethod === 'hash') {
      $router.HashRouter.create().onDocumentLoad(event);
    }
  }, false);

  window.addEventListener('hashchange', function (event) {
    if ($router.browserRoutingMethod === 'hash') {
      $router.HashRouter.create().onHashChange(event);
    }
  });
}
