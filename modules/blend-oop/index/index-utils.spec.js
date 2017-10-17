"use strict";

var $oop = window['blend-oop'];

describe("$oop", function () {
  var indexEntry,
      index,
      result;

  beforeEach(function () {
    indexEntry = {
      list: [],
      lookup: {}
    };
    index = {
      foo: indexEntry
    };
  });

  describe("getSafeQuickList()", function () {
    it("should retrieve specified indexEntry", function () {
      result = $oop.getSafeQuickList(index, 'foo');
      expect(result).toBe(indexEntry);
    });

    describe("on absent key", function () {
      it("should store new entry in index", function () {
        result = $oop.getSafeQuickList(index, 'bar');
        expect(result).toEqual({
          list: [],
          lookup: {}
        });
        expect(index.bar).toEqual({
          list: [],
          lookup: {}
        });
      });
    });
  });
});