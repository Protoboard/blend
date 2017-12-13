"use strict";

var $oop = window['blend-oop'];

describe("$oop", function () {
  describe("ClassBlender", function () {
    var classByMixinIds;

    beforeEach(function () {
      classByMixinIds = $oop.classByMixinIds;
      $oop.classByMixinIds = {};
    });

    afterEach(function () {
      $oop.classByMixinIds = classByMixinIds;
    });

    describe("blendClass()", function () {
      var classBuilder,
          mixinBuilder1,
          mixinBuilder2,
          Class,
          Mixin1,
          Mixin2;

      beforeEach(function () {
        classBuilder = $oop.createClass('Class');
        mixinBuilder1 = $oop.createClass('Mixin1');
        mixinBuilder2 = $oop.createClass('Mixin2');
        Mixin1 = mixinBuilder1.build();
        Mixin2 = mixinBuilder2.build();
      });

      describe("when association is already stored", function () {
        beforeEach(function () {
          Class = classBuilder.build();
          $oop.BlenderIndex.addClassForMixins(Class, [mixinBuilder1,
            mixinBuilder2]);
        });

        it("should return stored class", function () {
          var result = $oop.ClassBlender.blendClass([Mixin1, Mixin2]);
          expect(result).toBe(Class);
        });
      });

      describe("when matching class exists", function () {
        beforeEach(function () {
          classBuilder
          .mix(Mixin1)
          .mix(Mixin2);
          Class = classBuilder.build();
        });

        it("should return matching class", function () {
          var result = $oop.ClassBlender.blendClass([Mixin1, Mixin2]);
          expect(result).toBe(Class);
        });
      });

      describe("when no stored nor matching class exist", function () {
        it("should create new class", function () {
          Class = $oop.ClassBlender.blendClass([Mixin1, Mixin2]);
          expect(Class.__builder.mixins.downstream.list).toEqual([
            mixinBuilder1,
            mixinBuilder2
          ]);
        });

        it("should leave className blank", function () {
          Class = $oop.ClassBlender.blendClass([Mixin1, Mixin2]);
          expect(Class.className).toBeUndefined();
        });
      });
    });
  });
});
