"use strict";

var $assert = window['cake-assert'],
    $data = window['cake-data'];

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
        expect($data.StringCollection.mixedBy(result))
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

  describe("toStringCollection()", function () {
    var array = ['a', 'b', 'c'];

    beforeEach(function () {
      result = array.toStringCollection();
    });

    it("should return a StringCollection instance", function () {
      expect($data.StringCollection.mixedBy(result)).toBeTruthy();
    });

    it("should set data buffer", function () {
      expect(result.data).toBe(array);
    });
  });
});
