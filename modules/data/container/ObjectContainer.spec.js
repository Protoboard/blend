"use strict";

var $assert = window['giant-assert'],
    $data = window['giant-data'];

describe("$data", function () {
  describe("ObjectContainer", function () {
    var data,
        ObjectContainer,
        objectContainer,
        result;

    beforeEach(function () {
      data = {};
      ObjectContainer = $oop.getClass('test.$data.ObjectContainer.ObjectContainer')
      .mix($data.DataContainer)
      .mix($data.ObjectContainer);
      objectContainer = ObjectContainer.create(data);
    });

    describe("create()", function () {
      it("should set data property", function () {
        expect(objectContainer.data).toBe(data);
      });

      describe("on missing arguments", function () {
        beforeEach(function () {
          objectContainer = ObjectContainer.create();
        });

        it("should set data property", function () {
          expect(objectContainer.data).toEqual({});
        });
      });

      describe("on invalid arguments", function () {
        it("should throw", function () {
          expect(function () {
            $data.ObjectContainer.create("foo");
          }).toThrow();
        });
      });
    });

    describe("clear()", function () {
      beforeEach(function () {
        result = objectContainer.clear();
      });

      it("should return self", function () {
        expect(result).toBe(objectContainer);
      });

      it("should replace data with empty object", function () {
        expect(objectContainer.data).toEqual({});
      });
    });
  });
});
