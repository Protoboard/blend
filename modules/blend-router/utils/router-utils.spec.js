"use strict";

var $router = window['blend-router'];

describe("$router", function () {
  describe("getActiveRoute()", function () {
    it("should return active Route", function () {
      var result = $router.getActiveRoute();
      expect(result).toEqual([].toRoute());
    });
  });
});
