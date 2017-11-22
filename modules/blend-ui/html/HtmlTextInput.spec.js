"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("HtmlTextInput", function () {
    var HtmlTextInput,
        htmlTextInput;

    beforeAll(function () {
      HtmlTextInput = $oop.getClass('test.$ui.HtmlTextInput.HtmlTextInput')
      .blend($ui.TextInput)
      .blend($ui.HtmlTextInput);
      HtmlTextInput.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize inputType", function () {
        htmlTextInput = HtmlTextInput.create();
        expect(htmlTextInput.inputType).toBe('text');
      });
    });
  });

  describe("HtmlTextInput", function () {
    var HtmlTextInput,
        htmlTextInput;

    beforeAll(function () {
      HtmlTextInput = $oop.getClass('test.$ui.HtmlTextInput.HtmlTextInput')
      .blend($ui.TextInput)
      .blend($ui.HtmlTextInput);
    });

    describe("create()", function () {
      describe("when multiline is falsy", function () {
        it("should blend OtherInputTypeHost", function () {
          htmlTextInput = HtmlTextInput.create();
          expect($ui.OtherInputTypeHost.mixedBy(htmlTextInput)).toBeTruthy();
        });
      });

      describe("when multiline is truthy", function () {
        it("should blend OtherInputTypeHost", function () {
          htmlTextInput = HtmlTextInput.create({
            multiline: true
          });
          expect($ui.TextareaElementHost.mixedBy(htmlTextInput)).toBeTruthy();
        });
      });
    });
  });

  describe("TextInput", function () {
    var textInput;

    describe("create()", function () {
      describe("when HTML is available", function () {
        it("should return HtmlTextInput instance", function () {
          textInput = $ui.TextInput.create();
          expect($ui.HtmlTextInput.mixedBy(textInput)).toBeTruthy();
        });
      });
    });
  });
});
