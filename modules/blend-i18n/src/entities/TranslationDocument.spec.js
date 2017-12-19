"use strict";

var $oop = window['blend-oop'],
    $i18n = window['blend-i18n'];

describe("$i18n", function () {
  describe("TranslationDocument", function () {
    var TranslationDocument,
        translationDocument;

    beforeAll(function () {
      TranslationDocument = $oop.createClass('test.$i18n.TranslationDocument.TranslationDocument')
      .blend($i18n.TranslationDocument)
      .build();
      TranslationDocument.__builder.forwards = {list: [], lookup: {}};
    });

    describe("setOriginalString()", function () {
      beforeEach(function () {
        translationDocument = TranslationDocument.fromEntityKey('foo/bar'.toDocumentKey());
        translationDocument.deleteNode();
      });

      it("should return self", function () {
        var result = translationDocument.setOriginalString('baz');
        expect(result).toBe(translationDocument);
      });

      it("should set originalString field", function () {
        translationDocument.setOriginalString('baz');
        var path = 'document.foo.bar.originalString'.toTreePath();
        expect($entity.entities.getNode(path)).toBe('baz');
      });
    });

    describe("getOriginalString()", function () {
      beforeEach(function () {
        translationDocument = TranslationDocument.fromEntityKey('foo/bar'.toDocumentKey());
        translationDocument.setNode({
          originalString: 'baz'
        });
      });

      it("should return originalString field node", function () {
        expect(translationDocument.getOriginalString()).toBe('baz');
      });
    });

    describe("setPluralForm()", function () {
      beforeEach(function () {
        translationDocument = TranslationDocument.fromEntityKey('foo/bar'.toDocumentKey());
        translationDocument.deleteNode();
      });

      it("should return self", function () {
        var result = translationDocument.setPluralForm(0, 'baz');
        expect(result).toBe(translationDocument);
      });

      it("should set item in pluralForm field", function () {
        translationDocument.setPluralForm(0, 'baz');
        var path = 'document.foo.bar.pluralForms'.toTreePath();
        expect($entity.entities.getNode(path)).toEqual({
          0: 'baz'
        });
      });
    });

    describe("getPluralForm()", function () {
      beforeEach(function () {
        translationDocument = TranslationDocument.fromEntityKey('foo/bar'.toDocumentKey());
        translationDocument.setNode({
          pluralForms: {
            0: 'baz'
          }
        });
      });

      it("should return pluralForm field node", function () {
        expect(translationDocument.getPluralForm('0')).toBe('baz');
        expect(translationDocument.getPluralForm('1')).toBeUndefined();
      });
    });

    describe("setContext()", function () {
      beforeEach(function () {
        translationDocument = TranslationDocument.fromEntityKey('foo/bar'.toDocumentKey());
        translationDocument.deleteNode();
      });

      it("should return self", function () {
        var result = translationDocument.setContext('baz');
        expect(result).toBe(translationDocument);
      });

      it("should set context field", function () {
        translationDocument.setContext('baz');
        var path = 'document.foo.bar.context'.toTreePath();
        expect($entity.entities.getNode(path)).toBe('baz');
      });
    });

    describe("getContext()", function () {
      beforeEach(function () {
        translationDocument = TranslationDocument.fromEntityKey('foo/bar'.toDocumentKey());
        translationDocument.setNode({
          context: 'baz'
        });
      });

      it("should return context field node", function () {
        expect(translationDocument.getContext()).toBe('baz');
      });
    });
  });
});

describe("$entity", function () {
  describe("Document", function () {
    describe("create()", function () {
      var document;

      describe("when documentType is '_translation'", function () {
        it("should return TranslationDocument instance", function () {
          document = $entity.Document.fromEntityKey('_translation/foo'.toDocumentKey());
          expect($i18n.TranslationDocument.mixedBy(document)).toBeTruthy();
        });
      });
    });
  });
});
