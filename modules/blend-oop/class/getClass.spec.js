"use strict";

var $oop = window['blend-oop'];

describe("$oop", function () {
  var classByClassId,
      Class,
      result;

  beforeEach(function () {
    classByClassId = $oop.classByClassId;
    $oop.classByClassId = {};
    Class = $oop.getClass('test.$oop.getClass.Class');
  });

  afterEach(function () {
    $oop.classByClassId = classByClassId;
  });

  describe("getClass()", function () {
    describe("when passing no arguments", function () {
      it("should throw", function () {
        expect(function () {
          $oop.getClass();
        }).toThrow();
      });
    });

    describe("when class already created", function () {
      beforeEach(function () {
        result = $oop.getClass('test.$oop.getClass.Class');
      });

      it("should return same class", function () {
        expect(result).toBe(Class);
      });
    });

    it("should set class ID", function () {
      expect(result.__classId).toEqual('test.$oop.getClass.Class');
    });

    it("should initialize member container", function () {
      expect(result.__members).toEqual({});
    });

    it("should initialize interfaces", function () {
      expect(result.__interfaces).toEqual({
        downstream: {list: [], lookup: {}},
        upstream: {list: [], lookup: {}}
      });
    });

    it("should initialize mixins", function () {
      expect(result.__mixins).toEqual({
        downstream: {list: [], lookup: {}},
        upstream: {list: [], lookup: {}}
      });
    });

    it("should initialize expected", function () {
      expect(result.__expected).toEqual({
        downstream: {list: [], lookup: {}},
        upstream: {list: [], lookup: {}}
      });
    });

    it("should initialize contributors", function () {
      expect(result.__contributors).toEqual({list: [], lookup: {}});
    });

    it("should initialize __methodMatrix", function () {
      expect(result.__methodMatrix).toEqual({});
    });

    it("should initialize missing method names", function () {
      expect(result.__missingMethodNames)
      .toEqual({list: [], lookup: {}});
    });

    it("should initialize forwards", function () {
      expect(result.__forwards).toEqual({
        list: [],
        sources: [],
        lookup: {}
      });
    });

    it("should initialize hash function", function () {
      expect(result.__mapper).toBeUndefined();
    });

    it("should initialize instance lookup", function () {
      expect(result.__instanceLookup).toEqual({});
    });

    it("should add Class to index", function () {
      expect($oop.classByClassId).toEqual({
        'test.$oop.getClass.Class': Class
      });
    });
  });
});