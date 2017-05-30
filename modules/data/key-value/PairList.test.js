"use strict";

var $assert = window['giant-assert'],
    $oop = window['giant-oop'],
    $utils = window['giant-utils'],
    $data = window['giant-data'];

describe("$data", function () {
    var data,
        PairList,
        pairList,
        result;

    describe("PairList", function () {
        beforeEach(function () {
            data = [
                {key: "foo", value: "FOO"},
                {key: "bar", value: "BAR"}
            ];
            PairList = $oop.getClass("PairList")
                .extend($data.PairList);
            pairList = PairList.create(data);
        });

        describe("create()", function () {
            describe("on invalid arguments", function () {
                it("should throw", function () {
                    expect(function () {
                        PairList.create({});
                    }).toThrow();
                });
            });
        });

        describe("setItem()", function () {
            var value = {};

            beforeEach(function () {
                result = pairList.setItem('baz', value);
            });

            it("should return self", function () {
                expect(result).toBe(pairList);
            });

            it("should set value in store", function () {
                expect(pairList._data).toEqual([
                    {key: "foo", value: "FOO"},
                    {key: "bar", value: "BAR"},
                    {key: "baz", value: value}
                ]);
            });
        });

        describe("deleteItem()", function () {
            it("should throw", function () {
                expect(function () {
                    pairList.deleteItem('foo', "FOO");
                }).toThrow();
            });
        });

        describe("forEachItem()", function () {
            var callback;

            beforeEach(function () {
                callback = jasmine.createSpy();
                result = pairList.forEachItem(callback);
            });

            it("should return self", function () {
                expect(result).toBe(pairList);
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
                    pairList.forEachItem(callback);
                });

                it("should stop at interruption", function () {
                    expect(callback).toHaveBeenCalledTimes(1);
                });
            });
        });
    });

    describe("DataContainer", function () {
        describe("toPairList()", function () {
            var container = $data.DataContainer.create([1, 2, 3]);

            beforeEach(function () {
                result = container.toPairList();
            });

            it("should return a PairList instance", function () {
                expect($data.PairList.isIncludedBy(result)).toBeTruthy();
            });

            it("should set data buffer", function () {
                expect(result._data).toBe(container._data);
            });
        });
    });
});

describe("Array", function () {
    var result;

    describe("toPairList()", function () {
        var array = [1, 2, 3];

        beforeEach(function () {
            result = array.toPairList();
        });

        it("should return a PairList instance", function () {
            expect($data.PairList.isIncludedBy(result)).toBeTruthy();
        });

        it("should set data buffer", function () {
            expect(result._data).toBe(array);
        });
    });
});
