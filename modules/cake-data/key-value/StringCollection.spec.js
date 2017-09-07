"use strict";

var $assert = window['cake-assert'],
    $data = window['cake-data'];

describe("$data", function () {
  var result;

  describe("DataContainer", function () {
    describe("asStringCollection()", function () {
      var container = $data.DataContainer.create({data: [1, 2, 3]});

      beforeEach(function () {
        result = container.asStringCollection();
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

  describe("SetContainer", function () {
    describe("toStringCollection()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.StringSet.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toStringCollection();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.StringCollection);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });

  describe("KeyValueContainer", function () {
    describe("toStringCollection()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.StringCollection.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toStringCollection();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.StringCollection);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });
});

describe("Array", function () {
  var result;

  describe("asStringCollection()", function () {
    var array = ['a', 'b', 'c'];

    beforeEach(function () {
      result = array.asStringCollection();
    });

    it("should return a StringCollection instance", function () {
      expect($data.StringCollection.mixedBy(result)).toBeTruthy();
    });

    it("should set data buffer", function () {
      expect(result.data).toBe(array);
    });
  });
});
