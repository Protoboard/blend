"use strict";

var $oop = window['blend-oop'],
    $i18n = window['blend-i18n'],
    $widget = window['blend-widget'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("LocaleBound", function () {
    var LocaleBound,
        localeBound;

    beforeAll(function () {
      LocaleBound = $oop.getClass('test.$widgets.LocaleBound.LocaleBound')
      .blend($widget.Widget)
      .blend($widgets.LocaleBound);
      LocaleBound.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("onAttach()", function () {
      describe("when updateByActiveLocale is defined", function () {
        beforeEach(function () {
          LocaleBound.define({
            updateByActiveLocale: function () {}
          });
          localeBound = LocaleBound.create();
        });

        afterEach(function () {
          localeBound.destroy();
        });

        it("should invoke updateByActiveLocale", function () {
          spyOn(localeBound, 'updateByActiveLocale');
          localeBound.onAttach();
          expect(localeBound.updateByActiveLocale).toHaveBeenCalled();
        });

        it("should subscribe to EVENT_LOCALE_CHANGE", function () {
          localeBound.onAttach();
          spyOn(localeBound, 'updateByActiveLocale');
          'foo'.toLocale().trigger($i18n.EVENT_LOCALE_CHANGE);
          expect(localeBound.updateByActiveLocale).toHaveBeenCalled();
        });
      });

      describe("when updateByActiveTranslations is defined", function () {
        beforeEach(function () {
          LocaleBound.define({
            updateByActiveTranslations: function () {}
          });
          localeBound = LocaleBound.create();
        });

        afterEach(function () {
          localeBound.destroy();
        });

        it("should invoke updateByActiveTranslations", function () {
          spyOn(localeBound, 'updateByActiveTranslations');
          localeBound.onAttach();
          expect(localeBound.updateByActiveTranslations).toHaveBeenCalled();
        });

        it("should subscribe to EVENT_ACTIVE_TRANSLATIONS_CHANGE", function () {
          localeBound.onAttach();
          spyOn(localeBound, 'updateByActiveTranslations');
          'foo'.toLocale().trigger($i18n.EVENT_ACTIVE_TRANSLATIONS_CHANGE);
          expect(localeBound.updateByActiveTranslations).toHaveBeenCalled();
        });
      });
    });
  });
});
