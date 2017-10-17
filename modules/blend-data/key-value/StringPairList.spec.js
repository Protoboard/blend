"use strict";

var $assert = window['blend-assert'],
    $data = window['blend-data'];

describe("$data", function () {
  var result;

  describe("DataContainer", function () {
    describe("asStringPairList()", function () {
      var container = $data.DataContainer.create({data: [1, 2, 3]});

      beforeEach(function () {
        result = container.asStringPairList();
      });

      it("should return a StringPairList instance", function () {
        expect($data.StringPairList.mixedBy(result))
        .toBeTruthy();
      });

      it("should set data buffer", function () {
        expect(result.data).toBe(container.data);
      });
    });
  });

  describe("SetContainer", function () {
    describe("toStringPairList()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.StringSet.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toStringPairList();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.StringPairList);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });

  describe("KeyValueContainer", function () {
    describe("toStringPairList()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.StringPairList.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toStringPairList();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.StringPairList);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });
});

describe("Array", function () {
  var result;

  describe("asStringPairList()", function () {
    var array = ['a', 'b', 'c'];

    beforeEach(function () {
      result = array.asStringPairList();
    });

    it("should return a StringPairList instance", function () {
      expect($data.StringPairList.mixedBy(result)).toBeTruthy();
    });

    it("should set data buffer", function () {
      expect(result.data).toBe(array);
    });
  });
});
