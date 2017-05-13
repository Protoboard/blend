"use strict";

var $utils = window['giant-utils'];

describe("$utils", function () {
    describe("Scheduler", function () {
        var scheduler;

        beforeEach(function () {
            scheduler = $utils.Scheduler.create();
        });

        describe("create()", function () {
            it("should initialize scheduledArguments", function () {
                expect(scheduler.scheduledArguments).toEqual([]);
            });

            it("should initialize scheduleTimers", function () {
                expect(scheduler.scheduleTimers).toEqual([]);
            });

            it("should initialize schedulerDeferred", function () {
                expect($utils.Deferred.isIncludedBy(scheduler.schedulerDeferred)).toBeTruthy();
            });
        });
    });
});