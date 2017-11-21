"use strict";

var $oop = window['blend-oop'],
    $module = window['blend-module'],
    $widget = window['blend-widget'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("ModuleBound", function () {
    var ModuleBound,
        moduleBound;

    beforeAll(function () {
      ModuleBound = $oop.getClass('test.$ui.ModuleBound.ModuleBound')
      .blend($widget.Widget)
      .blend($ui.ModuleBound);
      ModuleBound.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("onAttach()", function () {
      beforeEach(function () {
        moduleBound = ModuleBound.create();
      });

      afterEach(function () {
        moduleBound.destroy();
      });

      it("should invoke _syncToAvailableModules", function () {
        spyOn(moduleBound, '_syncToAvailableModules');
        moduleBound.onAttach();
        expect(moduleBound._syncToAvailableModules).toHaveBeenCalled();
      });

      it("should subscribe to EVENT_LOCALE_CHANGE", function () {
        moduleBound.onAttach();
        spyOn(moduleBound, '_syncToAvailableModules');
        'foo'.toModule().trigger($module.EVENT_MODULE_AVAILABLE);
        expect(moduleBound._syncToAvailableModules).toHaveBeenCalled();
      });
    });
  });
});
