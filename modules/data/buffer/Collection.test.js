//"use strict";
//
//var $assert = window['giant-assert'],
//    $oop = window['giant-oop'],
//    $utils = window['giant-utils'],
//    $data = window['giant-data'];
//
//describe("$data", function () {
//    var data,
//        Collection,
//        collection,
//        result;
//
//    describe("Collection", function () {
//        beforeEach(function () {
//            data = {
//                foo: "FOO",
//                bar: "BAR"
//            };
//            Collection = $oop.getClass("Collection")
//                .extend($data.Collection);
//            collection = Collection.create(data);
//        });
//
//        describe("mergeWith()", function () {
//            var collection2;
//
//            beforeEach(function () {
//                collection2 = $data.Collection.create({
//                    bar: "bar",
//                    baz: "BAZ"
//                });
//                result = collection.mergeWith(collection2);
//            });
//
//            it("should return new Collection instance", function () {
//                expect($data.Collection.isIncludedBy(result)).toBeTruthy();
//                expect(result).not.toBe(collection);
//                expect(result).not.toBe(collection2);
//            });
//
//            it("should append buffer", function () {
//                expect(result._data).not.toBe(collection._data);
//                expect(result._data).not.toBe(collection2._data);
//                expect(result._data).toEqual({
//                    foo: "FOO",
//                    bar: "bar",
//                    baz: "BAZ"
//                });
//            });
//        });
//
//        describe("mergeIn()", function () {
//            var collection2;
//
//            beforeEach(function () {
//                collection2 = $data.Collection.create({
//                    bar: "bar",
//                    baz: "BAZ"
//                });
//                result = collection.mergeIn(collection2);
//            });
//
//            it("should return self", function () {
//                expect(result).toBe(collection);
//            });
//
//            it("should append buffer", function () {
//                expect(result._data).toEqual({
//                    foo: "FOO",
//                    bar: "bar",
//                    baz: "BAZ"
//                });
//            });
//        });
//
//        describe("filterByKeys()", function () {
//            beforeEach(function () {
//                result = collection.filterByKeys(['foo', 'baz']);
//            });
//
//            it("should return Collection instance", function () {
//                expect(Collection.isIncludedBy(result)).toBeTruthy();
//            });
//
//            it("should return filtered collection", function () {
//                expect(result).not.toBe(collection);
//                expect(result._data).toEqual({
//                    foo: "FOO"
//                });
//            });
//
//            describe("for array buffer", function () {
//                beforeEach(function () {
//                    collection = $data.Collection.create(['foo', 'bar', 'baz']);
//                    result = collection.filterByKeys([1, 5]);
//                });
//
//                it("should return array buffer", function () {
//                    expect(result._data instanceof Array).toBeTruthy();
//                });
//            });
//        });
//
//        describe("forEachItem()", function () {
//            var callback;
//
//            beforeEach(function () {
//                callback = jasmine.createSpy();
//                result = collection.forEachItem(callback);
//            });
//
//            it("should return self", function () {
//                expect(result).toBe(collection);
//            });
//
//            it("should pass item values & keys to callback", function () {
//                expect(callback.calls.allArgs()).toEqual([
//                    ['FOO', 'foo', collection],
//                    ['BAR', 'bar', collection]
//                ]);
//            });
//
//            describe("when interrupted", function () {
//                beforeEach(function () {
//                    callback = jasmine.createSpy().and.returnValue(false);
//                    collection.forEachItem(callback);
//                });
//
//                it("should stop at interruption", function () {
//                    expect(callback.calls.allArgs()).toEqual([
//                        ['FOO', 'foo', collection]
//                    ]);
//                });
//            });
//        });
//    });
//
//    describe("Container", function () {
//        describe("toCollection()", function () {
//            var buffer = $data.Container.create([1, 2, 3]);
//
//            beforeEach(function () {
//                result = buffer.toCollection();
//            });
//
//            it("should return a Collection instance", function () {
//                expect($data.Collection.isIncludedBy(result)).toBeTruthy();
//            });
//
//            it("should set data buffer", function () {
//                expect(result._data).toBe(buffer._data);
//            });
//        });
//    });
//});
//
//describe("Array", function () {
//    var result;
//
//    describe("toCollection()", function () {
//        var array = [1, 2, 3];
//
//        beforeEach(function () {
//            result = array.toCollection();
//        });
//
//        it("should return a Collection instance", function () {
//            expect($data.Collection.isIncludedBy(result)).toBeTruthy();
//        });
//
//        it("should set data buffer", function () {
//            expect(result._data).toBe(array);
//        });
//    });
//});
