"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("CollectionFieldKey", function () {
    var CollectionFieldKey,
        collectionFieldKey,
        attributeKey,
        result;

    beforeAll(function () {
      CollectionFieldKey = $oop.getClass('test.$entity.CollectionFieldKey.CollectionFieldKey')
      .blend($entity.CollectionFieldKey);
    });

    beforeEach(function () {
      collectionFieldKey = CollectionFieldKey.fromComponents('foo', 'bar', 'baz');

      attributeKey = collectionFieldKey.getAttributeDocumentKey();
      $entity.entities.setNode(attributeKey.getEntityPath(), {
        itemIdType: 'A',
        itemIdOptions: [1, 2],
        itemValueType: 'B',
        itemValueOptions: [3, 4]
      });
    });

    afterEach(function () {
      $entity.entities.deleteNode(attributeKey.getEntityPath());
    });

    describe("getItemIdType()", function () {
      it("should retrieve itemIdType attribute", function () {
        result = collectionFieldKey.getItemIdType();
        expect(result).toEqual('A');
      });
    });

    describe("getItemIdOptions()", function () {
      it("should retrieve itemIdOptions attribute", function () {
        result = collectionFieldKey.getItemIdOptions();
        expect(result).toEqual([1, 2]);
      });
    });

    describe("getItemValueType()", function () {
      it("should retrieve itemValueType attribute", function () {
        result = collectionFieldKey.getItemValueType();
        expect(result).toEqual('B');
      });
    });

    describe("getItemValueOptions()", function () {
      it("should retrieve itemValueOptions attribute", function () {
        result = collectionFieldKey.getItemValueOptions();
        expect(result).toEqual([3, 4]);
      });
    });
  });

  describe("FieldKey", function () {
    var result;

    describe("create()", function () {
      describe("when valueType is collection", function () {
        beforeEach(function () {
          $entity.entities.setNode('document.__field.foo/baz.valueType'.toPath(), 'collection');
          result = 'foo/bar/baz'.toFieldKey();
        });

        afterEach(function () {
          $entity.entities.deleteNode('document.__field.foo/baz.valueType'.toPath());
        });

        it("should return CollectionFieldKey instance", function () {
          expect($entity.CollectionFieldKey.mixedBy(result)).toBeTruthy();
        });
      });
    });
  });
});
