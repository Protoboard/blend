"use strict";

var $oop = window['giant-oop'];

describe("$oop", function () {
  var Mixin1, Mixin2, Mixin3,
      result;

  describe("Class", function () {
    describe("mixClass()", function () {
      beforeEach(function () {
        $oop.Class.classByMixinIds = {};
        Mixin1 = $oop.getClass("test.$oop.Class-mixClass.Mixin1");
        Mixin2 = $oop.getClass("test.$oop.Class-mixClass.Mixin2");
        Mixin3 = $oop.getClass("test.$oop.Class-mixClass.Mixin3");
        result = $oop.Class.mixClass(Mixin1, Mixin2, Mixin3);
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
        expect($oop.Class.classByMixinIds).toEqual({
          "test.$oop.Class-mixClass.Mixin1": {
            "test.$oop.Class-mixClass.Mixin2": {
              "test.$oop.Class-mixClass.Mixin3": result
            }
          }
        });
      });

      describe("when already mixed", function () {
        var Class;
        beforeEach(function () {
          Class = result;
          result = $oop.Class.mixClass(Mixin1, Mixin2, Mixin3);
        });

        it("should fetch existing class", function () {
          expect(result).toBe(Class);
        });
      });
    });
  });

  describe("mixClass()", function () {
    var Class, Mixin1, Mixin2, Mixin3;

    beforeEach(function () {
      Class = $oop.getClass('test.$oop.Class-mixClass.Class');
      Mixin1 = $oop.getClass('test.$oop.Class-mixClass.Mixin1');
      Mixin2 = $oop.getClass('test.$oop.Class-mixClass.Mixin2');
      Mixin3 = $oop.getClass('test.$oop.Class-mixClass.Mixin3');

      spyOn($oop.Class, 'mixClass').and.returnValue(Class);
      result = $oop.mixClass(Mixin1, Mixin2, Mixin3);
    });

    it("should invoke Class.mixClass", function () {
      expect($oop.Class.mixClass).toHaveBeenCalledWith(Mixin1, Mixin2, Mixin3);
      expect(result).toBe(Class);
    });
  });
});