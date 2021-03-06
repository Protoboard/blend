"use strict";

/**
 * @function $router.RouteEnvironment.create
 * @returns {$router.RouteEnvironment}
 */

/**
 * Keeps track on active route and triggers event when active route changes.
 * @class $router.RouteEnvironment
 * @extends $event.EventSender
 * @extends $event.EventListener
 */
$router.RouteEnvironment = $oop.createClass('$router.RouteEnvironment')
.blend($oop.Singleton)
.blend($event.EventSender)
.blend($event.EventListener)
.define(/** @lends $router.RouteEnvironment# */{
  /**
   * Active route as registered by RouteEnvironment. It does not always
   * reflect the *actual* route manifested eg. in the browser. Use
   * `$router.getActiveRoute()` to get the route that is in sync with the
   * manifestation.
   * @member {$router.Route} $router.RouteEnvironment#activeRoute
   */

  /** @ignore */
  defaults: function () {
    this.activeRoute = $router.Route.fromComponents([]);
  },

  /** @ignore */
  init: function () {
    this
    .setListeningPath('route')
    .addTriggerPath('route');
  },

  /**
   * @param {$router.Route} route
   * @returns {$router.RouteEnvironment}
   * @todo Return promise?
   */
  setActiveRoute: function (route) {
    var routeBefore = this.activeRoute;
    if (!routeBefore.equals(route)) {
      this.activeRoute = route;
      this.spawnEvent({
        eventName: $router.EVENT_ROUTE_CHANGE,
        routeBefore: routeBefore,
        routeAfter: route
      })
      .trigger();
    }
    return this;
  }
})
.build();
