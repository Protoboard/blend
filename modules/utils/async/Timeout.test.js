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
            result = timeout.clearTimer("foo", "bar");
        });

        it("should return self", function () {
            expect(result).toBe(timeout);
        });

        it("should call clearTimeout with timer ID", function () {
            expect(window.clearTimeout).toHaveBeenCalledWith(timeout.timerId);
        });
    });
});
