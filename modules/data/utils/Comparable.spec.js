"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
  describe("Comparable", function () {
    var Comparable,
        comparable;

    beforeEach(function () {
      Comparable = $oop.getClass('test.$data.Comparable.Comparable')
      .mixOnly($data.Comparable);

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
