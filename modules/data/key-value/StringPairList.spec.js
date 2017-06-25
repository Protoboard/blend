"use strict";

var $assert = window['giant-assert'],
    $data = window['giant-data'];

describe("$data", function () {
  var data,
      result;

  describe("DataContainer", function () {
    describe("toStringPairList()", function () {
      var container = $data.DataContainer.create([1, 2, 3]);

      beforeEach(function () {
        result = container.toStringPairList();
      });

      it("should return a StringPairList instance", function () {
        expect($data.StringPairList.isIncludedBy(result))
        .toBeTruthy();
      });

      it("should set data buffer", function () {
        expect(result.data).toBe(container.data);
      });
    });
  });
});

describe("Array", function () {
  var result;

  describe("toStringPairList()", function () {
    var array = ['a', 'b', 'c'];

    beforeEach(function () {
      result = array.toStringPairList();
    });

    it("should return a StringPairList instance", function () {
      expect($data.StringPairList.isIncludedBy(result)).toBeTruthy();
    });

    it("should set data buffer", function () {
      expect(result.data).toBe(array);
    });
  });
});
