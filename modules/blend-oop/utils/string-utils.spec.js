"use strict";

var $oop = window['blend-oop'];

describe("$oop", function () {
  describe("escapeCommas()", function () {
    it("should escape commas in string", function () {
      expect($oop.escapeCommas("foo,bar,baz")).toBe("foo\\,bar\\,baz");
    });
  });

  describe("addQuotes()", function () {
    it("should wrap string in single quotes", function () {
      expect($oop.addQuotes("foo")).toBe("'foo'");
    });
  });
});