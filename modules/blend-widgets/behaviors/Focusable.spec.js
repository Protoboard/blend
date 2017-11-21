"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("Focusable", function () {
    var Focusable,
        focusable;

    beforeAll(function () {
      Focusable = $oop.getClass('test.$widgets.Focusable.Focusable')
      .blend($widget.Widget)
      .blend($widgets.Focusable);
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
