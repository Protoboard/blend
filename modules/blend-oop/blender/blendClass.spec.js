"use strict";

var $oop = window['blend-oop'];

describe("$oop", function () {
  describe("mixClass()", function () {
    var Class, Mixin1, Mixin2,
        result;

    beforeEach(function () {
      Class = {};
      Mixin1 = {};
      Mixin2 = {};

      spyOn($oop.ClassMixer, 'mixClass').and.returnValue(Class);
      result = $oop.mixClass([Mixin1, Mixin2]);
    });

    it("should invoke ClassMixer.mixClass", function () {
      expect($oop.ClassMixer.mixClass)
      .toHaveBeenCalledWith([Mixin1, Mixin2]);
      expect(result).toBe(Class);
    });
  });
});
