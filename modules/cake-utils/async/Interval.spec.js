"use strict";

var $utils = window['cake-utils'];

describe("Number", function () {
  describe("toInterval()", function () {
    var interval;

    beforeEach(function () {
      interval = (12345).toInterval();
    });

    it("should return Interval instance", function () {
      expect($utils.Interval.mixedBy(interval)).toBeTruthy();
    });

    it("should set timerId property", function () {
      expect(interval.timerId).toBe(12345);
    });
  });

});

describe("$utils", function () {
  describe("Interval", function () {
    var interval;

    beforeEach(function () {
      interval = $utils.Interval.create({timerId: 1});
    });

    describe("clearTimer()", function () {
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