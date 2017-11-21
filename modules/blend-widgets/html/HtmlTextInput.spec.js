"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("HtmlTextInput", function () {
    var HtmlTextInput,
        htmlTextInput;

    beforeAll(function () {
      HtmlTextInput = $oop.getClass('test.$widgets.HtmlTextInput.HtmlTextInput')
      .blend($widgets.TextInput)
      .blend($widgets.HtmlTextInput);
      HtmlTextInput.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize inputType", function () {
        htmlTextInput = HtmlTextInput.create();
        expect(htmlTextInput.inputType).toBe('text');
      });
    });
  });

  describe("TextInput", function () {
    var textInput;

    describe("create()", function () {
      describe("when HTML is available", function () {
        it("should return HtmlTextInput instance", function () {
          textInput = $widgets.TextInput.create();
          expect($widgets.HtmlTextInput.mixedBy(textInput)).toBeTruthy();
        });
      });
    });
  });
});
