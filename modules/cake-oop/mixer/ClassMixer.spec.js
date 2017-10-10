"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  describe("ClassMixer", function () {
    var classByMixinIds,
        mixinsByClassId,
        Class,
        Mixin1, Mixin2,
        result;

    beforeEach(function () {
      classByMixinIds = $oop.classByMixinIds;
      mixinsByClassId = $oop.mixinsByClassId;
      $oop.classByMixinIds = {};
      $oop.mixinsByClassId = {};
    });

    afterEach(function () {
      $oop.classByMixinIds = classByMixinIds;
      $oop.mixinsByClassId = mixinsByClassId;
    });

    describe("mixClass()", function () {
      beforeEach(function () {
        spyOn($oop, 'generateUuid').and.returnValue('foo');
        Class = $oop.getClass("test.$oop.ClassMixer.Class");
        Mixin1 = $oop.getClass("test.$oop.ClassMixer.Mixin1");
        Mixin2 = $oop.getClass("test.$oop.ClassMixer.Mixin2");
      });

      it("should create a Class", function () {
        result = $oop.mixClass(Mixin1, Mixin2);
        expect($oop.Class.isPrototypeOf(result)).toBeTruthy();
      });

      it("should mix specified mixins", function () {
        result = $oop.mixClass(Mixin1, Mixin2);
        expect(result.mixes(Mixin1)).toBeTruthy();
        expect(result.mixes(Mixin2)).toBeTruthy();
      });

      it("should set class in lookup", function () {
        result = $oop.mixClass(Mixin1, Mixin2);
        expect($oop.classByMixinIds).toEqual({
          "test.$oop.ClassMixer.Mixin1,test.$oop.ClassMixer.Mixin2": {
            list: [result],
            lookup: {
              foo: true
            }
          }
        });
      });

      describe("when matching class is already in index", function () {
        beforeEach(function () {
          spyOn($oop.ClassByMixinsIndex, 'getClassForMixins').and
          .returnValue(Class);
        });

        it("should retrieve class from index", function () {
          result = $oop.mixClass(Mixin1, Mixin2);
          expect($oop.ClassByMixinsIndex.getClassForMixins)
          .toHaveBeenCalledWith([Mixin1, Mixin2]);
          expect(result).toBe(Class);
        });
      });

      describe("when existing class matches mixins", function () {
        beforeEach(function () {
          Class.mix(Mixin1).mix(Mixin2);
        });

        it("should return class", function () {
          result = $oop.mixClass(Mixin1, Mixin2);
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
    });

    it("should invoke ClassMixer.mixClass", function () {
      result = $oop.mixClass(Mixin1, Mixin2);
      expect($oop.ClassMixer.mixClass).toHaveBeenCalledWith(Mixin1, Mixin2);
      expect(result).toBe(Class);
    });
  });
});
