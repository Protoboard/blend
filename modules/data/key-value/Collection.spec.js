"use strict";

var $assert = window['giant-assert'],
    $oop = window['giant-oop'],
    $utils = window['giant-utils'],
    $data = window['giant-data'];

describe("$data", function () {
    var data,
        Collection,
        collection,
        result;

    describe("Collection", function () {
        beforeEach(function () {
            data = {
                foo: "FOO",
                bar: "BAR"
            };
            Collection = $oop.getClass("Collection")
                .extend($data.Collection);
            collection = Collection.create(data);
        });

        describe("setItem()", function () {
            var value = {};

            beforeEach(function () {
                result = collection.setItem('baz', value);
            });

            it("should return self", function () {
                expect(result).toBe(collection);
            });

            it("should set value in store", function () {
                expect(collection._data.baz).toBe(value);
            });
        });

        describe("deleteItem()", function () {
            beforeEach(function () {
                result = collection.deleteItem('foo');
            });

            it("should return self", function () {
                expect(result).toBe(collection);
            });

            it("should remove key", function () {
                expect(collection._data.hasOwnProperty('foo')).toBeFalsy();
            });

            describe("when specifying value", function () {
                describe("when value doesn't match", function () {
                    it("should not remove key", function () {
                        collection.deleteItem('bar', 'bar');
                        expect(collection._data).toEqual({
                            bar: "BAR"
                        });
                    });
                });
            });
        });

        describe("forEachItem()", function () {
            var callback;

            beforeEach(function () {
                callback = jasmine.createSpy();
                result = collection.forEachItem(callback);
            });

            it("should return self", function () {
                expect(result).toBe(collection);
            });

            it("should pass item values & keys to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    ['FOO', 'foo'],
                    ['BAR', 'bar']
                ]);
            });

            describe("when interrupted", function () {
                beforeEach(function () {
                    callback = jasmine.createSpy().and.returnValue(false);
                    collection.forEachItem(callback);
                });

                it("should stop at interruption", function () {
                    expect(callback).toHaveBeenCalledTimes(1);
                });
            });
        });

        describe("getValuesForKey()", function () {
            beforeEach(function () {
                result = collection.getValuesForKey('foo');
            });

            it("should return corresponding values", function () {
                expect(result).toEqual(["FOO"]);
            });

            describe("on absent key", function () {
                beforeEach(function () {
                    result = collection.getValuesForKey('baz');
                });

                it("should return empty array", function () {
                    expect(result).toEqual([]);
                });
            });
        });

        describe("getValue()", function () {
            it("should return corresponding value", function () {
                expect(collection.getValue('foo')).toBe("FOO");
            });
        });
    });

    describe("DataContainer", function () {
        describe("toCollection()", function () {
            var container = $data.DataContainer.create([1, 2, 3]);

            beforeEach(function () {
                result = container.toCollection();
            });

            it("should return a Collection instance", function () {
                expect($data.Collection.isIncludedBy(result)).toBeTruthy();
            });

            it("should set data buffer", function () {
                expect(result._data).toBe(container._data);
            });
        });
    });
});

describe("Array", function () {
    var result;

    describe("toCollection()", function () {
        var array = [1, 2, 3];

        beforeEach(function () {
            result = array.toCollection();
        });

        it("should return a Collection instance", function () {
            expect($data.Collection.isIncludedBy(result)).toBeTruthy();
        });

        it("should set data buffer", function () {
            expect(result._data).toBe(array);
        });
    });
});
