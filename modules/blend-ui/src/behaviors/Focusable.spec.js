"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Focusable", function () {
    var Focusable,
        focusable;

    beforeAll(function () {
      Focusable = $oop.createClass('test.$ui.Focusable.Focusable')
      .blend($widget.Widget)
      .blend($ui.Focusable)
      .build();
      Focusable.__builder.forwards = {list: [], lookup: {}};
    });

    describe("#focus()", function () {
      beforeEach(function () {
        focusable = Focusable.create();
      });

      it("should return self", function () {
        var result = focusable.focus();
        expect(result).toBe(focusable);
      });

      it("should set 'focused' state", function () {
        focusable.focus();
        expect(focusable.isFocused()).toBe(true);
      });

      it("should save before state", function () {
        focusable.focus();
        expect(focusable.focus.shared.focusedStateBefore).toBeFalsy();
      });
    });

    describe("#blur()", function () {
      beforeEach(function () {
        focusable = Focusable.create();
        focusable.focus();
      });

      it("should return self", function () {
        var result = focusable.blur();
        expect(result).toBe(focusable);
      });

      it("should set 'focused' state", function () {
        focusable.blur();
        expect(focusable.isFocused()).toBe(false);
      });

      it("should save before state", function () {
        focusable.blur();
        expect(focusable.blur.shared.focusedStateBefore).toBe(true);
      });
    });

    describe("#isFocused()", function () {
      beforeEach(function () {
        focusable = Focusable.create();
      });

      describe("when focused", function () {
        beforeEach(function () {
          focusable.focus();
        });

        it("should return truthy", function () {
          expect(focusable.isFocused()).toBeTruthy();
        });
      });

      describe("when blurred", function () {
        it("should return falsy", function () {
          expect(focusable.isFocused()).toBeFalsy();
        });
      });
    });
  });
});
