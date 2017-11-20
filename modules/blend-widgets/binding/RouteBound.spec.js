"use strict";

var $oop = window['blend-oop'],
    $router = window['blend-router'],
    $widget = window['blend-widget'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("RouteBound", function () {
    var RouteBound,
        routeBound;

    beforeAll(function () {
      RouteBound = $oop.getClass('test.$widgets.RouteBound.RouteBound')
      .blend($widget.Widget)
      .blend($widgets.RouteBound);
      RouteBound.__forwards = {list: [], sources: [], lookup: {}};
      $router.browserRoutingMethod = undefined;
    });

    afterAll(function () {
      $router.browserRoutingMethod = 'hash';
    });

    describe("onAttach()", function () {
      beforeEach(function () {
        routeBound = RouteBound.create();
      });

      afterEach(function () {
        routeBound.destroy();
      });

      it("should invoke syncToActiveRoute", function () {
        spyOn(routeBound, 'syncToActiveRoute');
        routeBound.onAttach();
        expect(routeBound.syncToActiveRoute).toHaveBeenCalled();
      });

      it("should subscribe to EVENT_ROUTE_CHANGE", function () {
        routeBound.onAttach();
        spyOn(routeBound, 'syncToActiveRoute');
        $router.RouteEnvironment.create().trigger($router.EVENT_ROUTE_CHANGE);
        expect(routeBound.syncToActiveRoute).toHaveBeenCalled();
      });
    });
  });
});
