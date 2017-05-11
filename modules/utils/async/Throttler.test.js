"use strict";

var $utils = window['giant-utils'];

describe("Throttler", function () {
    var throttler;

    beforeEach(function () {
        throttler = $utils.Throttler.create(50);
    });

    describe("instantiation", function () {
        it("should initialize throttledCallCounts", function () {
            expect(throttler.throttledCallCounts).toEqual([]);
        });
    });

    describe("scheduling", function () {
        var result;

        beforeEach(function () {
            jasmine.clock().install();
            spyOn($utils, 'setInterval').and.callThrough();
            result = throttler.schedule("foo", "bar");
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it("should return promise", function () {
            expect(result).toBe(throttler.schedulerDeferred.promise);
        });

        it("should add arguments to list", function () {
            expect(throttler.scheduledArguments).toEqual([["foo", "bar"]]);
        });

        it("should add timer to list", function () {
            expect($utils.Interval.isIncludedBy(throttler.scheduleTimers[0])).toBeTruthy();
        });

        it("should increment call count", function () {
            expect(throttler.throttledCallCounts[0]).toBe(1);
        });

        it("should start timer", function () {
            expect($utils.setInterval).toHaveBeenCalledWith(50, "foo", "bar");
        });

        describe("when scheduling again with same arguments", function () {
            beforeEach(function () {
                throttler.schedule("foo", "bar");
            });

            it("should not add to argument list", function () {
                expect(throttler.scheduledArguments).toEqual([["foo", "bar"]]);
            });

            it("should not add timer to list", function () {
                expect(throttler.scheduleTimers[1]).toBeUndefined();
            });

            it("should increment call count", function () {
                expect(throttler.throttledCallCounts[0]).toBe(2);
            });
        });

        describe("when timer ticks", function () {
            var progressHandler;

            beforeEach(function () {
                jasmine.clock().tick(51);
                progressHandler = jasmine.createSpy();
                result.then(null, null, progressHandler);
            });

            it("should reset call count", function () {
                expect(throttler.throttledCallCounts).toEqual([0]);
            });

            it("should notify promise with corresponding arguments", function () {
                expect(progressHandler).toHaveBeenCalledWith("foo", "bar");
            });
        });

        describe("when timer gets canceled by user", function () {
            beforeEach(function () {
                throttler.scheduleTimers[0].clearTimer();
            });

            it("should remove affected timer in registry", function () {
                expect(throttler.scheduleTimers).toEqual([undefined]);
            });
        });
    });
});
