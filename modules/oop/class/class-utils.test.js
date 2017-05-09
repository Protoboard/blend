/* global $oop */
"use strict";

var $oop = window['giant-oop'];

describe("$oop.copyProperties", function () {
    var target, members;

    beforeEach(function () {
        target = {};
        members = {
            foo: "FOO",
            bar: function () {}
        };
        $oop.copyProperties(target, members);
    });

    describe("when adding to built-in prototype", function () {
        beforeEach(function () {
            members = {
                toFoo: function () {},
                toBar: function () {}
            };
            $oop.copyProperties(String.prototype, members);
        });

        afterEach(function () {
            delete String.prototype.toFoo;
            delete String.prototype.toBar;
        });

        describe("non-conversion methods", function () {
            it("should throw", function () {
                expect(function () {
                    $oop.copyProperties(String.prototype, {
                        foo: "FOO"
                    });
                }).toThrow();
            });
        });

        it("should copy members", function () {
            expect(String.prototype.toFoo).toBe(members.toFoo);
            expect(String.prototype.toBar).toBe(members.toBar);
        });

        it("should make members non-enumerable", function () {
            expect(Object.getOwnPropertyDescriptor(String.prototype, 'toFoo').enumerable).toBeFalsy();
            expect(Object.getOwnPropertyDescriptor(String.prototype, 'toBar').enumerable).toBeFalsy();
        });
    });

    it("should copy members", function () {
        expect(target.foo).toBe("FOO");
        expect(target.bar).toBe(members.bar);
    });
});

describe("$oop.createObject", function () {
    var base, members,
        result;

    beforeEach(function () {
        base = {};
        members = {
            foo: "FOO",
            bar: function () {}
        };
        result = $oop.createObject(base, members);
    });

    it("should extend base", function () {
        expect(base.isPrototypeOf(result)).toBeTruthy();
    });

    it("should copy members", function () {
        expect(result.foo).toBe("FOO");
        expect(result.bar).toBe(members.bar);
    });
});

describe("$oop.getClass", function () {
    var Class,
        result;

    beforeEach(function () {
        Class = $oop.Class.getClass('Class');
        spyOn($oop.Class, 'getClass').and.returnValue(Class);
        result = $oop.getClass('Class');
    });

    it("should invoke Class.getClass", function () {
        expect($oop.Class.getClass).toHaveBeenCalledWith('Class');
        expect(result).toBe(Class);
    });
});