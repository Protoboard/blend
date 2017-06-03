"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
    var data,
        OrderedStringList,
        orderedStringList,
        result;

    describe("OrderedStringList", function () {
        var comparer;

        beforeEach(function () {
            data = ['bar', 'foo'];
            OrderedStringList = $oop.getClass("test.$data.OrderedStringList.OrderedStringList")
                .extend($data.OrderedStringList);
            orderedStringList = OrderedStringList.create(data);
        });

        describe("getRangeByPrefix()", function () {
            beforeEach(function () {
                orderedStringList
                    .setItem('baz')
                    .setItem('quux')
                    .setItem('hello')
                    .setItem('world')
                    .setItem('lorem')
                    .setItem('ipsum');

                result = orderedStringList.getRangeByPrefix('b');
            });

            it("should return range matching prefix", function () {
                expect(result).toEqual([
                    'bar', 'baz'
                ]);
            });
        });
    });

    describe("DataContainer", function () {
        describe("toOrderedStringList()", function () {
            var buffer = $data.DataContainer.create([1, 2, 3]);

            beforeEach(function () {
                result = buffer.toOrderedStringList();
            });

            it("should return a OrderedStringList instance", function () {
                expect($data.OrderedStringList.isIncludedBy(result)).toBeTruthy();
            });

            it("should set data set", function () {
                expect(result._data).toBe(buffer._data);
            });
        });
    });
});

describe("Array", function () {
    var result;

    describe("toOrderedStringList()", function () {
        var array = [1, 2, 3];

        beforeEach(function () {
            result = array.toOrderedStringList();
        });

        it("should return a OrderedStringList instance", function () {
            expect($data.OrderedStringList.isIncludedBy(result)).toBeTruthy();
        });

        it("should set data set", function () {
            expect(result._data).toBe(array);
        });
    });
});
