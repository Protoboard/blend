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
    });

    describe("onAttach()", function () {
      describe("when updateByActiveRoute is defined", function () {
        beforeEach(function () {
          RouteBound.define({
            updateByActiveRoute: function () {}
          });
          routeBound = RouteBound.create();
        });

        afterEach(function () {
          routeBound.destroy();
        });

        it("should invoke updateByActiveRoute", function () {
          spyOn(routeBound, 'updateByActiveRoute');
          routeBound.onAttach();
          expect(routeBound.updateByActiveRoute).toHaveBeenCalled();
        });

        it("should subscribe to EVENT_ROUTE_CHANGE", function () {
          routeBound.onAttach();
          spyOn(routeBound, 'updateByActiveRoute');
          $router.RouteEnvironment.create().trigger($router.EVENT_ROUTE_CHANGE);
          expect(routeBound.updateByActiveRoute).toHaveBeenCalled();
        });
      });
    });
  });
});
