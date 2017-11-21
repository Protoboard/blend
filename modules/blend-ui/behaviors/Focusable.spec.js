"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Focusable", function () {
    var Focusable,
        focusable;

    beforeAll(function () {
      Focusable = $oop.getClass('test.$ui.Focusable.Focusable')
      .blend($widget.Widget)
      .blend($ui.Focusable);
      Focusable.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize isFocused", function () {
        focusable = Focusable.create();
        expect(focusable.isFocused).toBe(false);
      });
    });

    describe("focus()", function () {
      beforeEach(function () {
        focusable = Focusable.create();
      });

      it("should return self", function () {
        var result = focusable.focus();
        expect(result).toBe(focusable);
      });

      it("should set isFocusable", function () {
        focusable.focus();
        expect(focusable.isFocused).toBe(true);
      });

      it("should save before state", function () {
        focusable.focus();
        expect(focusable.focus.shared.isFocusedBefore).toBe(false);
      });
    });

    describe("blur()", function () {
      beforeEach(function () {
        focusable = Focusable.create();
        focusable.focus();
      });

      it("should return self", function () {
        var result = focusable.blur();
        expect(result).toBe(focusable);
      });

      it("should set isFocusable", function () {
        focusable.blur();
        expect(focusable.isFocused).toBe(false);
      });

      it("should save before state", function () {
        focusable.blur();
        expect(focusable.blur.shared.isFocusedBefore).toBe(true);
      });
    });
  });
});
