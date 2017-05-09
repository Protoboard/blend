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

        it("should set timerId property", function () {
            expect(timer.timerId).toBe(1);
        });

        it("should initialize timerDeferred property", function () {
            expect($utils.Deferred.isIncludedBy(timer.timerDeferred)).toBeTruthy();
        });

        it("should initialize timerPromise property", function () {
            expect($utils.Promise.isIncludedBy(timer.timerPromise)).toBeTruthy();
        });
    });
});
