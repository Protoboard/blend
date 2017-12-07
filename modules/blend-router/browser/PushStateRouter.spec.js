"use strict";

var $oop = window['blend-oop'],
    $router = window['blend-router'];

describe("$router", function () {
  describe("PushStateRouter", function () {
    var PushStateRouter,
        pushStateRouter;

    beforeAll(function () {
      PushStateRouter = $oop.createClass('test.$router.PushStateRouter.PushStateRouter')
      .blend($router.PushStateRouter)
      .build();
      PushStateRouter.__builder.forwards = {list: [], lookup: {}};
      $router.browserRoutingMethod = 'pushState';
    });

    beforeEach(function () {
      PushStateRouter.__builder.instances = {};
    });

    it("should be singleton", function () {
      expect(PushStateRouter.create()).toBe(PushStateRouter.create());
    });

    describe("create()", function () {
      var routeEnvironment;

      beforeEach(function () {
        routeEnvironment = $router.RouteEnvironment.create();
        routeEnvironment.setActiveRoute([].toRoute());
        window.history.pushState({}, '', '/foo/bar');
      });

      it("should initialize activeRoute", function () {
        PushStateRouter.create();
        expect(routeEnvironment.activeRoute).toEqual('foo/bar'.toRoute());
      });
    });

    describe("onRouteChange()", function () {
      var event;

      beforeEach(function () {
        event = 'foo/bar'.toRoute().spawnEvent({
          eventName: $router.EVENT_ROUTE_CHANGE,
          routeAfter: 'foo/bar'.toRoute()
        });
        pushStateRouter = PushStateRouter.create();
      });

      it("should push route to history", function () {
        pushStateRouter.onRouteChange(event);
        expect(window.location.pathname).toBe('/foo/bar');
      });
    });

    describe("onPopState()", function () {
      var routeEnvironment,
          popStateEvent;

      beforeEach(function () {
        routeEnvironment = $router.RouteEnvironment.create();
        popStateEvent = {};
        window.history.pushState({}, '', '/foo/bar');
        pushStateRouter = PushStateRouter.create();
        $event.EventTrail.__builder.instances = {};
      });

      afterEach(function () {
        window.history.back();
      });

      describe("when pushing different state than activeRoute", function () {
        beforeEach(function () {
          $router.browserRoutingMethod = undefined;
          routeEnvironment.setActiveRoute('foo/baz'.toRoute());
          $router.browserRoutingMethod = 'pushState';
        });

        it("should set active route", function () {
          pushStateRouter.onPopState(popStateEvent);
          expect(routeEnvironment.activeRoute).toEqual('foo/bar'.toRoute());
        });

        it("should push wrapped DOM event to EventTrail", function () {
          var eventTrail = $event.EventTrail.create();
          pushStateRouter.onPopState(popStateEvent);
          var wrapperEvent = eventTrail.data.previousLink;
          expect(wrapperEvent.eventName).toBe('popStateWrapper');
          expect(wrapperEvent.wrapped).toBe(popStateEvent);
        });
      });

      describe("when pushing equivalent to activeRoute", function () {
        beforeEach(function () {
          routeEnvironment.setActiveRoute('foo/bar'.toRoute());
        });

        it("should not push wrapped DOM event to EventTrail", function () {
          var eventTrail = $event.EventTrail.create();
          pushStateRouter.onPopState(popStateEvent);
          var wrapperEvent = eventTrail.data.previousLink;
          expect(wrapperEvent.eventName).not.toBe('popStateWrapper');
        });
      });
    });
  });

  describe("Router", function () {
    describe("create()", function () {
      var router;

      describe("when in browser env and browserRoutingMethod is 'pushState'", function () {
        beforeEach(function () {
          $router.browserRoutingMethod = 'pushState';
        });

        afterEach(function () {
          $router.browserRoutingMethod = undefined;
        });

        it("should return PushStateRouter instance", function () {
          router = $router.Router.create();
          expect($router.PushStateRouter.mixedBy(router)).toBeTruthy();
        });
      });
    });
  });
});

describe("window", function () {
  var pushStateRouter;

  beforeEach(function () {
    pushStateRouter = $router.PushStateRouter.create();
    $router.browserRoutingMethod = 'pushState';
  });

  afterEach(function () {
    $router.browserRoutingMethod = undefined;
  });

  describe("on popstate", function () {
    beforeEach(function () {
      spyOn(pushStateRouter, 'onPopState');
    });

    it("should invoke PushStateRouter#onPopState", function () {
      window.dispatchEvent(new Event('popstate'));
      expect(pushStateRouter.onPopState).toHaveBeenCalled();
    });
  });
});
