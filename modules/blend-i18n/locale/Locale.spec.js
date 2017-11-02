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
    });

    describe("getTranslation()", function () {
      var translationIndexData;

      beforeEach(function () {
        translationIndexData = $entity.index.data._translation;
        $entity.index.data._translation = {};
        $i18n.TranslationIndex.__instanceLookup = {};
        $i18n.Locale.__instanceLookup = {};

        '_translation/bill-1-de'.toDocument().setNode({
          originalString: "bill",
          pluralForms: ["Gesetzentwurf", "Gesetzentwürfe"],
          context: "legislation"
        });
        '_translation/bill-2-de'.toDocument().setNode({
          originalString: "bill",
          pluralForms: ["Rechnung", "Rechnungen"]
        });
        '_locale/de'.toDocument().setNode({
          localeName: 'German',
          pluralFormula: 'nplurals=2; plural=(n != 1);',
          translations: {
            '_translation/bill-1-de': 1,
            '_translation/bill-2-de': 1
          }
        });
        '_locale/fr'.toDocument().deleteNode();

        locale = 'de'.toLocale();
      });

      afterEach(function () {
        $entity.index.data._translation = translationIndexData;
      });

      it("should retrieve translation from index", function () {
        expect(locale.getTranslation('bill', 'legislation', 1))
        .toBe("Gesetzentwurf");
        expect(locale.getTranslation('bill', 'legislation', 10))
        .toBe("Gesetzentwürfe");
        expect(locale.getTranslation('bill', null, 1)).toBe("Rechnung");
        expect(locale.getTranslation('bill', null, 10)).toBe("Rechnungen");
      });

      describe("when plural formula is not specified", function () {
        beforeEach(function () {
          '_locale/de/pluralFormula'.toField().deleteNode();
        });

        it("should return pluralIndex 0", function () {
          expect(locale.getTranslation('bill', 'legislation', 10))
          .toBe("Gesetzentwurf");
          expect(locale.getTranslation('bill', null, 10))
          .toBe("Rechnung");
        });
      });

      describe("when specified context is not found", function () {
        it("should return translation for default context", function () {
          expect(locale.getTranslation('bill', 'restaurant', 1))
          .toBe("Rechnung");
          expect(locale.getTranslation('bill', 'restaurant', 10))
          .toBe("Rechnungen");
        });
      });

      describe("when translation is not found", function () {
        it("should return originalString", function () {
          expect('fr'.toLocale().getTranslation('bill', 'legislation', 1))
          .toBe("bill");
          expect('fr'.toLocale().getTranslation('bill', 'legislation', 10))
          .toBe("bill");
        });
      });
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

describe("String", function () {
  var result;

  describe("toLocale()", function () {
    var locale;

    beforeEach(function () {
      locale = $i18n.Locale.fromLocaleId('foo');
      spyOn($i18n.Locale, 'create').and.returnValue(locale);
    });

    it("should create a Locale instance", function () {
      result = 'foo'.toLocale();
      expect($i18n.Locale.create).toHaveBeenCalledWith({
        localeKey: '_locale/foo'.toDocumentKey()
      });
    });

    it("should return created instance", function () {
      result = 'foo'.toLocale();
      expect(result).toBe(locale);
    });
  });
});
