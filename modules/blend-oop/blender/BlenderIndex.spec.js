"use strict";

var $oop = window['blend-oop'];

describe("$oop", function () {
  describe("BlenderIndex", function () {
    var classByMixinIds;

    beforeEach(function () {
      $oop.ClassBuilder.lastClassId = -1;
      classByMixinIds = $oop.classByMixinIds;
      $oop.classByMixinIds = {};
    });

    afterEach(function () {
      $oop.classByMixinIds = classByMixinIds;
    });

    describe("addClassForMixins()", function () {
      var mixinBuilder1,
          mixinBuilder2,
          Class;

      beforeEach(function () {
        mixinBuilder1 = $oop.createClass('Mixin1');
        mixinBuilder2 = $oop.createClass('Mixin2');
        Class = $oop.createClass('Class').build();
      });

      it("should return self", function () {
        var result = $oop.BlenderIndex.addClassForMixins(Class, [mixinBuilder1,
          mixinBuilder2]);
        expect(result).toBe($oop.BlenderIndex);
      });

      it("should add class to index", function () {
        $oop.BlenderIndex.addClassForMixins(Class, [mixinBuilder1,
          mixinBuilder2]);
        expect($oop.classByMixinIds).toEqual({
          '0,1': Class
        });
      });
    });

    describe("addClass()", function () {
      var mixinBuilder1,
          mixinBuilder2,
          classBuilder,
          Class;

      beforeEach(function () {
        mixinBuilder1 = $oop.createClass('Mixin1');
        mixinBuilder2 = $oop.createClass('Mixin2');
        classBuilder = $oop.createClass('Class')
        .mix(mixinBuilder1.build())
        .mix(mixinBuilder2.build());
        Class = classBuilder.build();
      });

      it("should return self", function () {
        var result = $oop.BlenderIndex.addClass(Class);
        expect(result).toBe($oop.BlenderIndex);
      });

      it("should add class to index", function () {
        $oop.BlenderIndex.addClass(Class);
        expect($oop.classByMixinIds).toEqual({
          '0,1': Class
        });
      });
    });

    describe("getClassForMixins()", function () {
      var mixinBuilder1,
          mixinBuilder2,
          Class;

      beforeEach(function () {
        mixinBuilder1 = $oop.createClass('Mixin1');
        mixinBuilder2 = $oop.createClass('Mixin2');
        Class = $oop.createClass('Class').build();
        $oop.BlenderIndex.addClassForMixins(Class, [mixinBuilder1,
          mixinBuilder2]);
      });

      it("should return class associated with mixins", function () {
        var result = $oop.BlenderIndex.getClassForMixins([mixinBuilder1,
          mixinBuilder2]);
        expect(result).toBe(Class);
      });
    });
  });
});
