"use strict";

var $oop = window['blend-oop'],
    $i18n = window['blend-i18n'];

describe("$i18n", function () {
  describe("LocaleEnvironmentDocument", function () {
    var LocaleEnvironmentDocument,
        localeEnvironmentDocument;

    beforeAll(function () {
      LocaleEnvironmentDocument = $oop.createClass('test.$i18n.LocaleEnvironmentDocument.LocaleEnvironmentDocument')
      .blend($i18n.LocaleEnvironmentDocument)
      .build();
      LocaleEnvironmentDocument.__forwards = {
        list: [],
        sources: [],
        lookup: {}
      };
    });

    describe("setActiveLocaleKey()", function () {
      beforeEach(function () {
        localeEnvironmentDocument = LocaleEnvironmentDocument.fromEntityKey('foo/bar'.toDocumentKey());
        localeEnvironmentDocument.deleteNode();
      });

      it("should return self", function () {
        var result = localeEnvironmentDocument.setActiveLocaleKey('baz/quux'.toDocumentKey());
        expect(result).toBe(localeEnvironmentDocument);
      });

      it("should set activeLocale field", function () {
        localeEnvironmentDocument.setActiveLocaleKey('baz/quux'.toDocumentKey());
        var path = 'document.foo.bar.activeLocale'.toTreePath();
        expect($entity.entities.getNode(path)).toBe('baz/quux');
      });
    });

    describe("getActiveLocaleKey()", function () {
      beforeEach(function () {
        localeEnvironmentDocument = LocaleEnvironmentDocument.fromEntityKey('foo/bar'.toDocumentKey());
        localeEnvironmentDocument.setNode({
          activeLocale: 'baz/quux'
        });
      });

      it("should return activeLocale field node", function () {
        expect(localeEnvironmentDocument.getActiveLocaleKey())
        .toEqual('baz/quux'.toDocumentKey());
      });
    });
  });
});

describe("$entity", function () {
  describe("Document", function () {
    describe("create()", function () {
      var document;

      describe("when documentType is '_localeEnvironment'", function () {
        it("should return LocaleEnvironmentDocument instance", function () {
          document = $entity.Document.fromEntityKey('_localeEnvironment/foo'.toDocumentKey());
          expect($i18n.LocaleEnvironmentDocument.mixedBy(document))
          .toBeTruthy();
        });
      });
    });
  });
});
