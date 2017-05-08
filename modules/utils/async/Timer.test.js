"use strict";

var $utils = window['giant-utils'];

describe("Timer", function () {
    var timer;

    describe("instantiation", function () {
        beforeEach(function () {
            timer = $utils.Timer.create(1);
        });

        describe("when passing invalid arguments", function () {
            it("should throw", function () {
                expect(function () {
                    $utils.Timer.create("foo");
                }).toThrow();
            });
        });

        it("whould set timer ID", function () {
            expect(timer.timerId).toBe(1);
        });
    });
});
