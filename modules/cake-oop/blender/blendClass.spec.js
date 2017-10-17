"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  describe("blendClass()", function () {
    var Class, Mixin1, Mixin2,
        result;

    beforeEach(function () {
      Class = {};
      Mixin1 = {};
      Mixin2 = {};

      spyOn($oop.ClassBlender, 'blendClass').and.returnValue(Class);
      result = $oop.blendClass([Mixin1, Mixin2]);
    });

    it("should invoke ClassBlender.blendClass", function () {
      expect($oop.ClassBlender.blendClass)
      .toHaveBeenCalledWith([Mixin1, Mixin2]);
      expect(result).toBe(Class);
    });
  });
});
