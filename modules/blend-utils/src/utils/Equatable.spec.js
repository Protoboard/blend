"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'];

describe("$utils", function () {
  describe("Equatable", function () {
    var Equatable,
        equatable;

    beforeAll(function () {
      Equatable = $oop.createClass('test.$utils.Equatable.Equatable')
      .mix($utils.Equatable)
      .build();
    });

    describe("#equals()", function () {
      beforeEach(function () {
        equatable = Equatable.create();
      });

      describe("when passing undefined", function () {
        it("should return false", function () {
          expect(equatable.equals(undefined)).toBeFalsy();
        });
      });

      describe("when passing self", function () {
        it("should return true", function () {
          expect(equatable.equals(equatable)).toBeTruthy();
        });
      });

      describe("when passing instanceof same class", function () {
        var equatable2;

        beforeEach(function () {
          equatable2 = Equatable.create();
        });

        it("should return true", function () {
          expect(equatable.equals(equatable2)).toBeTruthy();
        });
      });

      describe("when passing instanceof different class", function () {
        var OtherClass;

        beforeEach(function () {
          OtherClass = $oop.createClass('test.$utils.Equatable.OtherClass')
          .build();
        });

        it("should return false", function () {
          expect(equatable.equals(OtherClass.create())).toBeFalsy();
        });
      });
    });
  });
});
