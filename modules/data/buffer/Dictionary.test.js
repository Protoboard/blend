"use strict";

var $assert = window['giant-assert'],
    $data = window['giant-data'];

describe("$data", function () {
    var data,
        dictionary,
        result;

    describe("Dictionary", function () {
        beforeEach(function () {
            data = {
                foo: "FOO",
                bar: ["BAR", "bar"]
            };
            dictionary = $data.Dictionary.create(data);
        });

        describe("create()", function () {
            it("should initialize _itemCount property", function () {
                expect(dictionary.hasOwnProperty('_itemCount')).toBeTruthy();
                expect(dictionary._itemCount).toBeUndefined();
            });

            describe("on missing arguments", function () {
                it("should set _itemCount property to 0", function () {
                    dictionary = $data.Dictionary.create();
                    expect(dictionary._itemCount).toBe(0);
                });
            });
        });

        describe("clone()", function () {
            var clonedDictionary;

            beforeEach(function () {
                dictionary._itemCount = 2;
                clonedDictionary = dictionary.clone();
            });

            it("should return cloned instance", function () {
                expect(clonedDictionary).not.toBe(dictionary);
            });

            it("should set _itemCount", function () {
                expect(clonedDictionary._itemCount).toBe(2);
            });
        });

        describe("clear()", function () {
            beforeEach(function () {
                result = dictionary.clear();
            });

            it("should return self", function () {
                expect(result).toBe(dictionary);
            });

            it("should reset _itemCount", function () {
                expect(dictionary._itemCount).toBe(0);
            });
        });

        describe("setItem()", function () {
            var value = {};

            beforeEach(function () {
                dictionary._itemCount = 3;
                result = dictionary.setItem('baz', value);
            });

            it("should return self", function () {
                expect(result).toBe(dictionary);
            });

            it("should add item", function () {
                expect(dictionary._data).toEqual({
                    foo: "FOO",
                    bar: ["BAR", "bar"],
                    baz: value
                });
            });

            it("should increment _itemCount", function () {
                expect(dictionary._itemCount).toBe(4);
            });

            describe("when adding same key-value pair", function () {
                it("should not have effect", function () {
                    dictionary.setItem('baz', value);
                    expect(dictionary._data).toEqual({
                        foo: "FOO",
                        bar: ["BAR", "bar"],
                        baz: value
                    });
                });
            });

            describe("when adding to key with single value", function () {
                it("should convert to array", function () {
                    dictionary.setItem('foo', 'foo');
                    expect(dictionary._data).toEqual({
                        foo: ["FOO", 'foo'],
                        bar: ["BAR", "bar"],
                        baz: value
                    });
                });
            });

            describe("when adding to key with multiple values", function () {
                it("should add to array", function () {
                    dictionary.setItem('bar', 'BaR');
                    expect(dictionary._data).toEqual({
                        foo: "FOO",
                        bar: ["BAR", "bar", "BaR"],
                        baz: value
                    });
                });
            });
        });

        describe("setItems()", function () {
            beforeEach(function () {
                result = dictionary.setItems({
                    foo: 'foo',
                    bar: ['bAr', 'bar'],
                    baz: 'baz'
                });
            });

            it("should return self", function () {
                expect(result).toBe(dictionary);
            });

            it("should add items", function () {
                expect(dictionary._data).toEqual({
                    foo: ["FOO", 'foo'],
                    bar: ["BAR", "bar", 'bAr'],
                    baz: 'baz'
                });
            });
        });

        describe("deleteItem()", function () {
            beforeEach(function () {
                dictionary._itemCount = 3;
                result = dictionary.deleteItem('foo', 'FOO');
            });

            it("should return self", function () {
                expect(result).toBe(dictionary);
            });

            it("should remove item", function () {
                expect(dictionary._data).toEqual({
                    bar: ["BAR", "bar"]
                });
            });

            it("should decrement _itemCount", function () {
                expect(dictionary._itemCount).toBe(2);
            });

            describe("when removing absent key-value pair", function () {
                it("should not change data", function () {
                    dictionary.deleteItem('bar', 'QUUX');
                    expect(dictionary._data).toEqual({
                        bar: ["BAR", "bar"]
                    });
                });
            });

            describe("when removing from dual value key", function () {
                it("should leave single value", function () {
                    dictionary.deleteItem('bar', 'BAR');
                    expect(dictionary._data).toEqual({
                        bar: 'bar'
                    });
                });
            });
        });

        describe("deleteItems()", function () {
            beforeEach(function () {
                result = dictionary.deleteItems({
                    foo: 'FOO',
                    bar: ['bar', 'BaR']
                });
            });

            it("should return self", function () {
                expect(result).toBe(dictionary);
            });

            it("should remove item", function () {
                expect(dictionary._data).toEqual({
                    bar: "BAR"
                });
            });
        });

        describe("getItemCount()", function () {
            beforeEach(function () {
                result= dictionary.getItemCount();
            });

            it("should retrieve item count", function () {
                expect(result).toBe(3);
            });

            it("should set _itemCount property", function () {
                expect(dictionary._itemCount).toBe(3);
            });
        });

        describe("getValue()", function () {
            it("should return corresponding value(s)", function () {
                expect(dictionary.getValue('foo')).toBe("FOO");
                expect(dictionary.getValue('bar')).toEqual(["BAR", "bar"]);
            });
        });

        describe("getKeys()", function () {
            beforeEach(function () {
                result = dictionary.getKeys();
            });

            it("should return array with keys", function () {
                expect(result.sort()).toEqual(['foo', 'bar'].sort());
            });
        });

        describe("getValues()", function () {
            beforeEach(function () {
                result = dictionary.getValues();
            });

            it("should retrieve array of values", function () {
                expect(result.sort()).toEqual(["FOO", "BAR", "bar"].sort());
            });

            it("should update _itemCount", function () {
                expect(dictionary._itemCount).toBe(3);
            });
        });

        describe("getFirstKey()", function () {
            beforeEach(function () {
                result = dictionary.getFirstKey();
            });

            it("should return one of the keys", function () {
                expect(result === "foo" || result === "bar").toBeTruthy();
            });
        });

        describe("getFirstValue()", function () {
            beforeEach(function () {
                result = dictionary.getFirstValue();
            });

            it("should return one of the values", function () {
                expect(result === "FOO" ||
                    result === "BAR" ||
                    result === "bar").toBeTruthy();
            });
        });

        describe("forEachItem", function () {
            var callback;

            beforeEach(function () {
                callback = jasmine.createSpy();
                result = dictionary.forEachItem(callback);
            });

            it("should return self", function () {
                expect(result).toBe(dictionary);
            });

            it("should pass item values & keys to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ["FOO", 'foo', undefined, dictionary],
                    ["BAR", 'bar', 0, dictionary],
                    ["bar", 'bar', 1, dictionary]
                ]);
            });

            describe("when interrupted", function () {
                beforeEach(function () {
                    callback = jasmine.createSpy().and.returnValue(false);
                    dictionary.forEachItem(callback);
                });

                it("should stop at interruption", function () {
                    expect(callback.calls.allArgs()).toEqual([
                        ['FOO', 'foo', undefined, dictionary]
                    ]);
                });
            });
        });
    });

    describe("Buffer", function () {
        describe("toDictionary()", function () {
            var dictionary = $data.Dictionary.create([1, 2, 3]);

            beforeEach(function () {
                result = dictionary.toDictionary();
            });

            it("should return a Dictionary instance", function () {
                expect($data.Dictionary.isIncludedBy(result)).toBeTruthy();
            });

            it("should set data buffer", function () {
                expect(result._data).toBe(dictionary._data);
            });
        });
    });
});

describe("Array", function () {
    var result;

    describe("toDictionary()", function () {
        var array = [1, 2, 3];

        beforeEach(function () {
            result = array.toDictionary();
        });

        it("should return a Dictionary instance", function () {
            expect($data.Dictionary.isIncludedBy(result)).toBeTruthy();
        });

        it("should set data buffer", function () {
            expect(result._data).toBe(array);
        });
    });
});
