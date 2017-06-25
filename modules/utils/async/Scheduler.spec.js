"use strict";

var $utils = window['giant-utils'];

describe("$utils", function () {
  describe("Scheduler", function () {
    var scheduler;

    beforeEach(function () {
      scheduler = $utils.Scheduler.create();
    });

    describe("create()", function () {
      it("should initialize _scheduledArguments", function () {
        expect(scheduler._scheduledArguments).toEqual([]);
      });

      it("should initialize _scheduleTimers", function () {
        expect(scheduler._scheduleTimers).toEqual([]);
      });

      it("should initialize schedulerDeferred", function () {
        expect($utils.Deferred.isIncludedBy(scheduler.schedulerDeferred))
        .toBeTruthy();
      });
    });
  });
});