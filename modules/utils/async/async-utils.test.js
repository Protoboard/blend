"use strict";

var $utils = window['giant-utils'];

describe("Async utils", function () {
    beforeEach(function () {
        jasmine.clock().install();
    });

    afterEach(function () {
        jasmine.clock().uninstall();
    });

    describe("setTimeout", function () {
        var successHandler,
            failureHandler,
            result;

        beforeEach(function () {
            result = $utils.setTimeout(10, "foo");
            successHandler = jasmine.createSpy();
            failureHandler = jasmine.createSpy();
            result.timerPromise.then(successHandler, failureHandler);
        });

        it("should return Timeout instance", function () {
            expect($utils.Timeout.isIncludedBy(result)).toBeTruthy();
        });

        describe("on timeout", function () {
            beforeEach(function () {
                jasmine.clock().tick(11);
            });

            it("should resolve promise with timeout arguments", function () {
                expect(successHandler).toHaveBeenCalledWith("foo");
            });
        });

        describe("when timer canceled", function () {
            beforeEach(function () {
                result.clearTimer("bar");
            });

            it("should reject the promise with clear arguments", function () {
                expect(failureHandler).toHaveBeenCalledWith("bar");
            });
        });
    });

    describe("setInterval", function () {
        var progressHandler,
            failureHandler,
            result;

        beforeEach(function () {
            result = $utils.setInterval(10, "foo");
            progressHandler = jasmine.createSpy();
            failureHandler = jasmine.createSpy();
            result.timerPromise.then(null, failureHandler, progressHandler);
        });

        it("should return Interval instance", function () {
            expect($utils.Interval.isIncludedBy(result)).toBeTruthy();
        });

        describe("on interval", function () {
            beforeEach(function () {
                jasmine.clock().tick(11);
            });

            it("should notify promise", function () {
                expect(progressHandler).toHaveBeenCalledWith("foo");
            });
        });

        describe("when timer canceled", function () {
            beforeEach(function () {
                result.clearTimer("bar");
            });

            it("should reject the promise with clear arguments", function () {
                expect(failureHandler).toHaveBeenCalledWith("bar");
            });
        });
    });
});