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
      describe("when syncToActiveLocale is defined", function () {
        beforeEach(function () {
          LocaleBound.define({
            syncToActiveLocale: function () {}
          });
          localeBound = LocaleBound.create();
        });

        afterEach(function () {
          localeBound.destroy();
        });

        it("should invoke syncToActiveLocale", function () {
          spyOn(localeBound, 'syncToActiveLocale');
          localeBound.onAttach();
          expect(localeBound.syncToActiveLocale).toHaveBeenCalled();
        });

        it("should subscribe to EVENT_LOCALE_CHANGE", function () {
          localeBound.onAttach();
          spyOn(localeBound, 'syncToActiveLocale');
          'foo'.toLocale().trigger($i18n.EVENT_LOCALE_CHANGE);
          expect(localeBound.syncToActiveLocale).toHaveBeenCalled();
        });
      });

      describe("when syncToActiveTranslations is defined", function () {
        beforeEach(function () {
          LocaleBound.define({
            syncToActiveTranslations: function () {}
          });
          localeBound = LocaleBound.create();
        });

        afterEach(function () {
          localeBound.destroy();
        });

        it("should invoke syncToActiveTranslations", function () {
          spyOn(localeBound, 'syncToActiveTranslations');
          localeBound.onAttach();
          expect(localeBound.syncToActiveTranslations).toHaveBeenCalled();
        });

        it("should subscribe to EVENT_ACTIVE_TRANSLATIONS_CHANGE", function () {
          localeBound.onAttach();
          spyOn(localeBound, 'syncToActiveTranslations');
          'foo'.toLocale().trigger($i18n.EVENT_ACTIVE_TRANSLATIONS_CHANGE);
          expect(localeBound.syncToActiveTranslations).toHaveBeenCalled();
        });
      });
    });
  });
});
