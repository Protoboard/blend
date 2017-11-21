"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("LocaleText", function () {
    var LocaleText,
        localeText;

    beforeAll(function () {
      LocaleText = $oop.getClass('test.$widgets.LocaleText.LocaleText')
      .blend($widgets.LocaleText);
      LocaleText.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromTextTranslatable", function () {
      var translatable;

      beforeEach(function () {
        translatable = "foo".toTranslatable();
      });

      it("should return LocaleText instance", function () {
        localeText = LocaleText.fromTextTranslatable(translatable);
        expect(LocaleText.mixedBy(localeText)).toBeTruthy();
      });

      it("should initialize textTranslatable", function () {
        localeText = LocaleText.fromTextTranslatable(translatable);
        expect(localeText.textTranslatable).toBe(translatable);
      });
    });

    describe("create()", function () {
      var translatable;

      beforeEach(function () {
        translatable = "foo".toTranslatable();
      });

      describe("on invalid textTranslatable", function () {
        it("should throw", function () {
          expect(function () {
            LocaleText.create();
          }).toThrow();
        });
      });

      it("should initialize textTranslatable", function () {
        localeText = LocaleText.create({textTranslatable: translatable});
        expect(localeText.textTranslatable).toBe(translatable);
      });
    });

    describe("_syncToActiveLocale()", function () {
      beforeEach(function () {
        '_translation/helloworld-de'.toDocument().setNode({
          originalString: "Hello World!",
          pluralForms: ["Hallo Welt!"]
        });
        '_locale/de'.toDocument().setNode({
          localeName: 'German',
          pluralFormula: 'nplurals=2; plural=(n != 1);',
          translations: {
            '_translation/helloworld-de': 1
          }
        });
        'de'.toLocale().setAsActiveLocale();

        localeText = LocaleText.create({
          textTranslatable: "Hello World!".toTranslatable()
        });
      });

      afterEach(function () {
        'en'.toLocale().setAsActiveLocale();
        '_translation/helloworld-de'.toDocument().deleteNode();
        '_locale/de'.toDocument().deleteNode();
      });

      it("should set textString", function () {
        localeText._syncToActiveLocale();
        expect(localeText.textString).toBe("Hallo Welt!");
      });
    });
  });
});
