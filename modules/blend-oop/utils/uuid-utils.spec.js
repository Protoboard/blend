"use strict";

var $oop = window['blend-oop'];

describe("$oop", function () {
  describe("RE_UUID", function () {
    it("should match UUIDs", function () {
      expect($oop.RE_UUID.test("2b684b1b-6ba8-48b0-964f-4ba1a9bea9fe"))
      .toBeTruthy();
      expect($oop.RE_UUID.test("3cb1acdd-c789-427c-af74-d0e244463529"))
      .toBeTruthy();
      expect($oop.RE_UUID.test("4bd85482-d740-4e4d-9af0-437b50736824"))
      .toBeTruthy();
      expect($oop.RE_UUID.test("994545d0-3702-4030-b333-c0d4c5b5ac88"))
      .toBeTruthy();
    });
  });

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