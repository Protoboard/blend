"use strict";

var $utils = window['giant-utils'];

describe("Interval", function () {
    var interval;

    beforeEach(function () {
        interval = $utils.Interval.create(1);
    });

    describe("conversion from number", function () {
        beforeEach(function () {
            interval = (12345).toInterval();
        });

        it("should return Interval instance", function () {
            expect($utils.Interval.isIncludedBy(interval)).toBeTruthy();
        });

        it("should set timerId property", function () {
            expect(interval.timerId).toBe(12345);
        });
    });

    describe("clearing interval", function () {
        var result;

        beforeEach(function () {
            spyOn(window, 'clearInterval');
            spyOn(interval.timerDeferred, 'reject').and.callThrough();
            result = interval.clearTimer("foo", "bar");
        });

        it("should return self", function () {
            expect(result).toBe(interval);
        });

        it("should call clearInterval with timer ID", function () {
            expect(window.clearInterval).toHaveBeenCalledWith(interval.timerId);
        });

        it("should reject timer promise", function () {
            expect(interval.timerDeferred.reject).toHaveBeenCalledWith("foo", "bar");
        });

        describe("when clearing again", function () {
            beforeEach(function () {
                interval.clearTimer("baz");
            });

            it("should not call clearInterval again", function () {
                expect(window.clearInterval).toHaveBeenCalledTimes(1);
            });

            it("should not reject promise again", function () {
                expect(interval.timerDeferred.reject).toHaveBeenCalledTimes(1);
            });
        });
    });
});
