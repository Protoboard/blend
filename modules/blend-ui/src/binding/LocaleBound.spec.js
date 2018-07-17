"use strict";

var $oop = window['blend-oop'],
    $i18n = window['blend-i18n'],
    $widget = window['blend-widget'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("LocaleBound", function () {
    var LocaleBound,
        localeBound;

    beforeAll(function () {
      LocaleBound = $oop.createClass('test.$ui.LocaleBound.LocaleBound')
      .blend($widget.Widget)
      .blend($ui.LocaleBound)
      .build();
      LocaleBound.__builder.forwards = {list: [], lookup: {}};
    });

    describe("#onAttach()", function () {
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
