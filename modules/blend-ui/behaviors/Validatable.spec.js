"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Validatable", function () {
    var Validatable,
        validatable;

    beforeAll(function () {
      Validatable = $oop.createClass('test.$ui.Validatable.Validatable')
      .blend($widget.Widget)
      .blend($ui.Inputable)
      .blend($ui.Validatable)
      .build();
      Validatable.__builder.forwards = {list: [], lookup: {}};
    });

    describe("create()", function () {
      it("should add non-cascading state", function () {
        validatable = Validatable.create();
        expect(validatable.binaryStates.getValue('invalid'))
        .toEqual($ui.BinaryState.create({
          stateName: 'invalid'
        }));
      });
    });

    describe("invalidateBy()", function () {
      beforeEach(function () {
        validatable = Validatable.create();
      });

      it("should return self", function () {
        var result = validatable.invalidateBy('foo');
        expect(result).toBe(validatable);
      });

      it("should add state source ID", function () {
        validatable.invalidateBy('foo');
        expect(validatable.binaryStates.getValue('invalid').stateSourceIds
        .hasItem('foo')).toBeTruthy();
      });

      it("should save before state", function () {
        validatable.invalidateBy('foo');
        expect(validatable.invalidateBy.shared.invalidStateBefore).toBeFalsy();
      });
    });

    describe("validateBy()", function () {
      beforeEach(function () {
        validatable = Validatable.create();
        validatable.invalidateBy('foo');
      });

      it("should return self", function () {
        var result = validatable.validateBy('foo');
        expect(result).toBe(validatable);
      });

      it("should remove state source ID", function () {
        validatable.validateBy('foo');
        expect(validatable.binaryStates.getValue('invalid').stateSourceIds
        .hasItem('foo')).toBeFalsy();
      });

      it("should save before state", function () {
        validatable.validateBy('foo');
        expect(validatable.validateBy.shared.invalidStateBefore).toBeTruthy();
      });
    });

    describe("isValid()", function () {
      beforeEach(function () {
        validatable = Validatable.create();
      });

      describe("when widget is invalid", function () {
        beforeEach(function () {
          validatable.invalidateBy('foo');
        });

        it("should return falsy", function () {
          expect(validatable.isValid()).toBeFalsy();
        });
      });

      describe("when widget is valid", function () {
        it("should return truthy", function () {
          expect(validatable.isValid()).toBeTruthy();
        });
      });
    });
  });
});
