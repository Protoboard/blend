"use strict";

var $oop = window['blend-oop'],
    $i18n = window['blend-i18n'];

describe("$i18n", function () {
  describe("Translatable", function () {
    var Translatable,
        translatable;

    beforeAll(function () {
      Translatable = $oop.createClass('test.$i18n.Translatable.Translatable')
      .blend($i18n.Translatable)
      .build();
      Translatable.__builder.forwards = {list: [], lookup: {}};
    });

    describe("fromString()", function () {
      it("should return Translatable instance", function () {
        translatable = Translatable.fromString('foo');
        expect(Translatable.mixedBy(translatable)).toBeTruthy();
      });

      it("should set properties", function () {
        translatable = Translatable.fromString('foo');
        expect(translatable.originalString).toBe('foo');
      });

      it("should pass additional properties to create", function () {
        translatable = Translatable.fromString('foo', {bar: 'baz'});
        expect(translatable.bar).toBe('baz');
      });
    });

    describe("create()", function () {
      describe("when originalString is not specified", function () {
        it("should throw", function () {
          expect(function () {
            Translatable.create();
          }).toThrow();
        });
      });

      it("should initialize context", function () {
        translatable = Translatable.create({originalString: 'foo'});
        expect(translatable.context).toBeNull();
      });

      it("should initialize count", function () {
        translatable = Translatable.create({originalString: 'foo'});
        expect(translatable.count).toBe(1);
      });
    });

    describe("setCount()", function () {
      beforeEach(function () {
        translatable = Translatable.fromString('foo');
      });

      it("should return self", function () {
        var result = translatable.setCount(5);
        expect(result).toBe(translatable);
      });

      it("should set context", function () {
        translatable.setCount(5);
        expect(translatable.count).toBe(5);
      });
    });

    describe("setContext()", function () {
      beforeEach(function () {
        translatable = Translatable.fromString('foo');
      });

      it("should return self", function () {
        var result = translatable.setContext('bar');
        expect(result).toBe(translatable);
      });

      it("should set context", function () {
        translatable.setContext('bar');
        expect(translatable.context).toBe('bar');
      });
    });

    describe("toString()", function () {
      var translationIndexData;

      beforeEach(function () {
        translationIndexData = $entity.index.data._translation;
        $entity.index.data._translation = {};
        $i18n.TranslationIndex.__builder.instances = {};

        '_translation/apple-de'.toDocument().setNode({
          originalString: "apple",
          pluralForms: ["Apfel", "Äpfel"]
        });
        '_locale/de'.toDocument().setNode({
          localeName: 'German',
          pluralFormula: 'nplurals=2; plural=(n != 1);',
          translations: {
            '_translation/apple-de': 1
          }
        });

        'de'.toLocale().setAsActiveLocale();
      });

      afterEach(function () {
        $entity.index.data._translation = translationIndexData;
      });

      it("should return translated string", function () {
        translatable = Translatable.fromString('apple', {count: 2});
        expect(translatable.toString()).toBe("Äpfel");
      });

      describe("when there is no active locale set", function () {
        beforeEach(function () {
          '_localeEnvironment//activeLocale'.toField().deleteNode();
        });

        it("should return originalString", function () {
          translatable = Translatable.fromString('apple', {count: 2});
          expect(translatable.toString()).toBe("apple");
        });
      });
    });
  });
});

describe("String", function () {
  describe("toTranslatable()", function () {
    var translatable;

    it("should create a Translatable instance", function () {
      translatable = 'foo'.toTranslatable();
      expect($i18n.Translatable.mixedBy(translatable)).toBeTruthy();
    });

    it("should set Translatable properties", function () {
      translatable = 'foo'.toTranslatable();
      expect(translatable.originalString).toBe('foo');
    });

    it("should pass additional properties to create", function () {
      translatable = 'foo'.toTranslatable({bar: 'baz'});
      expect(translatable.bar).toBe('baz');
    });
  });
});
