"use strict";

var $oop = window['giant-oop'];

describe("$oop", function () {
  describe("generateUuid()", function () {
    var result;

    beforeEach(function () {
      result = $oop.generateUuid();
    });

    it("should return string", function () {
      expect(typeof result).toBe('string');
    });

    it("should be valid UUID", function () {
      var re = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
      expect(re.test(result)).toBeTruthy();
    });
  });
});