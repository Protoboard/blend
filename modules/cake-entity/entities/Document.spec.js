"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("Document", function () {
    var Document,
        document,
        result;

    beforeEach(function () {
      Document = $oop.getClass('test.$entity.Document.Document')
      .mix($entity.Document);
      document = Document.fromEntityKey('foo/bar'.toDocumentKey());
    });

    describe("create()", function () {
      it("should initialize listeningPath", function () {
        expect(document.listeningPath)
        .toEqual('entity.document.foo.bar'.toPath());
      });

      it("should initialize triggerPaths", function () {
        expect(document.triggerPaths)
        .toEqual([
          'entity.document.foo.bar'.toPath(),
          'entity.document.__document.foo'.toPath()
        ]);
      });
    });

    describe("getField()", function () {
      var field;

      beforeEach(function () {
        field = $entity.Field.fromEntityKey('foo/bar/baz'.toFieldKey());
        result = document.getField('baz');
      });

      it("should return a Field instance", function () {
        expect($entity.Field.mixedBy(result)).toBeTruthy();
      });

      it("should set field components", function () {
        expect(result).toEqual(field);
      });
    });
  });
});
