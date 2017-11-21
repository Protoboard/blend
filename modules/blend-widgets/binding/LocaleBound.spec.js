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
      beforeEach(function () {
        localeBound = LocaleBound.create();
      });

      afterEach(function () {
        localeBound.destroy();
      });

      it("should invoke _syncToActiveLocale", function () {
        spyOn(localeBound, '_syncToActiveLocale');
        localeBound.onAttach();
        expect(localeBound._syncToActiveLocale).toHaveBeenCalled();
      });

      it("should subscribe to EVENT_LOCALE_CHANGE", function () {
        localeBound.onAttach();
        spyOn(localeBound, '_syncToActiveLocale');
        'foo'.toLocale().trigger($i18n.EVENT_LOCALE_CHANGE);
        expect(localeBound._syncToActiveLocale).toHaveBeenCalled();
      });

      beforeEach(function () {
        localeBound = LocaleBound.create();
      });

      afterEach(function () {
        localeBound.destroy();
      });

      it("should invoke _syncToActiveTranslations", function () {
        spyOn(localeBound, '_syncToActiveTranslations');
        localeBound.onAttach();
        expect(localeBound._syncToActiveTranslations).toHaveBeenCalled();
      });

      it("should subscribe to EVENT_ACTIVE_TRANSLATIONS_CHANGE", function () {
        localeBound.onAttach();
        spyOn(localeBound, '_syncToActiveTranslations');
        'foo'.toLocale().trigger($i18n.EVENT_ACTIVE_TRANSLATIONS_CHANGE);
        expect(localeBound._syncToActiveTranslations).toHaveBeenCalled();
      });
    });
  });
});
