"use strict";

var $utils = window['giant-utils'];

describe("$utils", function () {
  describe("Debouncer", function () {
    var debouncer;

    beforeEach(function () {
      debouncer = $utils.Debouncer.create(50);
    });

    describe("create()", function () {
      it("should set scheduleDelay", function () {
        expect(debouncer._debounceDelay).toBe(50);
      });
    });

    describe("schedule()", function () {
      var result;

      beforeEach(function () {
        jasmine.clock().install();
        spyOn($utils, 'setTimeout').and.callThrough();
        result = debouncer.schedule("foo", "bar");
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      it("should return promise", function () {
        expect(result).toBe(debouncer.schedulerDeferred.promise);
      });

      it("should add arguments to list", function () {
        expect(debouncer._scheduledArguments).toEqual([["foo", "bar"]]);
      });

      it("should add timer to list", function () {
        expect($utils.Timeout.isIncludedBy(debouncer._scheduleTimers[0]))
          .toBeTruthy();
      });

      it("should start timer", function () {
        expect($utils.setTimeout).toHaveBeenCalledWith(50, "foo", "bar");
      });

      describe("when scheduling again with same arguments", function () {
        beforeEach(function () {
          debouncer.schedule("foo", "bar");
        });

        it("should not add to argument list", function () {
          expect(debouncer._scheduledArguments).toEqual([["foo", "bar"]]);
        });

        it("should not add timer to list", function () {
          expect(debouncer._scheduleTimers[1]).toBeUndefined();
        });

        it("should restart timer", function () {
          expect($utils.setTimeout).toHaveBeenCalledWith(50, "foo", "bar");
        });
      });

      describe("when timer completes", function () {
        var progressHandler;

        beforeEach(function () {
          jasmine.clock().tick(51);
          progressHandler = jasmine.createSpy();
          result.then(null, null, progressHandler);
        });

        it("should reset affected timer in registry", function () {
          expect(debouncer._scheduleTimers).toEqual([undefined]);
        });

        it("should notify promise with corresponding arguments", function () {
          expect(progressHandler).toHaveBeenCalledWith("foo", "bar");
        });
      });

      describe("when timer gets canceled by user", function () {
        beforeEach(function () {
          debouncer._scheduleTimers[0].clearTimer();
        });

        it("should reset affected timer in registry", function () {
          expect(debouncer._scheduleTimers).toEqual([undefined]);
        });
      });
    });
  });
});