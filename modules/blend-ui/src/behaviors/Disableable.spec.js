"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Disableable", function () {
    var Disableable,
        disableable;

    beforeAll(function () {
      Disableable = $oop.createClass('test.$ui.Disableable.Disableable')
      .blend($widget.Widget)
      .blend($ui.Disableable)
      .build();
      Disableable.__builder.forwards = {list: [], lookup: {}};
    });

    describe("create()", function () {
      it("should add cascading state", function () {
        disableable = Disableable.create();
        expect(disableable.binaryStates.getValue('disabled'))
        .toEqual($ui.BinaryState.create({
          stateName: 'disabled',
          cascades: true
        }));
      });
    });

    describe("disableBy()", function () {
      beforeEach(function () {
        disableable = Disableable.create();
      });

      it("should return self", function () {
        var result = disableable.disableBy('foo');
        expect(result).toBe(disableable);
      });

      it("should add state source ID", function () {
        disableable.disableBy('foo');
        expect(disableable.binaryStates.getValue('disabled').stateSourceIds
        .hasItem('foo')).toBeTruthy();
      });

      it("should save before state", function () {
        disableable.disableBy('foo');
        expect(disableable.disableBy.shared.disabledStateBefore).toBeFalsy();
      });
    });

    describe("enableBy()", function () {
      beforeEach(function () {
        disableable = Disableable.create();
        disableable.disableBy('foo');
      });

      it("should return self", function () {
        var result = disableable.enableBy('foo');
        expect(result).toBe(disableable);
      });

      it("should remove state source ID", function () {
        disableable.enableBy('foo');
        expect(disableable.binaryStates.getValue('disabled').stateSourceIds
        .hasItem('foo')).toBeFalsy();
      });

      it("should save before state", function () {
        disableable.enableBy('foo');
        expect(disableable.enableBy.shared.disabledStateBefore).toBeTruthy();
      });
    });

    describe("isDisabled()", function () {
      beforeEach(function () {
        disableable = Disableable.create();
      });

      describe("when widget is disabled", function () {
        beforeEach(function () {
          disableable.disableBy('foo');
        });

        it("should return truthy", function () {
          expect(disableable.isDisabled()).toBeTruthy();
        });
      });

      describe("when widget is enabled", function () {
        it("should return falsy", function () {
          expect(disableable.isDisabled()).toBeFalsy();
        });
      });
    });
  });
});
