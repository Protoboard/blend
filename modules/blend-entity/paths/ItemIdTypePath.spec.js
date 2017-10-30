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
    });
  });
});

describe("String", function () {
  var result;

  describe("toItemIdTypePath()", function () {
    var itemIdTypePath;

    beforeEach(function () {
      itemIdTypePath = $entity.ItemIdTypePath.fromItemIdType('reference');
      spyOn($entity.ItemIdTypePath, 'create').and
      .returnValue(itemIdTypePath);
    });

    it("should create a ItemIdTypePath instance", function () {
      result = 'reference'.toItemIdTypePath();
      expect($entity.ItemIdTypePath.create).toHaveBeenCalledWith({
        components: ['document', '__field', '__field/itemIdType', 'options',
          'reference']
      });
    });

    it("should return created instance", function () {
      result = 'reference'.toItemIdTypePath();
      expect(result).toBe(itemIdTypePath);
    });
  });
});
