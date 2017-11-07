"use strict";

/**
 * @function $router.Router.create
 * @returns {$router.Router}
 */

/**
 * Maintains application route state.
 * @class $router.Router
 */
$router.Router = $oop.getClass('$router.Router')
.blend($oop.Singleton)
.define(/** @lends $router.Router# */{
  /** @ignore */
  init: function () {
    this.elevateMethods('navigateToRoute');
    this.navigateToRouteDebounced = $utils.debounce(this.navigateToRoute);
  },

  /**
   * @returns {$router.Route}
   */
  getActiveRoute: function () {
    return $router.RouteEnvironment.create().activeRoute;
  },

  /**
   * Navigates to the specified route synchronously.
   * @param {$router.Route} route
   * @returns {$router.Router}
   */
  navigateToRoute: function (route) {
    $router.RouteEnvironment.create().setActiveRoute(route);
    return this;
  },

  /**
   * Navigates to the specified route debounced.
   * @function $router.Router#navigateToRouteDebounced
   * @param {$router.Route} route
   * @returns {$utils.Promise}
   */

  /**
   * Reserved for extensions.
   * @ignore
   */
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
