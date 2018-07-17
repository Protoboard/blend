"use strict";

var $oop = window['blend-oop'],
    $router = window['blend-router'];

var $data = window['blend-data'];

describe("$router", function () {
  describe("HashRouter", function () {
    var HashRouter,
        hashRouter;

    beforeAll(function () {
      HashRouter = $oop.createClass('test.$router.HashRouter.HashRouter')
      .blend($router.HashRouter)
      .build();
      HashRouter.__builder.forwards = {list: [], lookup: {}};
      $router.browserRoutingMethod = 'hash';
    });

    beforeEach(function () {
      HashRouter.__builder.instances = {};
    });

    it("should be singleton", function () {
      expect(HashRouter.create()).toBe(HashRouter.create());
    });

    describe(".create()", function () {
      var routeEnvironment;

      beforeEach(function () {
        routeEnvironment = $router.RouteEnvironment.create();
        routeEnvironment.setActiveRoute([].toRoute());
        window.location.hash = '#foo/bar';
      });

      it("should initialize activeRoute", function () {
        HashRouter.create();
        expect(routeEnvironment.activeRoute).toEqual('foo/bar'.toRoute());
      });
    });

    describe("#onRouteChange()", function () {
      var event;

      beforeEach(function () {
        event = 'foo/bar'.toRoute().spawnEvent({
          eventName: $router.EVENT_ROUTE_CHANGE,
          routeAfter: 'foo/bar'.toRoute()
        });
        hashRouter = HashRouter.create();
      });

      afterEach(function () {
        window.location.hash = '';
      });

      it("should set location.hash", function () {
        hashRouter.onRouteChange(event);
        expect(window.location.hash).toBe('#foo/bar');
      });
    });

    describe("#onDocumentLoad()", function () {
      var documentLoadEvent;

      beforeEach(function () {
        documentLoadEvent = {};
        window.location.hash = '#foo/bar';
        hashRouter = HashRouter.create();
      });

      afterEach(function () {
        window.location.hash = '';
      });

      it("should set active route", function () {
        var routeEnvironment = $router.RouteEnvironment.create();
        hashRouter.onDocumentLoad(documentLoadEvent);
        expect(routeEnvironment.activeRoute).toEqual('foo/bar'.toRoute());
      });

      it("should push wrapped DOM event to EventTrail", function () {
        var eventTrail = $event.EventTrail.create();
        hashRouter.onDocumentLoad(documentLoadEvent);
        var wrapperEvent = eventTrail.data.previousLink;
        expect(wrapperEvent.eventName).toBe('documentLoadWrapper');
        expect(wrapperEvent.wrapped).toBe(documentLoadEvent);
      });
    });

    describe("#onHashChange()", function () {
      var routeEnvironment,
          hashChangeEvent;

      beforeEach(function () {
        routeEnvironment = $router.RouteEnvironment.create();
        hashChangeEvent = {};
        window.location.hash = '#foo/bar';
        hashRouter = HashRouter.create();
        $event.EventTrail.__builder.instances = {};
      });

      afterEach(function () {
        window.location.hash = '';
      });

      describe("when hash is different than activeRoute", function () {
        beforeEach(function () {
          $router.browserRoutingMethod = undefined;
          routeEnvironment.setActiveRoute('foo/baz'.toRoute());
          $router.browserRoutingMethod = 'hash';
        });

        it("should set active route", function () {
          hashRouter.onHashChange(hashChangeEvent);
          expect(routeEnvironment.activeRoute).toEqual('foo/bar'.toRoute());
        });

        it("should push wrapped DOM event to EventTrail", function () {
          var eventTrail = $event.EventTrail.create();
          hashRouter.onHashChange(hashChangeEvent);
          var wrapperEvent = eventTrail.data.previousLink;
          expect(wrapperEvent.eventName).toBe('hashChangeWrapper');
          expect(wrapperEvent.wrapped).toBe(hashChangeEvent);
        });
      });

      describe("when hash is equal to activeRoute", function () {
        beforeEach(function () {
          routeEnvironment.setActiveRoute('foo/bar'.toRoute());
        });

        it("should not push wrapped DOM event to EventTrail", function () {
          var eventTrail = $event.EventTrail.create();
          hashRouter.onHashChange(hashChangeEvent);
          var wrapperEvent = eventTrail.data.previousLink;
          expect(wrapperEvent.eventName).not.toBe('hashChangeWrapper');
        });
      });
    });
  });

  describe("Router", function () {
    describe(".create()", function () {
      var router;

      describe("when in browser env and browserRoutingMethod is 'hash'", function () {
        beforeEach(function () {
          $router.browserRoutingMethod = 'hash';
        });

        afterEach(function () {
          $router.browserRoutingMethod = undefined;
        });

        it("should return HashRouter instance", function () {
          router = $router.Router.create();
          expect($router.HashRouter.mixedBy(router)).toBeTruthy();
        });
      });
    });
  });
});

describe("document", function () {
  var hashRouter;

  beforeEach(function () {
    hashRouter = $router.HashRouter.create();
    $router.browserRoutingMethod = 'hash';
  });

  afterEach(function () {
    $router.browserRoutingMethod = undefined;
  });

  describe("on DOMContentLoaded", function () {
    beforeEach(function () {
      spyOn(hashRouter, 'onDocumentLoad');
    });

    it("should invoke HashRouter#onDocumentLoad", function () {
      document.dispatchEvent(new Event('DOMContentLoaded'));
      expect(hashRouter.onDocumentLoad).toHaveBeenCalled();
    });
  });
});

describe("window", function () {
  var hashRouter;

  beforeEach(function () {
    hashRouter = $router.HashRouter.create();
    $router.browserRoutingMethod = 'hash';
  });

  afterEach(function () {
    $router.browserRoutingMethod = undefined;
  });

  describe("on hashchange", function () {
    beforeEach(function () {
      spyOn(hashRouter, 'onHashChange');
    });

    it("should invoke HashRouter#onDocumentLoad", function () {
      window.dispatchEvent(new Event('hashchange'));
      expect(hashRouter.onHashChange).toHaveBeenCalled();
    });
  });
});
