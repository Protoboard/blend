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
      .blend($widgets.ModuleBound);
      ModuleBound.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("onAttach()", function () {
      beforeEach(function () {
        ModuleBound.define({
          onModuleAvailable: function () {}
        });
        moduleBound = ModuleBound.create();
      });

      afterEach(function () {
        moduleBound.destroy();
      });

      it("should subscribe to EVENT_LOCALE_CHANGE", function () {
        moduleBound.onAttach();
        expect(moduleBound.subscribes(
            $module.EVENT_MODULE_AVAILABLE,
            $module.ModuleEnvironment.create())).toBeTruthy();
      });
    });
  });
});
