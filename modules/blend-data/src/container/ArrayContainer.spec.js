"use strict";

var $assert = window['blend-assert'],
    $data = window['blend-data'];

describe("$data", function () {
  describe("ArrayContainer", function () {
    var data,
        ArrayContainer,
        arrayContainer,
        result;

    beforeAll(function () {
      ArrayContainer = $oop.createClass('test.$data.ArrayContainer.ArrayContainer')
      .blend($data.DataContainer)
      .blend($data.ArrayContainer)
      .build();
    });

    beforeEach(function () {
      data = [];
      arrayContainer = ArrayContainer.create({data: data});
    });

    describe(".create()", function () {
      it("should set data property", function () {
        expect(arrayContainer.data).toBe(data);
      });

      describe("on missing arguments", function () {
        beforeEach(function () {
          arrayContainer = ArrayContainer.create();
        });

        it("should set data property", function () {
          expect(arrayContainer.data).toEqual([]);
        });
      });

      describe("on invalid arguments", function () {
        it("should throw", function () {
          expect(function () {
            $data.ArrayContainer.create({data: {}});
          }).toThrow();
        });
      });
    });

    describe("#destroy()", function () {
      beforeEach(function () {
        spyOn(arrayContainer, 'clear');
        result = arrayContainer.destroy();
      });

      it("should return self", function () {
        expect(result).toBe(arrayContainer);
      });

      it("should clear data", function () {
        expect(arrayContainer.clear).toHaveBeenCalled();
      });
    });

    describe("#clear()", function () {
      beforeEach(function () {
        result = arrayContainer.clear();
      });

      it("should return self", function () {
        expect(result).toBe(arrayContainer);
      });

      it("should replace data with empty object", function () {
        expect(arrayContainer.data).toEqual([]);
      });
    });
  });
});
