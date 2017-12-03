"use strict";

var $oop = window['blend-oop'];

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
