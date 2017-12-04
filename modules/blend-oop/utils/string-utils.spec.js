"use strict";

var $oop = window['blend-oop'];

describe("$oop", function () {
  describe("addQuotes()", function () {
    it("should wrap string in single quotes", function () {
      expect($oop.addQuotes("foo")).toBe("'foo'");
    });
  });
});