"use strict";

var $utils = window['giant-utils'];

describe("Timeout", function () {
    var timeout;

    beforeEach(function () {
        timeout = $utils.Timeout.create(1);
    });

    describe("conversion from number", function () {
        beforeEach(function () {
            timeout = (12345).toTimeout();
        });

        it("should return Timeout instance", function () {
            expect($utils.Timeout.isIncludedBy(timeout)).toBeTruthy();
        });

        it("should set timerId property", function () {
            expect(timeout.timerId).toBe(12345);
        });
    });

    describe("clearing timeout", function () {
        var result;

        beforeEach(function () {
            spyOn(window, 'clearTimeout');
            spyOn(timeout.timerDeferred, 'reject').and.callThrough();
            result = timeout.clearTimer("foo", "bar");
        });

        it("should return self", function () {
            expect(result).toBe(timeout);
        });

        it("should call clearTimeout with timer ID", function () {
            expect(window.clearTimeout).toHaveBeenCalledWith(timeout.timerId);
        });

        it("should reject timer promise", function () {
            expect(timeout.timerDeferred.reject).toHaveBeenCalledWith("foo", "bar");
        });

        describe("when clearing again", function () {
            beforeEach(function () {
                timeout.clearTimer("baz");
            });

            it("should not call clearTimeout again", function () {
                expect(window.clearTimeout).toHaveBeenCalledTimes(1);
            });

            it("should not reject promise again", function () {
                expect(timeout.timerDeferred.reject).toHaveBeenCalledTimes(1);
            });
        });
    });
});
