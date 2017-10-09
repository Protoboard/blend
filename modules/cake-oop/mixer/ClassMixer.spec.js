"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  describe("ClassMixer", function () {
    var classesByMixinId,
        Mixin1, Mixin2,
        result;

    beforeEach(function () {
      classesByMixinId = $oop.classesByMixinId;
      $oop.classesByMixinId = {};
    });

    afterEach(function () {
      $oop.classesByMixinId = classesByMixinId;
    });

    describe("mixClass()", function () {
      beforeEach(function () {
        $oop.classesByMixinId = {};
        spyOn($oop, 'generateUuid').and.returnValue('foo');
        Mixin1 = $oop.getClass("test.$oop.ClassMixer.Mixin1");
        Mixin2 = $oop.getClass("test.$oop.ClassMixer.Mixin2");
        result = $oop.mixClass(Mixin1, Mixin2);
      });

      it("should create a Class", function () {
        expect($oop.Class.isPrototypeOf(result)).toBeTruthy();
      });

      it("should mix specified mixins", function () {
        expect(result.mixes(Mixin1)).toBeTruthy();
        expect(result.mixes(Mixin2)).toBeTruthy();
      });

      it("should set class in lookup", function () {
        expect($oop.classesByMixinId).toEqual({
          "test\\.$oop\\.ClassMixer\\.Mixin1.test\\.$oop\\.ClassMixer\\.Mixin2": {
            foo: result
          }
        });
      });

      describe("when already mixed", function () {
        var Class;
        beforeEach(function () {
          Class = result;
          result = $oop.mixClass(Mixin1, Mixin2);
        });

        it("should fetch existing class", function () {
          expect(result).toBe(Class);
        });
      });
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
      result = $oop.mixClass(Mixin1, Mixin2);
    });

    it("should invoke ClassMixer.mixClass", function () {
      expect($oop.ClassMixer.mixClass).toHaveBeenCalledWith(Mixin1, Mixin2);
      expect(result).toBe(Class);
    });
  });
});
