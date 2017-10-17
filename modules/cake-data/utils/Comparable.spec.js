"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'];

describe("$data", function () {
  describe("Comparable", function () {
    var Comparable,
        comparable;

    beforeAll(function () {
      Comparable = $oop.getClass('test.$data.Comparable.Comparable')
      .mix($data.Comparable);
    });

    beforeEach(function () {
      comparable = Comparable.create();
    });

    describe("equals()", function () {
      var comparable2;

      beforeEach(function () {
        comparable2 = Comparable.create();
      });

      describe("when passing undefined", function () {
        it("should return false", function () {
          expect(comparable.equals(undefined)).toBeFalsy();
        });
      });

      describe("when passing self", function () {
        it("should return true", function () {
          expect(comparable.equals(comparable)).toBeTruthy();
        });
      });

      describe("when passing instanceof same class", function () {
        it("should return true", function () {
          expect(comparable.equals(comparable2)).toBeTruthy();
        });
      });

      describe("when passing instanceof different class", function () {
        it("should return false", function () {
          expect(comparable.equals($oop.getClass('test.$data.Comparable.Foo')
          .create()))
          .toBeFalsy();
        });
      });
    });
  });
});
