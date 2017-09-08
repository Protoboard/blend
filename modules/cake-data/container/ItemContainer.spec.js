"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-utils'],
    $data = window['cake-data'];

describe("$data", function () {
  describe("ItemContainer", function () {
    var data,
        ItemContainer,
        itemContainer,
        result;

    beforeEach(function () {
      data = {
        foo: "FOO",
        bar: "BAR"
      };

      ItemContainer = $oop.getClass('test.$data.ItemContainer.ItemContainer')
      .mix($data.DataContainer)
      .mix($data.ItemContainer)
      .define({
        forEachItem: function (callback, context) {
          var data = this.data,
              keys = Object.keys(this.data),
              i, key;
          for (i = 0; i < keys.length; i++) {
            key = keys[i];
            callback.call(context, data[key], key, this);
          }
        }
      });

      itemContainer = ItemContainer.create({data: data});
    });

    describe("create()", function () {
      it("should initialize _itemCount property", function () {
        expect(itemContainer.hasOwnProperty('_itemCount')).toBeTruthy();
        expect(itemContainer._itemCount).toBeUndefined();
      });

      describe("on missing arguments", function () {
        it("should set _itemCount property to 0", function () {
          itemContainer = ItemContainer.create();
          expect(itemContainer._itemCount).toBe(0);
        });
      });
    });

    describe("clone()", function () {
      var clonedContainer;

      beforeEach(function () {
        itemContainer._itemCount = 2;
        clonedContainer = itemContainer.clone();
      });

      it("should return cloned instance", function () {
        expect(clonedContainer).not.toBe(itemContainer);
      });

      it("should set _itemCount", function () {
        expect(clonedContainer._itemCount).toBe(2);
      });
    });

    describe("clear()", function () {
      beforeEach(function () {
        result = itemContainer.clear();
      });

      it("should return self", function () {
        expect(result).toBe(itemContainer);
      });

      it("should reset _itemCount", function () {
        expect(itemContainer._itemCount).toBe(0);
      });
    });

    describe("getItemCount()", function () {
      beforeEach(function () {
        result = itemContainer.getItemCount();
      });

      it("should return key count", function () {
        expect(result).toBe(2);
      });

      it("should set _itemCount", function () {
        expect(itemContainer._itemCount).toBe(2);
      });
    });
  });
});
