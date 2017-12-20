"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("CollectionFieldKey", function () {
    var CollectionFieldKey,
        collectionFieldKey,
        attributeKey,
        result;

    beforeAll(function () {
      CollectionFieldKey = $oop.createClass('test.$entity.CollectionFieldKey.CollectionFieldKey')
      .blend($entity.CollectionFieldKey)
      .build();
      CollectionFieldKey.__builder.forwards = {list: [], lookup: {}};
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

    describe("getChildKey()", function () {
      beforeEach(function () {
        result = collectionFieldKey.getChildKey('quux');
      });

      it("should return an ItemKey", function () {
        expect($entity.ItemKey.mixedBy(result)).toBeTruthy();
      });

      it("should return item in collection", function () {
        expect(result).toEqual($entity.ItemKey.create({
          parentKey: collectionFieldKey,
          entityName: 'quux'
        }));
      });
    });
  });

  describe("FieldKey", function () {
    var result;

    describe("create()", function () {
      describe("when valueType is collection", function () {
        beforeEach(function () {
          $entity.entities.setNode('document.__field.foo/baz.valueType'.toTreePath(), 'collection');
          result = 'foo/bar/baz'.toFieldKey();
        });

        afterEach(function () {
          $entity.entities.deleteNode('document.__field.foo/baz.valueType'.toTreePath());
        });

        it("should return CollectionFieldKey instance", function () {
          expect($entity.CollectionFieldKey.mixedBy(result)).toBeTruthy();
        });
      });
    });
  });
});

describe("String", function () {
  describe("toCollectionFieldKey()", function () {
    var fieldKey;

    it("should create a CollectionFieldKey instance", function () {
      fieldKey = 'foo/bar/baz'.toCollectionFieldKey();
      expect($entity.CollectionFieldKey.mixedBy(fieldKey)).toBeTruthy();
    });

    it("should set FieldKey properties", function () {
      fieldKey = 'foo/bar/baz'.toCollectionFieldKey();
      expect(fieldKey.parentKey).toEqual('foo/bar'.toDocumentKey());
      expect(fieldKey.entityName).toBe('baz');
    });

    it("should pass additional properties to create", function () {
      fieldKey = 'foo/bar/baz'.toCollectionFieldKey({bar: 'baz'});
      expect(fieldKey.bar).toBe('baz');
    });
  });
});

describe("Array", function () {
  describe("toCollectionFieldKey()", function () {
    var components,
        fieldKey;

    beforeEach(function () {
      components = ['foo', 'bar', 'baz'];
    });

    it("should create a CollectionFieldKey instance", function () {
      fieldKey = components.toCollectionFieldKey();
      expect($entity.CollectionFieldKey.mixedBy(fieldKey)).toBeTruthy();
    });

    it("should set FieldKey properties", function () {
      fieldKey = components.toCollectionFieldKey();
      expect(fieldKey.parentKey).toEqual('foo/bar'.toDocumentKey());
      expect(fieldKey.entityName).toBe('baz');
    });

    it("should pass additional properties to create", function () {
      fieldKey = components.toCollectionFieldKey({bar: 'baz'});
      expect(fieldKey.bar).toBe('baz');
    });
  });
});
