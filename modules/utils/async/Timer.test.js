"use strict";

var $utils = window['giant-utils'];

describe("Timer", function () {
    var timer;

    beforeEach(function () {
        timer = $utils.Timer.create(1);
    });

    describe("instantiation", function () {
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

    describe("clearing timer", function () {
        var result;

        beforeEach(function () {
            spyOn(timer.timerDeferred, 'reject');
            result = timer.clearTimer("foo", "bar");
        });

        it("should return self", function () {
            expect(result).toBe(timer);
        });

        it("should reject timer promise", function () {
            expect(timer.timerDeferred.reject).toHaveBeenCalledWith("foo", "bar");
        });
    });

    describe("resolving manually", function () {
        beforeEach(function () {
             spyOn(timer, 'clearTimer');
             timer.timerDeferred.resolve();
        });

        it("should clear timer", function () {
            expect(timer.clearTimer).toHaveBeenCalled();
        });
    });

    describe("rejecting manually", function () {
        beforeEach(function () {
             spyOn(timer, 'clearTimer');
             timer.timerDeferred.reject();
        });

        it("should clear timer", function () {
            expect(timer.clearTimer).toHaveBeenCalled();
        });
    });
});