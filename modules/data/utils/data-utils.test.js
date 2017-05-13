"use strict";

var $data = window['giant-data'];

describe("$data", function () {
    describe("isEmptyObject()", function () {
        describe("for empty object", function () {
            it("should return true", function () {
                expect($data.isEmptyObject({})).toBe(true);
            });
        });

        describe("for non-empty object", function () {
            it("should return false", function () {
                expect($data.isEmptyObject({foo: "bar"})).toBe(false);
            });
        });
    });

    describe("isSingularObject()", function () {
        describe("for empty object", function () {
            it("should return false", function () {
                expect($data.isSingularObject({})).toBe(false);
            });
        });

        describe("for singular object", function () {
            it("should return true", function () {
                expect($data.isSingularObject({foo: "bar"})).toBe(true);
            });
        });

        describe("for object with multiple properties", function () {
            it("should return false", function () {
                expect($data.isSingularObject({foo: "bar", baz: "quux"})).toBe(false);
            });
        });
    });

    describe("shallowCopy()", function () {
        var original,
            copy;

        describe("for undefined", function () {
            it("should return undefined", function () {
                expect($data.shallowCopy(undefined)).toBeUndefined();
            });
        });

        describe("for primitive value", function () {
            it("should return argument", function () {
                expect($data.shallowCopy(1)).toBe(1);
                expect($data.shallowCopy("foo")).toBe("foo");
                expect($data.shallowCopy(null)).toBe(null);
            });
        });

        describe("for arrays", function () {
            beforeEach(function () {
                original = [{}, {}];
                copy = $data.shallowCopy(original);
            });

            it("should return different array", function () {
                expect(copy).not.toBe(original);
            });

            it("should return same content", function () {
                expect(copy).toEqual(original);
            });
        });

        describe("for objects", function () {
            beforeEach(function () {
                original = {foo: {}, bar: {}};
                copy = $data.shallowCopy(original);
            });

            it("should return different object", function () {
                expect(copy).not.toBe(original);
            });

            it("should return same content", function () {
                expect(copy).toEqual(original);
            });
        });
    });
});