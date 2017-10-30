"use strict";

var $oop = window['blend-oop'],
    $i18n = window['blend-i18n'];

describe("$i18n", function () {
  describe("Locale", function () {
    var Locale,
        locale;

    beforeAll(function () {
      Locale = $oop.getClass('test.$i18n.Locale.Locale')
      .blend($i18n.Locale);
      Locale.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromLocaleKey", function () {
      it("should return Locale instance", function () {
        locale = Locale.fromLocaleKey('foo/bar'.toDocumentKey());
        expect(Locale.mixedBy(locale)).toBeTruthy();
      });

      it("should set localeKey", function () {
        locale = Locale.fromLocaleKey('foo/bar'.toDocumentKey());
        expect(locale.localeKey).toEqual('foo/bar'.toDocumentKey());
      });
    });

    describe("fromLocaleId", function () {
      it("should return Locale instance", function () {
        locale = Locale.fromLocaleId('foo');
        expect(Locale.mixedBy(locale)).toBeTruthy();
      });

      it("should set localeKey", function () {
        locale = Locale.fromLocaleId('foo');
        expect(locale.localeKey).toEqual('_locale/foo'.toDocumentKey());
      });
    });

    describe("create()", function () {
      describe("on missing localeKey property", function () {
        it("should throw", function () {
          expect(function () {
            Locale.create();
          }).toThrow();
        });
      });

      it("should initialize listeningPath", function () {
        locale = Locale.create({
          localeKey: 'foo/bar'.toDocumentKey()
        });
        expect(locale.listeningPath).toBe('locale.bar');
      });

      it("should initialize triggerPaths", function () {
        locale = Locale.create({
          localeKey: 'foo/bar'.toDocumentKey()
        });
        expect(locale.triggerPaths.list).toContain('locale.bar');
      });
    });

    xdescribe("getTranslation()", function () {

    });

    describe("setAsActiveLocale()", function () {
      var localeEnvironment;

      beforeEach(function () {
        locale = Locale.create({
          localeKey: 'foo/bar'.toDocumentKey()
        });
        localeEnvironment = $i18n.LocaleEnvironment.create();
        spyOn(localeEnvironment, 'setActiveLocale');
      });

      it("should return self", function () {
        var result = locale.setAsActiveLocale();
        expect(result).toBe(locale);
      });

      it("should pass self to LocaleEnvironment#setActiveLocale", function () {
        locale.setAsActiveLocale();
        expect(localeEnvironment.setActiveLocale).toHaveBeenCalledWith(locale);
      });
    });
  });
});
