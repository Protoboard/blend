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
      describe("when updateByAvailableModules is defined", function () {
        beforeEach(function () {
          ModuleBound.define({
            updateByAvailableModules: function () {}
          });
          moduleBound = ModuleBound.create();
        });

        afterEach(function () {
          moduleBound.destroy();
        });

        it("should invoke updateByAvailableModules", function () {
          spyOn(moduleBound, 'updateByAvailableModules');
          moduleBound.onAttach();
          expect(moduleBound.updateByAvailableModules).toHaveBeenCalled();
        });

        it("should subscribe to EVENT_LOCALE_CHANGE", function () {
          moduleBound.onAttach();
          spyOn(moduleBound, 'updateByAvailableModules');
          'foo'.toModule().trigger($module.EVENT_MODULE_AVAILABLE);
          expect(moduleBound.updateByAvailableModules).toHaveBeenCalled();
        });
      });
    });
  });
});
