"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  describe("ClassMixer", function () {
    var classByClassId,
        classByMixinIds,
        Class,
        Mixin1, Mixin2,
        result;

    beforeEach(function () {
      classByClassId = $oop.classByClassId;
      classByMixinIds = $oop.classByMixinIds;
      $oop.classByClassId = {};
      $oop.classByMixinIds = {};
    });

    afterEach(function () {
      $oop.classByClassId = classByClassId;
      $oop.classByMixinIds = classByMixinIds;
    });

    describe("mixClass()", function () {
      beforeEach(function () {
        spyOn($oop, 'generateUuid').and.returnValue('foo');
        Class = $oop.getClass("test.$oop.ClassMixer.Class")
        .define({
          foo: 'FOO'
        });
        Mixin1 = $oop.getClass("test.$oop.ClassMixer.Mixin1")
        .define({
          bar: 'BAR'
        });
        Mixin2 = $oop.getClass("test.$oop.ClassMixer.Mixin2")
        .define({
          baz: 'BAZ'
        });
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
              foo: 0
            }
          }
        });
      });

      describe("when one argument mixes another", function () {
        var Mixin3;

        beforeEach(function () {
          Mixin3 = $oop.getClass("test.$oop.ClassMixer.Mixin3")
          .define({
            quux: 'QUUX'
          });
          Mixin1.mix(Mixin2);
        });

        it("should observe inheritance in mix order", function () {
          result = $oop.mixClass(Mixin1, Mixin2, Mixin3);
          expect(result.__contributors.list).toEqual([
            Mixin2,
            Mixin1,
            Mixin3
          ]);
        });
      });

      describe("when matching class is already in index", function () {
        beforeEach(function () {
          spyOn($oop.MixerIndex, 'getClassForMixins').and
          .returnValue(Class);
        });

        it("should retrieve class from index", function () {
          result = $oop.mixClass(Mixin1, Mixin2);
          expect($oop.MixerIndex.getClassForMixins)
          .toHaveBeenCalledWith([Mixin1, Mixin2]);
          expect(result).toBe(Class);
        });
      });

      describe("when existing class matches mixins", function () {
        var Mixin3;

        beforeEach(function () {
          Mixin3 = $oop.getClass('test.$oop.ClassMixer.Mixin3')
          .define({
            quux: 'QUUX'
          });

          $oop.getClass('test.$oop.ClassMixer.Class1')
          .mix(Mixin1);

          $oop.getClass('test.$oop.ClassMixer.Class2')
          .mix(Mixin1)
          .mix(Mixin2)
          .mix(Mixin3);

          // only Class matches exactly
          Class
          .mix(Mixin1)
          .mix(Mixin2);
        });

        it("should return matching class", function () {
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
