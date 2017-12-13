"use strict";

var $oop = window['blend-oop'],
    $router = window['blend-router'];

describe("$router", function () {
  describe("RouteEnvironment", function () {
    var RouteEnvironment,
        routeEnvironment;

    beforeAll(function () {
      RouteEnvironment = $oop.createClass('test.$router.RouteEnvironment.RouteEnvironment')
      .blend($router.RouteEnvironment)
      .build();
      RouteEnvironment.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      RouteEnvironment.__builder.instances = {};
    });

    it("should be singleton", function () {
      expect(RouteEnvironment.create()).toBe(RouteEnvironment.create());
    });

    describe("create()", function () {
      it("should initialize activeRoute", function () {
        routeEnvironment = RouteEnvironment.create();
        expect(routeEnvironment.activeRoute).toEqual([].toRoute());
      });

      it("should initialize listeningPath", function () {
        routeEnvironment = RouteEnvironment.create();
        expect(routeEnvironment.listeningPath).toBe('route');
      });

      it("should initialize triggerPaths", function () {
        routeEnvironment = RouteEnvironment.create();
        expect(routeEnvironment.triggerPaths.list).toContain('route');
      });
    });

    describe("setActiveRoute()", function () {
      beforeEach(function () {
        routeEnvironment = RouteEnvironment.create();
      });

      it("should return self", function () {
        var result = routeEnvironment.setActiveRoute('foo'.toRoute());
        expect(result).toBe(routeEnvironment);
      });

      describe("when passing different route", function () {
        var route;

        beforeEach(function () {
          route = 'foo'.toRoute();
          spyOn($router.RouteChangeEvent, 'trigger');
        });

        it("should set activeRoute", function () {
          routeEnvironment.setActiveRoute(route);
          expect(routeEnvironment.activeRoute).toBe(route);
        });

        it("should trigger EVENT_ROUTE_CHANGE", function () {
          routeEnvironment.setActiveRoute(route);
          var calls = $router.RouteChangeEvent.trigger.calls.all();
          expect(calls.length).toBe(1);
          expect(calls[0].object).toEqual($router.RouteChangeEvent.create({
            eventName: $router.EVENT_ROUTE_CHANGE,
            sender: routeEnvironment,
            targetPaths: ['route'],
            routeBefore: [].toRoute(),
            routeAfter: route
          }));
        });
      });
    });
  });
});
