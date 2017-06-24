"use strict";

var $assert = window['giant-assert'],
  $data = window['giant-data'];

describe("$data", function () {
  var data,
    result;

  describe("DataContainer", function () {
    describe("toStringCollection()", function () {
      var container = $data.DataContainer.create([1, 2, 3]);

      beforeEach(function () {
        result = container.toStringCollection();
      });

      it("should return a StringCollection instance", function () {
        expect($data.StringCollection.isIncludedBy(result))
          .toBeTruthy();
      });

      it("should set data buffer", function () {
        expect(result._data).toBe(container._data);
      });
    });
  });
});

describe("Array", function () {
  var result;

  describe("toStringCollection()", function () {
    var array = ['a', 'b', 'c'];

    beforeEach(function () {
      result = array.toStringCollection();
    });

    it("should return a StringCollection instance", function () {
      expect($data.StringCollection.isIncludedBy(result)).toBeTruthy();
    });

    it("should set data buffer", function () {
      expect(result._data).toBe(array);
    });
  });
});
