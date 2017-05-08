/* global $assert, $oop */
"use strict";

var $assert = window['giant-assert'],
    $utils = window['giant-utils'];

describe("Thenable", function () {
    describe("type assertion", function () {
        var thenable = {then: function () {}};

        beforeEach(function () {
            spyOn($assert, 'assert').and.callThrough();
            $assert.isThenable(thenable, "bar");
        });

        it("should pass message to assert", function () {
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing non-thenable", function () {
            it("should throw", function () {
                expect(function () {
                    $assert.isThenable({
                        foo: function () {}
                    });
                }).toThrow();
            });
        });
    });

    describe("optional type assertion", function () {
        var thenable;

        beforeEach(function () {
            spyOn($assert, 'assert').and.callThrough();
            $assert.isThenableOptional(thenable, "bar");
        });

        it("should pass message to assert", function () {
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });
    });
});