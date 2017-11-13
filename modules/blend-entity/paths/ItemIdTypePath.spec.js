"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("ItemIdTypePath", function () {
    var ItemIdTypePath,
        itemIdTypePath;

    beforeAll(function () {
      ItemIdTypePath = $oop.getClass('test.$entity.ItemIdTypePath.ItemIdTypePath')
      .blend($entity.ItemIdTypePath);
      ItemIdTypePath.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromItemIdType()", function () {
      it("should return ItemIdTypePath instance", function () {
        itemIdTypePath = ItemIdTypePath.fromItemIdType('reference');
        expect(ItemIdTypePath.mixedBy(itemIdTypePath)).toBeTruthy();
      });

      it("should initialize path components", function () {
        itemIdTypePath = ItemIdTypePath.fromItemIdType('reference');
        expect(itemIdTypePath.components).toEqual([
          'document', '__field', '__field/itemIdType', 'options',
          'reference']);
      });

      it("should pass additional properties to create", function () {
        itemIdTypePath = ItemIdTypePath.fromItemIdType('reference', {bar: 'baz'});
        expect(itemIdTypePath.bar).toBe('baz');
      });
    });
  });
});

describe("String", function () {
  describe("toItemIdTypePath()", function () {
    var itemIdTypePath;

    it("should create a ItemIdTypePath instance", function () {
      itemIdTypePath = 'reference'.toItemIdTypePath();
      expect($entity.ItemIdTypePath.mixedBy(itemIdTypePath))
      .toBeTruthy();
    });

    it("should return created instance", function () {
      itemIdTypePath = 'reference'.toItemIdTypePath();
      expect(itemIdTypePath.components)
      .toEqual(['document', '__field', '__field/itemIdType', 'options',
        'reference']);
    });
  });
});
