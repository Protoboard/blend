/* global $oop */
"use strict";

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