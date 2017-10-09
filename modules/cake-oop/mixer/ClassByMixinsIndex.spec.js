"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  describe("ClassByMixinsIndex", function () {
    var classByMixinIds,
        Class,
        Mixin1,
        Mixin2,
        result;

    beforeEach(function () {
      classByMixinIds = $oop.classByMixinIds;
      $oop.classByMixinIds = {};
      Class = $oop.getClass('test.$oop.CBMI.Class');
      Mixin1 = $oop.getClass('test.$oop.CBMI.Mixin1');
      Mixin2 = $oop.getClass('test.$oop.CBMI.Mixin2');
    });

    afterEach(function () {
      $oop.classByMixinIds = classByMixinIds;
    });

    describe("addClassForMixins()", function () {
      beforeEach(function () {
        result = $oop.ClassByMixinsIndex.addClassForMixins(
            Class, [Mixin1, Mixin2]);
      });

      it("should return self", function () {
        expect(result).toBe($oop.ClassByMixinsIndex);
      });

      it("should set Class in index", function () {
        expect($oop.classByMixinIds).toEqual({
          'test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2': {
            'test.$oop.CBMI.Class': Class
          }
        });
      });

      describe("when mixin's class ID contains comma", function () {
        var CommaMixin;

        beforeEach(function () {
          CommaMixin = $oop.getClass('test,$oop,CBMI,CommaMixin');
          result = $oop.ClassByMixinsIndex.addClassForMixins(
              Class, [Mixin1, CommaMixin]);
        });

        it("should escape comma in index key", function () {
          expect($oop.classByMixinIds['test.$oop.CBMI.Mixin1,test\\,$oop\\,CBMI\\,CommaMixin'])
          .toEqual({
            'test.$oop.CBMI.Class': Class
          });
        });
      });
    });

    describe("addClass()", function () {
      beforeEach(function () {
        Class
        .mix(Mixin1)
        .mix(Mixin2);

        result = $oop.ClassByMixinsIndex.addClass(Class);
      });

      it("should return self", function () {
        expect(result).toBe($oop.ClassByMixinsIndex);
      });

      it("should set Class in index", function () {
        expect($oop.classByMixinIds).toEqual({
          'test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2': {
            'test.$oop.CBMI.Class': Class
          }
        });
      });
    });

    describe("getClassForMixins()", function () {
      beforeEach(function () {
        $oop.ClassByMixinsIndex.addClassForMixins(Class, [Mixin1, Mixin2]);
        result = $oop.ClassByMixinsIndex.getClassForMixins([Mixin1, Mixin2]);
      });

      it("should return Class matching mixins", function () {
        expect(result).toBe(Class);
      });

      describe("when no Class matches mixins", function () {
        var Mixin3;

        beforeEach(function () {
          Mixin3 = $oop.getClass('test.$oop.CBMI.Mixin3');
          result = $oop.ClassByMixinsIndex.getClassForMixins([Mixin1, Mixin3]);
        });

        it("should return undefined", function () {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
