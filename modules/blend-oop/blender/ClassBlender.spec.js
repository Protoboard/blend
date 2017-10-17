"use strict";

var $oop = window['blend-oop'];

describe("$oop", function () {
  describe("ClassBlender", function () {
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

    describe("blendClass()", function () {
      beforeEach(function () {
        spyOn($oop, 'generateUuid').and.returnValue('foo');
        Class = $oop.getClass("test.$oop.ClassBlender.Class")
        .define({
          foo: 'FOO'
        });
        Mixin1 = $oop.getClass("test.$oop.ClassBlender.Mixin1")
        .define({
          bar: 'BAR'
        });
        Mixin2 = $oop.getClass("test.$oop.ClassBlender.Mixin2")
        .define({
          baz: 'BAZ'
        });
      });

      it("should create a Class", function () {
        result = $oop.blendClass([Mixin1, Mixin2]);
        expect($oop.Class.isPrototypeOf(result)).toBeTruthy();
      });

      it("should mix specified mixins", function () {
        result = $oop.blendClass([Mixin1, Mixin2]);
        expect(result.mixes(Mixin1)).toBeTruthy();
        expect(result.mixes(Mixin2)).toBeTruthy();
      });

      it("should set class in lookup", function () {
        result = $oop.blendClass([Mixin1, Mixin2]);
        expect($oop.classByMixinIds).toEqual({
          "test.$oop.ClassBlender.Mixin1,test.$oop.ClassBlender.Mixin2": {
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
          Mixin3 = $oop.getClass("test.$oop.ClassBlender.Mixin3")
          .define({
            quux: 'QUUX'
          });
          Mixin1.blend(Mixin2);
        });

        it("should observe inheritance in mix order", function () {
          result = $oop.blendClass([Mixin1, Mixin2, Mixin3]);
          expect(result.__contributors.list).toEqual([
            Mixin2,
            Mixin1,
            Mixin3
          ]);
        });
      });

      describe("when matching class is already in index", function () {
        beforeEach(function () {
          spyOn($oop.BlenderIndex, 'getClassForMixins').and
          .returnValue(Class);
        });

        it("should retrieve class from index", function () {
          result = $oop.blendClass([Mixin1, Mixin2]);
          expect($oop.BlenderIndex.getClassForMixins)
          .toHaveBeenCalledWith([Mixin1, Mixin2]);
          expect(result).toBe(Class);
        });
      });

      describe("when existing class matches mixins", function () {
        var Mixin3;

        beforeEach(function () {
          Mixin3 = $oop.getClass('test.$oop.ClassBlender.Mixin3')
          .define({
            quux: 'QUUX'
          });

          $oop.getClass('test.$oop.ClassBlender.Class1')
          .blend(Mixin1);

          $oop.getClass('test.$oop.ClassBlender.Class2')
          .blend(Mixin1)
          .blend(Mixin2)
          .blend(Mixin3);

          // only Class matches exactly
          Class
          .blend(Mixin1)
          .blend(Mixin2);
        });

        it("should return matching class", function () {
          result = $oop.blendClass([Mixin1, Mixin2]);
          expect(result).toBe(Class);
        });
      });
    });
  });

  describe("blendClass()", function () {
    var Class, Mixin1, Mixin2,
        result;

    beforeEach(function () {
      Class = {};
      Mixin1 = {};
      Mixin2 = {};

      spyOn($oop.ClassBlender, 'blendClass').and.returnValue(Class);
    });

    it("should invoke ClassBlender.blendClass", function () {
      result = $oop.blendClass([Mixin1, Mixin2]);
      expect($oop.ClassBlender.blendClass)
      .toHaveBeenCalledWith([Mixin1, Mixin2]);
      expect(result).toBe(Class);
    });
  });
});
