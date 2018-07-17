"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("AttributeDocumentKey", function () {
    var AttributeDocumentKey,
        attributeDocumentKey;

    beforeAll(function () {
      AttributeDocumentKey = $oop.createClass('test.$entity.AttributeDocumentKey.AttributeDocumentKey')
      .blend($entity.AttributeDocumentKey)
      .build();
      AttributeDocumentKey.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      AttributeDocumentKey.__builder.instances = {};
    });

    describe(".fromDocumentIdComponents()", function () {
      it("should join documentId components", function () {
        attributeDocumentKey = AttributeDocumentKey.fromDocumentIdComponents(
            'foo', ['bar', 'baz', 'quux']);
        expect(attributeDocumentKey)
        .toEqual(AttributeDocumentKey.fromComponents('foo', 'bar/baz/quux'));
      });

      it("should pass additional properties to create", function () {
        attributeDocumentKey = AttributeDocumentKey.fromDocumentIdComponents(
            'foo', ['bar', 'baz', 'quux'], {bar: 'baz'});
        expect(attributeDocumentKey.bar).toBe('baz');
      });
    });
  });

  describe("DocumentKey", function () {
    var DocumentKey,
        documentKey;

    beforeAll(function () {
      DocumentKey = $oop.createClass('test.$entity.AttributeDocumentKey.DocumentKey')
      .blend($entity.DocumentKey)
      .build();
    });

    describe(".create()", function () {
      describe("when documentType is prefixed with __", function () {
        beforeEach(function () {
          documentKey = $entity.DocumentKey.fromReference('__foo/bar');
        });

        it("should return AttributeDocumentKey", function () {
          expect($entity.AttributeDocumentKey.mixedBy(documentKey))
          .toBeTruthy();
        });
      });
    });
  });
});
