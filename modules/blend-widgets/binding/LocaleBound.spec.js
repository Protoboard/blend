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
        LocaleBound.define({
          onLocaleChange: function () {},
          onActiveTranslationsChange: function () {}
        });
        localeBound = LocaleBound.create();
      });

      afterEach(function () {
        localeBound.destroy();
      });

      it("should subscribe to EVENT_LOCALE_CHANGE", function () {
        localeBound.onAttach();
        expect(localeBound.subscribes(
            $i18n.EVENT_LOCALE_CHANGE,
            $i18n.LocaleEnvironment.create())).toBeTruthy();
      });

      it("should subscribe to EVENT_ACTIVE_TRANSLATIONS_CHANGE", function () {
        localeBound.onAttach();
        expect(localeBound.subscribes(
            $i18n.EVENT_ACTIVE_TRANSLATIONS_CHANGE,
            $i18n.LocaleEnvironment.create())).toBeTruthy();
      });
    });
  });
});
