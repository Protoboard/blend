"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("ItemValueTypePath", function () {
    var ItemValueTypePath,
        itemValueTypePath;

    beforeAll(function () {
      ItemValueTypePath = $oop.getClass('test.$entity.ItemValueTypePath.ItemValueTypePath')
      .blend($entity.ItemValueTypePath);
      ItemValueTypePath.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromItemValueType()", function () {
      it("should return ItemValueTypePath instance", function () {
        itemValueTypePath = ItemValueTypePath.fromItemValueType('reference');
        expect(ItemValueTypePath.mixedBy(itemValueTypePath)).toBeTruthy();
      });

      it("should initialize path components", function () {
        itemValueTypePath = ItemValueTypePath.fromItemValueType('reference');
        expect(itemValueTypePath.components).toEqual([
          'document', '__field', '__field/itemValueType', 'options',
          'reference']);
      });
    });
  });
});

describe("String", function () {
  var result;

  describe("toItemValueTypePath()", function () {
    var itemValueTypePath;

    beforeEach(function () {
      itemValueTypePath = $entity.ItemValueTypePath.fromItemValueType('reference');
      spyOn($entity.ItemValueTypePath, 'create').and
      .returnValue(itemValueTypePath);
    });

    it("should create a ItemValueTypePath instance", function () {
      result = 'reference'.toItemValueTypePath();
      expect($entity.ItemValueTypePath.create).toHaveBeenCalledWith({
        components: ['document', '__field', '__field/itemValueType', 'options',
          'reference']
      });
    });

    it("should return created instance", function () {
      result = 'reference'.toItemValueTypePath();
      expect(result).toBe(itemValueTypePath);
    });
  });
});
