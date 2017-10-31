"use strict";

var $oop = window['blend-oop'],
    $i18n = window['blend-i18n'];

describe("$i18n", function () {
  describe("ActiveTranslationsWatcher", function () {
    var ActiveTranslationsWatcher,
        activeTranslationsWatcher;

    beforeAll(function () {
      ActiveTranslationsWatcher = $oop.getClass('test.$i18n.ActiveTranslationsWatcher.ActiveTranslationsWatcher')
      .blend($i18n.ActiveTranslationsWatcher);
      ActiveTranslationsWatcher.__forwards = {
        list: [],
        sources: [],
        lookup: {}
      };
    });

    it("should be singleton", function () {
      expect(ActiveTranslationsWatcher.create())
      .toBe(ActiveTranslationsWatcher.create());
    });

    describe("create()", function () {
      it("should initialize listeningPath", function () {
        activeTranslationsWatcher = ActiveTranslationsWatcher.create();
        expect(activeTranslationsWatcher.listeningPath)
        .toBe('entity.document.__document._locale');
      });
    });

    describe("onTranslationsChange()", function () {
      beforeEach(function () {
        activeTranslationsWatcher = ActiveTranslationsWatcher.create();
      });

      describe("when affected locale is active locale", function () {
        var localeEnvironment;

        beforeEach(function () {
          localeEnvironment = $i18n.LocaleEnvironment.create();
          localeEnvironment.setActiveLocale('en-us'.toLocale());
          spyOn(localeEnvironment, 'trigger');
        });

        it("should trigger EVENT_ACTIVE_TRANSLATIONS_CHANGE", function () {
          '_locale/en-us'.toDocument().trigger($i18n.EVENT_TRANSLATIONS_CHANGE);
          expect(localeEnvironment.trigger)
          .toHaveBeenCalledWith('i18n.change.activeTranslations');
        });
      });

      describe("when affected locale is not active locale", function () {
        var localeEnvironment;

        beforeEach(function () {
          localeEnvironment = $i18n.LocaleEnvironment.create();
          localeEnvironment.setActiveLocale('en-gb'.toLocale());
          spyOn(localeEnvironment, 'trigger');
        });

        it("should not trigger EVENT_ACTIVE_TRANSLATIONS_CHANGE", function () {
          '_locale/en-us'.toDocument().trigger($i18n.EVENT_TRANSLATIONS_CHANGE);
          expect(localeEnvironment.trigger)
          .not.toHaveBeenCalledWith('i18n.change.activeTranslations');
        });
      });
    });

    describe("onLocaleChange()", function () {
      beforeEach(function () {
        activeTranslationsWatcher = ActiveTranslationsWatcher.create();
      });

      describe("when locale changes", function () {
        var localeEnvironment;

        beforeEach(function () {
          localeEnvironment = $i18n.LocaleEnvironment.create();
          spyOn(localeEnvironment, 'trigger').and.callThrough();
        });

        it("should trigger EVENT_ACTIVE_TRANSLATIONS_CHANGE", function () {
          localeEnvironment.trigger($i18n.EVENT_LOCALE_CHANGE);
          var calls = localeEnvironment.trigger.calls.all();
          expect(calls[0].args).toEqual(['i18n.change.locale']);
          expect(calls[1].args).toEqual(['i18n.change.activeTranslations']);
        });
      });
    });
  });
});
