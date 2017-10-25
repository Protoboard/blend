"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("Text", function () {
    var Text,
        text;

    beforeAll(function () {
      Text = $oop.getClass('test.$widgets.Text.Text')
      .blend($widgets.Text);
      Text.__forwards = {list: [], sources: [], lookup: {}};
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

      it("should save beforeState", function () {
        text.setTextString('foo');

        text.setTextString('bar');
        expect(text.setTextString.saved.textStringBefore).toBe('foo');
      });
    });
  });
});
