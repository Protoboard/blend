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
      .blend($widgets.LocaleBound)
      .define({
        onLocaleChange: function () {},
        onActiveTranslationsChange: function () {}
      });
      LocaleBound.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("onAttach()", function () {
      beforeEach(function () {
        localeBound = LocaleBound.create();
        spyOn(localeBound, 'onLocaleChange');
        spyOn(localeBound, 'onActiveTranslationsChange');
        localeBound.onAttach();
      });

      afterEach(function () {
        localeBound.destroy();
      });

      it("should subscribe to EVENT_LOCALE_CHANGE", function () {
        'foo'.toLocale().trigger($i18n.EVENT_LOCALE_CHANGE);
        expect(localeBound.onLocaleChange).toHaveBeenCalled();
      });

      it("should subscribe to EVENT_LOCALE_CHANGE", function () {
        'foo'.toLocale().trigger($i18n.EVENT_ACTIVE_TRANSLATIONS_CHANGE);
        expect(localeBound.onActiveTranslationsChange).toHaveBeenCalled();
      });
    });
  });
});
