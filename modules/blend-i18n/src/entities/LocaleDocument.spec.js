"use strict";

var $assert = window['blend-assert'],
    $oop = window['blend-oop'],
    $entity = window['blend-entity'],
    $i18n = window['blend-i18n'];

describe("$assert", function () {
  var pluralFormula;

  beforeEach(function () {
    pluralFormula = 'nplurals=2; plural=(n != 1);';
    spyOn($assert, 'assert').and.callThrough();
  });

  describe("#isPluralFormula()", function () {
    it("should pass message to assert", function () {
      $assert.isPluralFormula(pluralFormula, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing other than plural formula", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isPluralFormula('bar');
        }).toThrow();
      });
    });
  });

  describe("#isPluralFormulaOptional()", function () {
    it("should pass message to assert", function () {
      $assert.isPluralFormulaOptional(pluralFormula, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing undefined", function () {
      it("should not throw", function () {
        expect(function () {
          $assert.isPluralFormulaOptional();
        }).not.toThrow();
      });
    });

    describe("when passing other than plural formula", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isPluralFormulaOptional('bar');
        }).toThrow();
      });
    });
  });
});

describe("$i18n", function () {
  describe("LocaleDocument", function () {
    var LocaleDocument,
        localeDocument;

    beforeAll(function () {
      LocaleDocument = $oop.createClass('test.$i18n.LocaleDocument.LocaleDocument')
      .blend($i18n.LocaleDocument)
      .build();
      LocaleDocument.__builder.forwards = {list: [], lookup: {}};
    });

    describe("#setLocaleName()", function () {
      beforeEach(function () {
        localeDocument = LocaleDocument.fromEntityKey('_locale/bar'.toDocumentKey());
        localeDocument.deleteNode();
      });

      it("should return self", function () {
        var result = localeDocument.setLocaleName('baz');
        expect(result).toBe(localeDocument);
      });

      it("should set localeName field", function () {
        localeDocument.setLocaleName('baz');
        var path = 'document._locale.bar.localeName'.toTreePath();
        expect($entity.entities.getNode(path)).toBe('baz');
      });
    });

    describe("#getLocaleName()", function () {
      beforeEach(function () {
        localeDocument = LocaleDocument.fromEntityKey('_locale/bar'.toDocumentKey());
        localeDocument.setNode({
          localeName: 'baz'
        });
      });

      it("should return localeName field node", function () {
        expect(localeDocument.getLocaleName()).toBe('baz');
      });
    });

    describe("#setCountryCode()", function () {
      beforeEach(function () {
        localeDocument = LocaleDocument.fromEntityKey('_locale/bar'.toDocumentKey());
        localeDocument.deleteNode();
      });

      it("should return self", function () {
        var result = localeDocument.setCountryCode('baz');
        expect(result).toBe(localeDocument);
      });

      it("should set localeName field", function () {
        localeDocument.setCountryCode('baz');
        var path = 'document._locale.bar.countryCode'.toTreePath();
        expect($entity.entities.getNode(path)).toBe('baz');
      });
    });

    describe("#getCountryCode()", function () {
      beforeEach(function () {
        localeDocument = LocaleDocument.fromEntityKey('_locale/bar'.toDocumentKey());
        localeDocument.setNode({
          countryCode: 'baz'
        });
      });

      it("should return countryCode field node", function () {
        expect(localeDocument.getCountryCode()).toBe('baz');
      });
    });

    describe("#setLanguageCode()", function () {
      beforeEach(function () {
        localeDocument = LocaleDocument.fromEntityKey('_locale/bar'.toDocumentKey());
        localeDocument.deleteNode();
      });

      it("should return self", function () {
        var result = localeDocument.setLanguageCode('baz');
        expect(result).toBe(localeDocument);
      });

      it("should set localeName field", function () {
        localeDocument.setLanguageCode('baz');
        var path = 'document._locale.bar.languageCode'.toTreePath();
        expect($entity.entities.getNode(path)).toBe('baz');
      });
    });

    describe("#getLanguageCode()", function () {
      beforeEach(function () {
        localeDocument = LocaleDocument.fromEntityKey('_locale/bar'.toDocumentKey());
        localeDocument.setNode({
          languageCode: 'baz'
        });
      });

      it("should return countryCode field node", function () {
        expect(localeDocument.getLanguageCode()).toBe('baz');
      });
    });

    describe("#setPluralFormula()", function () {
      var pluralFormula;

      beforeEach(function () {
        pluralFormula = 'nplurals=2; plural=(n != 1);';
        localeDocument = LocaleDocument.fromEntityKey('_locale/bar'.toDocumentKey());
        localeDocument.deleteNode();
      });

      describe("when passing invalid pluralFormula", function () {
        it("should throw", function () {
          expect(function () {
            localeDocument.setPluralFormula('baz');
          }).toThrow();
        });
      });

      it("should return self", function () {
        var result = localeDocument.setPluralFormula(pluralFormula);
        expect(result).toBe(localeDocument);
      });

      it("should set localeName field", function () {
        localeDocument.setPluralFormula(pluralFormula);
        var path = 'document._locale.bar.pluralFormula'.toTreePath();
        expect($entity.entities.getNode(path)).toBe(pluralFormula);
      });
    });

    describe("#getPluralFormula()", function () {
      var pluralFormula;

      beforeEach(function () {
        pluralFormula = 'nplurals=2; plural=(n != 1);';
        localeDocument = LocaleDocument.fromEntityKey('_locale/bar'.toDocumentKey());
        localeDocument.setNode({
          pluralFormula: pluralFormula
        });
      });

      it("should return countryCode field node", function () {
        expect(localeDocument.getPluralFormula()).toBe(pluralFormula);
      });
    });

    describe("#addTranslationKey()", function () {
      beforeEach(function () {
        localeDocument = LocaleDocument.fromEntityKey('_locale/bar'.toDocumentKey());
        localeDocument.deleteNode();
      });

      it("should return self", function () {
        var result = localeDocument.addTranslationKey('_translation/quux'.toDocumentKey());
        expect(result).toBe(localeDocument);
      });

      it("should set reference in translations field", function () {
        localeDocument.addTranslationKey('_translation/quux'.toDocumentKey());
        var path = 'document._locale.bar.translations'.toTreePath();
        expect($entity.entities.getNode(path)).toEqual({
          '_translation/quux': 1
        });
      });
    });

    describe("#hasTranslationKey()", function () {
      beforeEach(function () {
        localeDocument = LocaleDocument.fromEntityKey('_locale/bar'.toDocumentKey());
      });

      describe("for present translation reference", function () {
        beforeEach(function () {
          localeDocument.setNode({
            translations: {
              'baz/quux': 1
            }
          });
        });

        it("should return truthy", function () {
          expect(localeDocument.hasTranslationKey('_locale/bar'.toDocumentKey()))
          .toBeTruthy();
        });
      });

      describe("for absent translation reference", function () {
        beforeEach(function () {
          localeDocument.setNode({});
        });

        it("should return falsy", function () {
          expect(localeDocument.hasTranslationKey('_locale/bar'.toDocumentKey()))
          .toBeFalsy();
        });
      });
    });
  });
});

describe("$entity", function () {
  describe("Document", function () {
    describe(".create()", function () {
      var document;

      describe("when documentType is '_locale'", function () {
        it("should return LocaleDocument instance", function () {
          document = $entity.Document.fromEntityKey('_locale/foo'.toDocumentKey());
          expect($i18n.LocaleDocument.mixedBy(document)).toBeTruthy();
        });
      });
    });
  });
});
