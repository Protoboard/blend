"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  describe("ClassByMixinsIndex", function () {
    var classByMixinIds,
        mixinsByClassId,
        Class,
        Mixin1,
        Mixin2,
        result;

    beforeEach(function () {
      classByMixinIds = $oop.classByMixinIds;
      mixinsByClassId = $oop.mixinsByClassId;
      $oop.classByMixinIds = {};
      $oop.mixinsByClassId = {};
      Class = $oop.getClass('test.$oop.CBMI.Class');
      Mixin1 = $oop.getClass('test.$oop.CBMI.Mixin1');
      Mixin2 = $oop.getClass('test.$oop.CBMI.Mixin2');
    });

    afterEach(function () {
      $oop.classByMixinIds = classByMixinIds;
      $oop.mixinsByClassId = mixinsByClassId;
    });

    describe("setClassForMixins()", function () {
      beforeEach(function () {
        result = $oop.ClassByMixinsIndex.setClassForMixins(
            Class, [Mixin1, Mixin2]);
      });

      it("should return self", function () {
        expect(result).toBe($oop.ClassByMixinsIndex);
      });

      it("should set Class in index", function () {
        expect($oop.classByMixinIds).toEqual({
          'test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2': {
            list: [Class],
            lookup: {
              'test.$oop.CBMI.Class': true
            }
          }
        });
      });

      describe("when mixin's class ID contains comma", function () {
        var CommaMixin;

        beforeEach(function () {
          CommaMixin = $oop.getClass('test,$oop,CBMI,CommaMixin');
          result = $oop.ClassByMixinsIndex.setClassForMixins(
              Class, [Mixin1, CommaMixin]);
        });

        it("should escape comma in index key", function () {
          expect($oop.classByMixinIds['test.$oop.CBMI.Mixin1,test\\,$oop\\,CBMI\\,CommaMixin'])
          .toEqual({
            list: [Class],
            lookup: {'test.$oop.CBMI.Class': true}
          });
        });
      });
    });

    describe("setClass()", function () {
      beforeEach(function () {
        Class
        .mixOnly(Mixin1)
        .mixOnly(Mixin2);

        result = $oop.ClassByMixinsIndex.setClass(Class);
      });

      it("should return self", function () {
        expect(result).toBe($oop.ClassByMixinsIndex);
      });

      it("should set Class in index", function () {
        expect($oop.classByMixinIds).toEqual({
          'test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2': {
            list: [Class],
            lookup: {'test.$oop.CBMI.Class': true}
          }
        });
      });
    });

    describe("getClassForMixins()", function () {
      beforeEach(function () {
        $oop.ClassByMixinsIndex.setClassForMixins(Class, [Mixin1, Mixin2]);
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
