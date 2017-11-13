"use strict";

var $utils = window['blend-utils'];

describe("Number", function () {
  describe("toTimeout()", function () {
    var timeout;

    it("should return Timeout instance", function () {
      timeout = (12345).toTimeout();
      expect($utils.Timeout.mixedBy(timeout)).toBeTruthy();
    });

    it("should set timerId property", function () {
      timeout = (12345).toTimeout();
      expect(timeout.timerId).toBe(12345);
    });

    it("should pass additional properties to create", function () {
      timeout = (12345).toTimeout({bar: 'baz'});
      expect(timeout.bar).toBe('baz');
    });
  });
});

describe("$utils", function () {
  describe("Timeout", function () {
    var timeout;

    beforeEach(function () {
      timeout = $utils.Timeout.create({timerId: 1});
    });

    describe("clearTimer()", function () {
      var result;

      beforeEach(function () {
        spyOn(window, 'clearTimeout');
        result = timeout.clearTimer("foo", "bar");
      });

      it("should return self", function () {
        expect(result).toBe(timeout);
      });

      it("should call clearTimeout with timer ID", function () {
        expect(window.clearTimeout).toHaveBeenCalledWith(timeout.timerId);
      });
    });
  });
});