"use strict";

var $utils = window['blend-utils'];

describe("Number", function () {
  describe("#toInterval()", function () {
    var interval;

    it("should return Interval instance", function () {
      interval = (12345).toInterval();
      expect($utils.Interval.mixedBy(interval)).toBeTruthy();
    });

    it("should set timerId property", function () {
      interval = (12345).toInterval();
      expect(interval.timerId).toBe(12345);
    });

    it("should pass additional properties to create", function () {
      interval = (12345).toInterval({bar: 'baz'});
      expect(interval.bar).toBe('baz');
    });
  });
});

describe("$utils", function () {
  describe("Interval", function () {
    var interval;

    beforeEach(function () {
      interval = $utils.Interval.create({timerId: 1});
    });

    describe("#clearTimer()", function () {
      var result;

      beforeEach(function () {
        spyOn(window, 'clearInterval');
        result = interval.clearTimer("foo", "bar");
      });

      it("should return self", function () {
        expect(result).toBe(interval);
      });

      it("should call clearInterval with timer ID", function () {
        expect(window.clearInterval).toHaveBeenCalledWith(interval.timerId);
      });
    });
  });
});