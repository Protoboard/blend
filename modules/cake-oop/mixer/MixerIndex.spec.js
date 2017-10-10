"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  describe("MixerIndex", function () {
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
        spyOn($oop.MixerIndex, '_updateClassOrderForMixins').and
        .callThrough();
      });

      it("should return self", function () {
        result = $oop.MixerIndex.setClassForMixins(
            Class, [Mixin1, Mixin2]);
        expect(result).toBe($oop.MixerIndex);
      });

      it("should set Class in index", function () {
        result = $oop.MixerIndex.setClassForMixins(
            Class, [Mixin1, Mixin2]);
        expect($oop.classByMixinIds).toEqual({
          'test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2': {
            list: [Class],
            lookup: {
              'test.$oop.CBMI.Class': true
            }
          }
        });
      });

      it("should set mixinHash in index", function () {
        result = $oop.MixerIndex.setClassForMixins(
            Class, [Mixin1, Mixin2]);
        expect($oop.mixinsByClassId).toEqual({
          'test.$oop.CBMI.Class': {
            list: ['test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2'],
            lookup: {
              'test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2': true
            }
          }
        });
      });

      // todo Need better test for this.
      it("should update class order in index", function () {
        result = $oop.MixerIndex.setClassForMixins(
            Class, [Mixin1, Mixin2]);
        expect($oop.MixerIndex._updateClassOrderForMixins)
        .toHaveBeenCalledWith('test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2');
      });

      describe("when mixin's class ID contains comma", function () {
        var CommaMixin;

        beforeEach(function () {
          CommaMixin = $oop.getClass('test,$oop,CBMI,CommaMixin');
          result = $oop.MixerIndex.setClassForMixins(
              Class, [Mixin1, Mixin2]);
        });

        it("should escape comma in index key", function () {
          result = $oop.MixerIndex.setClassForMixins(
              Class, [Mixin1, CommaMixin]);

          expect($oop.classByMixinIds['test.$oop.CBMI.Mixin1,test\\,$oop\\,CBMI\\,CommaMixin'])
          .toEqual({
            list: [Class],
            lookup: {'test.$oop.CBMI.Class': true}
          });
          expect($oop.mixinsByClassId['test.$oop.CBMI.Class'].list)
          .toContain('test.$oop.CBMI.Mixin1,test\\,$oop\\,CBMI\\,CommaMixin');
          expect($oop.mixinsByClassId['test.$oop.CBMI.Class']
              .lookup['test.$oop.CBMI.Mixin1,test\\,$oop\\,CBMI\\,CommaMixin'])
          .toBe(true);
        });
      });
    });

    describe("setClass()", function () {
      beforeEach(function () {
        Class
        .mixOnly(Mixin1)
        .mixOnly(Mixin2);

        result = $oop.MixerIndex.setClass(Class);
      });

      it("should return self", function () {
        expect(result).toBe($oop.MixerIndex);
      });

      it("should set Class in index", function () {
        expect($oop.classByMixinIds).toEqual({
          'test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2': {
            list: [Class],
            lookup: {'test.$oop.CBMI.Class': true}
          }
        });
        expect($oop.mixinsByClassId).toEqual({
          'test.$oop.CBMI.Class': {
            list: ['test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2'],
            lookup: {
              'test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2': true
            }
          }
        });
      });
    });

    describe("getClassForMixins()", function () {
      beforeEach(function () {
        $oop.MixerIndex.setClassForMixins(Class, [Mixin1, Mixin2]);
      });

      it("should return Class matching mixins", function () {
        result = $oop.MixerIndex.getClassForMixins([Mixin1, Mixin2]);
        expect(result).toBe(Class);
      });

      describe("when no Class matches mixins", function () {
        var Mixin3;

        beforeEach(function () {
          Mixin3 = $oop.getClass('test.$oop.CBMI.Mixin3');
          result = $oop.MixerIndex.getClassForMixins([Mixin1, Mixin3]);
        });

        it("should return undefined", function () {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
