"use strict";

var $assert = window['giant-assert'],
    $oop = window['giant-oop'],
    $utils = window['giant-utils'],
    $data = window['giant-data'];

describe("$data", function () {
    var data,
        Set,
        set, set2,
        result;

    describe("Set", function () {
        beforeEach(function () {
            data = {
                foo: "FOO",
                bar: "BAR"
            };
            Set = $oop.getClass("Set")
                .extend($data.Set);
            set = Set.create(data);
            set2 = Set.create({
                bar: "bar",
                baz: "baz"
            });
        });

        describe("intersectWith()", function () {
            beforeEach(function () {
                result = set.intersectWith(set2);
            });

            it("should return new Set instance", function () {
                expect(Set.isIncludedBy(result));
                expect(result).not.toBe(set);
                expect(result).not.toBe(set2);
            });

            it("should create intersection with values from original set", function () {
                expect(result._data).toEqual({
                    bar: "BAR"
                });
            });
        });

        describe("uniteWith()", function () {
            beforeEach(function () {
                result = set.uniteWith(set2);
            });

            it("should return new Set instance", function () {
                expect(Set.isIncludedBy(result));
                expect(result).not.toBe(set);
                expect(result).not.toBe(set2);
            });

            it("should create union with original values taking precedence", function () {
                expect(result._data).toEqual({
                    foo: "FOO",
                    bar: "BAR",
                    baz: "baz"
                });
            });
        });

        describe("subtract()", function () {
            beforeEach(function () {
                result = set.subtract(set2);
            });

            it("should return new Set instance", function () {
                expect(Set.isIncludedBy(result));
                expect(result).not.toBe(set);
                expect(result).not.toBe(set2);
            });

            it("should subtract set from original", function () {
                expect(result._data).toEqual({
                    foo: "FOO"
                });
            });
        });

        describe("subtractFrom()", function () {
            beforeEach(function () {
                result = set.subtractFrom(set2);
            });

            it("should return new Set instance", function () {
                expect(Set.isIncludedBy(result));
                expect(result).not.toBe(set);
                expect(result).not.toBe(set2);
            });

            it("should subtract set from original", function () {
                expect(result._data).toEqual({
                    baz: "baz"
                });
            });
        });

        describe("takeDifferenceWith()", function () {
            beforeEach(function () {
                result = set.takeDifferenceWith(set2);
            });

            it("should return new Set instance", function () {
                expect(Set.isIncludedBy(result));
                expect(result).not.toBe(set);
                expect(result).not.toBe(set2);
            });

            it("should return symmetric difference", function () {
                expect(result._data).toEqual({
                    foo: "FOO",
                    baz: "baz"
                });
            });
        });
    });

    describe("Buffer", function () {
        describe("toSet()", function () {
            var buffer = $data.Buffer.create([1, 2, 3]);

            beforeEach(function () {
                result = buffer.toSet();
            });

            it("should return a Set instance", function () {
                expect($data.Set.isIncludedBy(result)).toBeTruthy();
            });

            it("should set data buffer", function () {
                expect(result._data).toBe(buffer._data);
            });
        });
    });
});

describe("Array", function () {
    var result;

    describe("toSet()", function () {
        var array = [1, 2, 3];

        beforeEach(function () {
            result = array.toSet();
        });

        it("should return a Set instance", function () {
            expect($data.Set.isIncludedBy(result)).toBeTruthy();
        });

        it("should set data buffer", function () {
            expect(result._data).toBe(array);
        });
    });
});
