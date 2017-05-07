/* global $oop, $utils */
"use strict";

var $utils = window['giant-utils'];

describe("Serialization", function () {
    describe("of string literal", function () {
        it("should return string literal", function () {
            expect($utils.stringify('foo')).toBe('foo');
        });
    });

    describe("of null", function () {
        it("should return empty string", function () {
            expect($utils.stringify(null)).toBe('');
        });
    });

    describe("of undefined", function () {
        it("should return empty string", function () {
            expect($utils.stringify()).toBe('');
        });
    });

    describe("of integer", function () {
        it("should return string with number", function () {
            expect($utils.stringify(4)).toBe('4');
        });
    });

    describe("of float", function () {
        it("should return string with number", function () {
            expect($utils.stringify(4.667)).toBe('4.667');
        });
    });

    describe("of boolean", function () {
        it("should return string with boolean", function () {
            expect($utils.stringify(true)).toBe('true');
        });
    });

    describe("of object", function () {
        var object = {};

        beforeEach(function () {
            spyOn(object, 'toString').and.returnValue("FOO");
        });
        
        it("should invoke toString on object", function () {
            expect($utils.stringify(object)).toBe("FOO");
            expect(object.toString).toHaveBeenCalled();
        });
    });
});
