"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  describe("MixerIndex", function () {
    var classByMixinIds,
        Class,
        Mixin1,
        Mixin2,
        result;

    beforeAll(function () {
      Class = $oop.getClass('test.$oop.CBMI.Class');
      Mixin1 = $oop.getClass('test.$oop.CBMI.Mixin1');
      Mixin2 = $oop.getClass('test.$oop.CBMI.Mixin2');
    });

    beforeEach(function () {
      classByMixinIds = $oop.classByMixinIds;
      $oop.classByMixinIds = {};
    });

    afterEach(function () {
      $oop.classByMixinIds = classByMixinIds;
    });

    describe("setClassForMixins()", function () {
      var AdHoc;

      beforeAll(function () {
        AdHoc = $oop.getClass('2b684b1b-6ba8-48b0-964f-4ba1a9bea9fe');
      });

      beforeEach(function () {
        $oop.classByMixinIds['test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2'] = {
          list: [AdHoc],
          lookup: {'2b684b1b-6ba8-48b0-964f-4ba1a9bea9fe': 0}
        };
      });

      afterEach(function () {
        delete $oop.classByMixinIds['test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2'];
      });

      it("should return self", function () {
        result = $oop.MixerIndex.setClassForMixins(
            Class, [Mixin1, Mixin2]);
        expect(result).toBe($oop.MixerIndex);
      });

      it("should set declared Class before ad-hoc", function () {
        result = $oop.MixerIndex.setClassForMixins(
            Class, [Mixin1, Mixin2]);
        expect($oop.classByMixinIds).toEqual({
          'test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2': {
            list: [Class, AdHoc],
            lookup: {
              '2b684b1b-6ba8-48b0-964f-4ba1a9bea9fe': 1,
              'test.$oop.CBMI.Class': 0
            }
          }
        });
      });

      describe("when mixin's class ID contains comma", function () {
        var CommaMixin;

        beforeAll(function () {
          CommaMixin = $oop.getClass('test,$oop,CBMI,CommaMixin');
        });

        beforeEach(function () {
          result = $oop.MixerIndex.setClassForMixins(
              Class, [Mixin1, Mixin2]);
        });

        it("should escape comma in index key", function () {
          result = $oop.MixerIndex.setClassForMixins(
              Class, [Mixin1, CommaMixin]);
          expect($oop.classByMixinIds['test.$oop.CBMI.Mixin1,test\\,$oop\\,CBMI\\,CommaMixin'])
          .toEqual({
            list: [Class],
            lookup: {'test.$oop.CBMI.Class': 0}
          });
        });
      });
    });

    describe("setClass()", function () {
      beforeEach(function () {
        Class
        .mixOnly(Mixin1)
        .mixOnly(Mixin2);
      });

      it("should return self", function () {
        result = $oop.MixerIndex.setClass(Class);
        expect(result).toBe($oop.MixerIndex);
      });

      it("should set Class in index", function () {
        $oop.MixerIndex.setClass(Class);
        expect($oop.classByMixinIds).toEqual({
          'test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2': {
            list: [Class],
            lookup: {'test.$oop.CBMI.Class': 0}
          }
        });
      });
    });

    describe("deleteClassForMixins()", function () {
      var AdHoc;

      beforeAll(function () {
        AdHoc = $oop.getClass('2b684b1b-6ba8-48b0-964f-4ba1a9bea9fe');
      });

      beforeEach(function () {
        $oop.MixerIndex
        .setClassForMixins(AdHoc, [Mixin1, Mixin2])
        .setClassForMixins(Class, [Mixin1, Mixin2]);
      });

      it("should return self", function () {
        result = $oop.MixerIndex.deleteClassForMixins(
            Class, [Mixin1, Mixin2]);
        expect(result).toBe($oop.MixerIndex);
      });

      it("should delete Class from index", function () {
        $oop.MixerIndex.deleteClassForMixins(Class, [Mixin1, Mixin2]);
        expect($oop.classByMixinIds).toEqual({
          'test.$oop.CBMI.Mixin1,test.$oop.CBMI.Mixin2': {
            list: [AdHoc],
            lookup: {'2b684b1b-6ba8-48b0-964f-4ba1a9bea9fe': 0}
          }
        });
      });
    });

    describe("deleteClass()", function () {
      beforeEach(function () {
        Class
        .mixOnly(Mixin1)
        .mixOnly(Mixin2);
        $oop.MixerIndex.setClass(Class);
      });

      it("should return self", function () {
        result = $oop.MixerIndex.deleteClass(Class);
        expect(result).toBe($oop.MixerIndex);
      });

      it("should delete Class from index", function () {
        $oop.MixerIndex.deleteClass(Class);
        expect($oop.classByMixinIds).toEqual({});
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

        beforeAll(function () {
          Mixin3 = $oop.getClass('test.$oop.CBMI.Mixin3');
        });

        beforeEach(function () {
          result = $oop.MixerIndex.getClassForMixins([Mixin1, Mixin3]);
        });

        it("should return undefined", function () {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
