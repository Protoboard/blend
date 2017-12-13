"use strict";

var $oop = window['blend-oop'],
    $router = window['blend-router'];

describe("$router", function () {
  describe("Router", function () {
    var Router,
        router;

    beforeAll(function () {
      Router = $oop.createClass('test.$router.Router.Router')
      .blend($router.Router)
      .build();
      Router.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      Router.__builder.instances = {};
      $router.RouteEnvironment.__builder.instances = {};
    });

    it("should be singleton", function () {
      expect(Router.create()).toBe(Router.create());
    });

    describe("create()", function () {
      it("should debounce method navigateToRoute", function () {
        router = Router.create();
        expect(typeof router.navigateToRouteDebounced).toBe('function');
        expect(router.navigateToRouteDebounced.name).toBe('debounced');
      });
    });

    describe("getActiveRoute()", function () {
      beforeEach(function () {
        router = Router.create();
      });

      it("should return activeRoute", function () {
        var result = router.getActiveRoute();
        expect(result).toEqual([].toRoute());
      });
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
