"use strict";

var $assert = window['giant-assert'],
    $data = window['giant-data'];

describe("$data", function () {
    var data,
        dictionary,
        result;

    describe("StringDictionary", function () {
        beforeEach(function () {
            data = {
                foo: {"FOO": 1},
                bar: {"BAR": 1, "bar": 1}
            };
            dictionary = $data.StringDictionary.create(data);
            dictionary._itemCount = 3;
        });

        describe("setItem()", function () {
            beforeEach(function () {
                result = dictionary.setItem('baz', "BAZ");
            });

            it("should return self", function () {
                expect(result).toBe(dictionary);
            });

            it("should add item", function () {
                expect(dictionary._data).toEqual({
                    foo: {FOO: 1},
                    bar: {BAR: 1, bar: 1},
                    baz: {BAZ: 1}
                });
            });

            it("should increment _itemCount", function () {
                expect(dictionary._itemCount).toBe(4);
            });

            describe("when adding to existing key", function () {
                beforeEach(function () {
                    dictionary.setItem('foo', 'foo');
                });

                it("should add to array", function () {
                    expect(dictionary._data).toEqual({
                        foo: {FOO: 1, foo: 1},
                        bar: {BAR: 1, bar: 1},
                        baz: {BAZ: 1}
                    });
                });

                it("should increment _itemCount", function () {
                    expect(dictionary._itemCount).toBe(5);
                });
            });
        });

        describe("deleteItem()", function () {
            beforeEach(function () {
                result = dictionary.deleteItem('bar', 'bar');
            });

            it("should return self", function () {
                expect(result).toBe(dictionary);
            });

            it("should remove item", function () {
                expect(dictionary._data).toEqual({
                    foo: {"FOO": 1},
                    bar: {"BAR": 1}
                });
            });

            it("should decrement _itemCount", function () {
                expect(dictionary._itemCount).toBe(2);
            });

            describe("when removing last pair for a key", function () {
                beforeEach(function () {
                    dictionary.deleteItem('foo', 'FOO');
                });

                it("should remove item", function () {
                    expect(dictionary._data).toEqual({
                        bar: {"BAR": 1}
                    });
                });
            });

            describe("when removing absent key-value pair", function () {
                beforeEach(function () {
                    dictionary.deleteItem('bar', 'QUUX');
                    dictionary.deleteItem('baz', 'BAZ');
                });

                it("should not change data", function () {
                    expect(dictionary._data).toEqual({
                        foo: {"FOO": 1},
                        bar: {"BAR": 1}
                    });
                });
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
                    ["FOO", 'foo', dictionary],
                    ["BAR", 'bar', dictionary],
                    ["bar", 'bar', dictionary]
                ]);
            });

            describe("when interrupted", function () {
                beforeEach(function () {
                    callback = jasmine.createSpy().and.returnValue(false);
                    dictionary.forEachItem(callback);
                });

                it("should stop at interruption", function () {
                    expect(callback).toHaveBeenCalledTimes(1);
                });
            });
        });
    });

    describe("DataContainer", function () {
        describe("toStringDictionary()", function () {
            var container = $data.DataContainer.create([1, 2, 3]);

            beforeEach(function () {
                result = container.toStringDictionary();
            });

            it("should return a StringDictionary instance", function () {
                expect($data.StringDictionary.isIncludedBy(result))
                    .toBeTruthy();
            });

            it("should set data buffer", function () {
                expect(result._data).toBe(container._data);
            });
        });
    });
});

describe("Array", function () {
    var result;

    describe("toStringDictionary()", function () {
        var array = ['a', 'b', 'c'];

        beforeEach(function () {
            result = array.toStringDictionary();
        });

        it("should return a StringDictionary instance", function () {
            expect($data.StringDictionary.isIncludedBy(result)).toBeTruthy();
        });

        it("should set data buffer", function () {
            expect(result._data).toBe(array);
        });
    });
});