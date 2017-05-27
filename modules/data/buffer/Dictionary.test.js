//"use strict";
//
//var $assert = window['giant-assert'],
//    $data = window['giant-data'];
//
//describe("$data", function () {
//    var data,
//        dictionary,
//        result;
//
//    describe("Dictionary", function () {
//        beforeEach(function () {
//            data = {
//                foo: "FOO",
//                bar: ["BAR", "bar"]
//            };
//            dictionary = $data.Dictionary.create(data);
//        });
//
//        describe("setItem()", function () {
//            var value = {};
//
//            beforeEach(function () {
//                dictionary._itemCount = 3;
//                result = dictionary.setItem('baz', value);
//            });
//
//            it("should return self", function () {
//                expect(result).toBe(dictionary);
//            });
//
//            it("should add item", function () {
//                expect(dictionary._data).toEqual({
//                    foo: "FOO",
//                    bar: ["BAR", "bar"],
//                    baz: value
//                });
//            });
//
//            it("should increment _itemCount", function () {
//                expect(dictionary._itemCount).toBe(4);
//            });
//
//            describe("when adding same key-value pair", function () {
//                it("should not have effect", function () {
//                    dictionary.setItem('baz', value);
//                    expect(dictionary._data).toEqual({
//                        foo: "FOO",
//                        bar: ["BAR", "bar"],
//                        baz: value
//                    });
//                });
//            });
//
//            describe("when adding to key with single value", function () {
//                it("should convert to array", function () {
//                    dictionary.setItem('foo', 'foo');
//                    expect(dictionary._data).toEqual({
//                        foo: ["FOO", 'foo'],
//                        bar: ["BAR", "bar"],
//                        baz: value
//                    });
//                });
//            });
//
//            describe("when adding to key with multiple values", function () {
//                it("should add to array", function () {
//                    dictionary.setItem('bar', 'BaR');
//                    expect(dictionary._data).toEqual({
//                        foo: "FOO",
//                        bar: ["BAR", "bar", "BaR"],
//                        baz: value
//                    });
//                });
//            });
//        });
//
//        describe("deleteItem()", function () {
//            beforeEach(function () {
//                dictionary._itemCount = 3;
//                result = dictionary.deleteItem('foo', 'FOO');
//            });
//
//            it("should return self", function () {
//                expect(result).toBe(dictionary);
//            });
//
//            it("should remove item", function () {
//                expect(dictionary._data).toEqual({
//                    bar: ["BAR", "bar"]
//                });
//            });
//
//            it("should decrement _itemCount", function () {
//                expect(dictionary._itemCount).toBe(2);
//            });
//
//            describe("when removing absent key-value pair", function () {
//                it("should not change data", function () {
//                    dictionary.deleteItem('bar', 'QUUX');
//                    expect(dictionary._data).toEqual({
//                        bar: ["BAR", "bar"]
//                    });
//                });
//            });
//
//            describe("when removing from dual value key", function () {
//                it("should leave single value", function () {
//                    dictionary.deleteItem('bar', 'BAR');
//                    expect(dictionary._data).toEqual({
//                        bar: 'bar'
//                    });
//                });
//            });
//        });
//
//        describe("getValue()", function () {
//            it("should return corresponding value(s)", function () {
//                expect(dictionary.getValue('foo')).toBe("FOO");
//                expect(dictionary.getValue('bar')).toEqual(["BAR", "bar"]);
//            });
//        });
//
//        describe("forEachItem", function () {
//            var callback;
//
//            beforeEach(function () {
//                callback = jasmine.createSpy();
//                result = dictionary.forEachItem(callback);
//            });
//
//            it("should return self", function () {
//                expect(result).toBe(dictionary);
//            });
//
//            it("should pass item values & keys to callback", function () {
//                expect(callback.calls.allArgs()).toEqual([
//                    ["FOO", 'foo', undefined, dictionary],
//                    ["BAR", 'bar', 0, dictionary],
//                    ["bar", 'bar', 1, dictionary]
//                ]);
//            });
//
//            describe("when interrupted", function () {
//                beforeEach(function () {
//                    callback = jasmine.createSpy().and.returnValue(false);
//                    dictionary.forEachItem(callback);
//                });
//
//                it("should stop at interruption", function () {
//                    expect(callback.calls.allArgs()).toEqual([
//                        ['FOO', 'foo', undefined, dictionary]
//                    ]);
//                });
//            });
//        });
//    });
//
//    describe("DataContainer", function () {
//        describe("toDictionary()", function () {
//            var dictionary = $data.Dictionary.create([1, 2, 3]);
//
//            beforeEach(function () {
//                result = dictionary.toDictionary();
//            });
//
//            it("should return a Dictionary instance", function () {
//                expect($data.Dictionary.isIncludedBy(result)).toBeTruthy();
//            });
//
//            it("should set data buffer", function () {
//                expect(result._data).toBe(dictionary._data);
//            });
//        });
//    });
//});
//
//describe("Array", function () {
//    var result;
//
//    describe("toDictionary()", function () {
//        var array = [1, 2, 3];
//
//        beforeEach(function () {
//            result = array.toDictionary();
//        });
//
//        it("should return a Dictionary instance", function () {
//            expect($data.Dictionary.isIncludedBy(result)).toBeTruthy();
//        });
//
//        it("should set data buffer", function () {
//            expect(result._data).toBe(array);
//        });
//    });
//});
