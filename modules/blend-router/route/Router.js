"use strict";

/**
 * @function $router.Router.create
 * @returns {$router.Router}
 */

/**
 * @class $router.Router
 */
$router.Router = $oop.getClass('$router.Router')
.blend($oop.Singleton)
.define(/** @lends $router.Router# */{
  /**
   * Navigates to the specified route.
   * @param {$router.Route} route
   * @returns {$router.Router}
   */
  navigateToRoute: function (route) {
    $router.RouteEnvironment.create().setActiveRoute(route);
    return this;
  },

  /** @ignore */
  onRouteChange: function () {
  }
});

$event.EventSpace.create()
.on($router.EVENT_ROUTE_CHANGE,
    'route',
    $router.Router.__classId,
    function (event) {
      return $router.Router.create().onRouteChange(event);
    });
