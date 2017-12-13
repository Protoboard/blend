"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("ItemValueTypePath", function () {
    var ItemValueTypePath,
        itemValueTypePath;

    beforeAll(function () {
      ItemValueTypePath = $oop.createClass('test.$entity.ItemValueTypePath.ItemValueTypePath')
      .blend($entity.ItemValueTypePath)
      .build();
      ItemValueTypePath.__builder.forwards = {list: [], lookup: {}};
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

      it("should pass additional properties to create", function () {
        itemValueTypePath = ItemValueTypePath.fromItemValueType('reference', {bar: 'baz'});
        expect(itemValueTypePath.bar).toBe('baz');
      });
    });
  });
});

describe("String", function () {
  describe("toItemValueTypePath()", function () {
    var itemValueTypePath;

    it("should create a ItemValueTypePath instance", function () {
      itemValueTypePath = 'reference'.toItemValueTypePath();
      expect($entity.ItemValueTypePath.mixedBy(itemValueTypePath))
      .toBeTruthy();
    });

    it("should return created instance", function () {
      itemValueTypePath = 'reference'.toItemValueTypePath();
      expect(itemValueTypePath.components)
      .toEqual(['document', '__field', '__field/itemValueType', 'options',
        'reference']);
    });

    it("should pass additional properties to create", function () {
      itemValueTypePath = 'reference'.toItemValueTypePath({bar: 'baz'});
      expect(itemValueTypePath.bar).toBe('baz');
    });
  });
});
