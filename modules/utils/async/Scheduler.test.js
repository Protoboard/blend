"use strict";

var $utils = window['giant-utils'];

describe("Scheduler", function () {
    var callback,
        debouncer;

    beforeEach(function () {
        callback = function () {};
        debouncer = $utils.Scheduler.create(callback, 50);
    });

    describe("instantiation", function () {
        it("should set scheduleDelay", function () {
            expect(debouncer.scheduleDelay).toBe(50);
        });

        it("should set scheduledCallback", function () {
            expect(debouncer.scheduledCallback).toBe(callback);
        });

        it("should initialize scheduledCallbackArguments", function () {
            expect(debouncer.scheduledCallbackArguments).toEqual([]);
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
                expect(function () {
                    $utils.Scheduler.create(function () {}, "foo");
                }).toThrow();
            });
        });
    });
});
