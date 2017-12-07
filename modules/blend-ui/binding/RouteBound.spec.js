"use strict";

var $oop = window['blend-oop'],
    $router = window['blend-router'],
    $widget = window['blend-widget'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("RouteBound", function () {
    var RouteBound,
        routeBound;

    beforeAll(function () {
      RouteBound = $oop.createClass('test.$ui.RouteBound.RouteBound')
      .blend($widget.Widget)
      .blend($ui.RouteBound)
      .build();
      RouteBound.__builder.forwards = {list: [], lookup: {}};
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

      it("should invoke _syncToActiveRoute", function () {
        spyOn(routeBound, '_syncToActiveRoute');
        routeBound.onAttach();
        expect(routeBound._syncToActiveRoute).toHaveBeenCalled();
      });

      it("should subscribe to EVENT_ROUTE_CHANGE", function () {
        routeBound.onAttach();
        spyOn(routeBound, '_syncToActiveRoute');
        $router.RouteEnvironment.create().trigger($router.EVENT_ROUTE_CHANGE);
        expect(routeBound._syncToActiveRoute).toHaveBeenCalled();
      });
    });
  });
});
