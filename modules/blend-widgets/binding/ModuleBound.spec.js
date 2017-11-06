"use strict";

var $oop = window['blend-oop'],
    $module = window['blend-module'],
    $widget = window['blend-widget'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("ModuleBound", function () {
    var ModuleBound,
        moduleBound;

    beforeAll(function () {
      ModuleBound = $oop.getClass('test.$widgets.ModuleBound.ModuleBound')
      .blend($widget.Widget)
      .blend($widgets.ModuleBound)
      .define({
        onModuleAvailable: function () {
        }
      });
      ModuleBound.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("onAttach()", function () {
      beforeEach(function () {
        moduleBound = ModuleBound.create();
        spyOn(moduleBound, 'onModuleAvailable');
        moduleBound.onAttach();
      });

      afterEach(function () {
        moduleBound.destroy();
      });

      it("should subscribe to EVENT_MODULE_AVAILABLE", function () {
        'foo'.toModule().markAsAvailable();
        expect(moduleBound.onModuleAvailable).toHaveBeenCalled();
      });
    });
  });
});
