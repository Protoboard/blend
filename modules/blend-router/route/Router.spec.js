"use strict";

var $oop = window['blend-oop'],
    $router = window['blend-router'];

describe("$router", function () {
  describe("Router", function () {
    var Router,
        router;

    beforeAll(function () {
      Router = $oop.getClass('test.$router.Router.Router')
      .blend($router.Router);
      Router.__forwards = {list: [], sources: [], lookup: {}};
    });

    beforeEach(function () {
      Router.__instanceLookup = {};
      $router.RouteEnvironment.__instanceLookup = {};
    });

    it("should be singleton", function () {
      expect(Router.create()).toBe(Router.create());
    });

    describe("navigateToRoute()", function () {
      var routeEnvironment,
          route;

      beforeEach(function () {
        router = Router.create();
        routeEnvironment = $router.RouteEnvironment.create();
        route = 'foo'.toRoute();
        spyOn(routeEnvironment, 'setActiveRoute');
      });

      it("should return self", function () {
        var result = router.navigateToRoute(route);
        expect(result).toBe(router);
      });

      it("should invoke RouteEnvironment#setActiveRoute()", function () {
        router.navigateToRoute(route);
        expect(routeEnvironment.setActiveRoute).toHaveBeenCalledWith(route);
      });
    });

    describe("onRouteChange()", function () {
      beforeEach(function () {
        router = $router.Router.create();
        spyOn(router, 'onRouteChange');
      });

      it("should be invoked on EVENT_ROUTE_CHANGE", function () {
        $router.RouteEnvironment.create()
        .trigger($router.EVENT_ROUTE_CHANGE);
        expect(router.onRouteChange).toHaveBeenCalled();
      });
    });
  });
});
