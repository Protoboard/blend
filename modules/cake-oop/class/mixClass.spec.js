"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  var Mixin1, Mixin2, Mixin3,
      result;

  describe("mixClass()", function () {
    beforeEach(function () {
      $oop.classByMixinIds = {};
      Mixin1 = $oop.getClass("test.$oop.mixClass.Mixin1");
      Mixin2 = $oop.getClass("test.$oop.mixClass.Mixin2");
      Mixin3 = $oop.getClass("test.$oop.mixClass.Mixin3");
      result = $oop.mixClass(Mixin1, Mixin2, Mixin3);
    });

    it("should create a Class", function () {
      expect($oop.Class.isPrototypeOf(result)).toBeTruthy();
    });

    it("should mix specified mixins", function () {
      expect(result.mixes(Mixin1)).toBeTruthy();
      expect(result.mixes(Mixin2)).toBeTruthy();
      expect(result.mixes(Mixin3)).toBeTruthy();
    });

    it("should set class in lookup", function () {
      expect($oop.classByMixinIds).toEqual({
        "test.$oop.mixClass.Mixin1": {
          "test.$oop.mixClass.Mixin2": {
            "test.$oop.mixClass.Mixin3": result
          }
        }
      });
    });

    describe("when already mixed", function () {
      var Class;
      beforeEach(function () {
        Class = result;
        result = $oop.mixClass(Mixin1, Mixin2, Mixin3);
      });

      it("should fetch existing class", function () {
        expect(result).toBe(Class);
      });
    });
  });
});