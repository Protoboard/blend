"use strict";

var $utils = window['giant-utils'];

describe("Scheduler", function () {
    var debouncer;

    beforeEach(function () {
        debouncer = $utils.Scheduler.create(50);
    });

    describe("instantiation", function () {
        it("should set scheduleDelay", function () {
            expect(debouncer.scheduleDelay).toBe(50);
        });

        it("should initialize scheduledArguments", function () {
            expect(debouncer.scheduledArguments).toEqual([]);
        });

        it("should initialize scheduleTimers", function () {
            expect(debouncer.scheduleTimers).toEqual([]);
        });

        it("should initialize schedulerDeferred", function () {
            expect($utils.Deferred.isIncludedBy(debouncer.schedulerDeferred)).toBeTruthy();
        });

        describe("when passing invalid arguments", function () {
            it("should throw", function () {
                expect(function () {
                    $utils.Scheduler.create("foo");
                }).toThrow();
            });
        });
    });
});
