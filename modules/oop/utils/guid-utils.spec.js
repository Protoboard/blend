"use strict";

var $oop = window['giant-oop'];

describe("$oop", function () {
  describe("generateGuid()", function () {
    var result;

    beforeEach(function () {
      result = $oop.generateGuid();
    });

    it("should return string", function () {
      expect(typeof result).toBe('string');
    });

    it("should be 10 characters max", function () {
      expect(result.length).toBeLessThanOrEqual(10);
    });
  });
});