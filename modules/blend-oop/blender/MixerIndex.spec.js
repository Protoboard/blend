"use strict";

var $oop = window['blend-oop'];

describe("$oop", function () {
  describe("MixerIndex", function () {
    var klassByMixinIds;

    beforeEach(function () {
      $oop.ClassBuilder.lastClassId = -1;
      klassByMixinIds = $oop.klassByMixinIds;
      $oop.klassByMixinIds = {};
    });

    afterEach(function () {
      $oop.klassByMixinIds = klassByMixinIds;
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
        var result = $oop.MixerIndex.addClassForMixins(Class, [mixinBuilder1,
          mixinBuilder2]);
        expect(result).toBe($oop.MixerIndex);
      });

      it("should add class to index", function () {
        $oop.MixerIndex.addClassForMixins(Class, [mixinBuilder1,
          mixinBuilder2]);
        expect($oop.klassByMixinIds).toEqual({
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
        var result = $oop.MixerIndex.addClass(Class);
        expect(result).toBe($oop.MixerIndex);
      });

      it("should add class to index", function () {
        $oop.MixerIndex.addClass(Class);
        expect($oop.klassByMixinIds).toEqual({
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
        $oop.MixerIndex.addClassForMixins(Class, [mixinBuilder1,
          mixinBuilder2]);
      });

      it("should return class associated with mixins", function () {
        var result = $oop.MixerIndex.getClassForMixins([mixinBuilder1,
          mixinBuilder2]);
        expect(result).toBe(Class);
      });
    });
  });
});
