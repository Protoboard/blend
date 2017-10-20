"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("AttributeDocumentKey", function () {
    var AttributeDocumentKey;

    beforeAll(function () {
      AttributeDocumentKey = $oop.getClass('test.$entity.AttributeDocumentKey.AttributeDocumentKey')
      .blend($entity.AttributeDocumentKey);
    });

    describe("fromDocumentIdComponents()", function () {
      it("should join documentId components", function () {
        expect(AttributeDocumentKey.fromDocumentIdComponents('foo', [
          'bar', 'baz', 'quux']))
        .toEqual(['foo', 'bar/baz/quux'].toDocumentKey());
      });
    });
  });

  describe("DocumentKey", function () {
    var DocumentKey,
        documentKey;

    beforeAll(function () {
      DocumentKey = $oop.getClass('test.$entity.AttributeDocumentKey.DocumentKey')
      .blend($entity.DocumentKey);
    });

    describe("create()", function () {
      describe("when documentType is prefixed with __", function () {
        beforeEach(function () {
          documentKey = $entity.DocumentKey.fromString('__foo/bar');
        });

        it("should return AttributeDocumentKey", function () {
          expect($entity.AttributeDocumentKey.mixedBy(documentKey))
          .toBeTruthy();
        });
      });
    });
  });
});