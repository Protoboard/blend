"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Text", function () {
    var Text,
        text;

    beforeAll(function () {
      Text = $oop.getClass('test.$ui.Text.Text')
      .blend($ui.Text);
      Text.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize empty state", function () {
        text = Text.create();
        expect(text.getStateValue('empty')).toBeTruthy();
      });
    });

    describe("setTextString()", function () {
      beforeEach(function () {
        text = Text.create();
      });

      it("should return self", function () {
        var result = text.setTextString('foo');
        expect(result).toBe(text);
      });

      it("should set textString", function () {
        text.setTextString('foo');
        expect(text.textString).toBe('foo');
      });

      it("should update empty state", function () {
        text.setTextString('foo');
        expect(text.getStateValue('empty')).toBeFalsy();
      });

      describe("when passing empty string", function () {
        it("should update empty state", function () {
          text.setTextString('');
          expect(text.getStateValue('empty')).toBeTruthy();
        });
      });

      it("should save beforeState", function () {
        text.setTextString('foo');

        text.setTextString('bar');
        expect(text.setTextString.shared.textStringBefore).toBe('foo');
      });
    });
  });
});
