"use strict";

var $oop = window['giant-oop'],
    $utils = window['giant-utils'],
    $data = window['giant-data'];

describe("$data", function () {
    beforeEach(function () {
        $oop.Class.classLookup = {};
    });

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

            ItemContainer = $oop.getClass('ItemContainer')
                .extend($data.DataContainer)
                .extend($data.ItemContainer)
                .define({
                    forEachItem: function (callback, context) {
                        var data = this._data,
                            keys = Object.keys(this._data),
                            i, key;
                        for (i = 0; i < keys.length; i++) {
                            key = keys[i];
                            callback.call(context, data[key], key, this);
                        }
                    }
                });

            itemContainer = ItemContainer.create(data);
        });

        describe("create()", function () {
            it("should initialize _itemCount property", function () {
                expect(itemContainer.hasOwnProperty('_itemCount'))
                    .toBeTruthy();
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
            var clonedIterable;

            beforeEach(function () {
                itemContainer._itemCount = 2;
                clonedIterable = itemContainer.clone();
            });

            it("should return cloned instance", function () {
                expect(clonedIterable).not.toBe(itemContainer);
            });

            it("should set _itemCount", function () {
                expect(clonedIterable._itemCount).toBe(2);
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
