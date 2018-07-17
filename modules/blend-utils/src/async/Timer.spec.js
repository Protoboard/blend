"use strict";

var $utils = window['blend-utils'];

describe("$utils", function () {
  describe("Timer", function () {
    var timer;

    beforeEach(function () {
      timer = $utils.Timer.create({timerId: 1});
    });

    describe(".fromTimerId()", function () {
      it("should return Timer instance", function () {
        timer = $utils.Timer.fromTimerId(5);
        expect($utils.Timer.mixedBy(timer)).toBeTruthy();
      });

      it("should initialize timerId", function () {
        timer = $utils.Timer.fromTimerId(5);
        expect(timer.timerId).toBe(5);
      });
    });

    describe(".create()", function () {
      describe("when passing invalid arguments", function () {
        it("should throw", function () {
          expect(function () {
            $utils.Timer.create();
          }).toThrow();
        });
      });

      it("should set timerId property", function () {
        expect(timer.timerId).toBe(1);
      });

      it("should initialize timerDeferred property", function () {
        expect($utils.Deferred.mixedBy(timer.timerDeferred)).toBeTruthy();
      });

      it("should initialize timerPromise property", function () {
        expect($utils.Promise.mixedBy(timer.timerPromise)).toBeTruthy();
      });
    });

    describe("#clearTimer()", function () {
      var result;

      beforeEach(function () {
        spyOn(timer.timerDeferred, 'reject');
        result = timer.clearTimer("foo", "bar");
      });

      it("should return self", function () {
        expect(result).toBe(timer);
      });

      it("should reject timer promise", function () {
        expect(timer.timerDeferred.reject).toHaveBeenCalledWith("foo", "bar");
      });
    });

    describe("resolving manually", function () {
      beforeEach(function () {
        spyOn(timer, 'clearTimer');
        timer.timerDeferred.resolve();
      });

      it("should clear timer", function () {
        expect(timer.clearTimer).toHaveBeenCalled();
      });
    });

    describe("rejecting manually", function () {
      beforeEach(function () {
        spyOn(timer, 'clearTimer');
        timer.timerDeferred.reject();
      });

      it("should clear timer", function () {
        expect(timer.clearTimer).toHaveBeenCalled();
      });
    });
  });
});