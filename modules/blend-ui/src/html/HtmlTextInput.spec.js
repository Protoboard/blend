"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("HtmlTextInput", function () {
    var HtmlTextInput,
        htmlTextInput;

    beforeAll(function () {
      HtmlTextInput = $oop.createClass('test.$ui.HtmlTextInput.HtmlTextInput')
      .blend($ui.TextInput)
      .blend($ui.HtmlTextInput)
      .build();
      HtmlTextInput.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".create()", function () {
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
      HtmlTextInput = $oop.createClass('test.$ui.HtmlTextInput.HtmlTextInput')
      .blend($ui.TextInput)
      .blend($ui.HtmlTextInput)
      .build();
    });

    describe(".create()", function () {
      describe("when isMultiline is falsy", function () {
        it("should blend OtherInputTypeHost", function () {
          htmlTextInput = HtmlTextInput.create();
          expect($ui.OtherInputTypeHost.mixedBy(htmlTextInput)).toBeTruthy();
        });
      });

      describe("when isMultiline is truthy", function () {
        it("should blend OtherInputTypeHost", function () {
          htmlTextInput = HtmlTextInput.create({
            isMultiline: true
          });
          expect($ui.TextareaElementHost.mixedBy(htmlTextInput)).toBeTruthy();
        });
      });
    });
  });

  describe("TextInput", function () {
    var textInput;

    describe(".create()", function () {
      describe("when HTML is available", function () {
        it("should return HtmlTextInput instance", function () {
          textInput = $ui.TextInput.create();
          expect($ui.HtmlTextInput.mixedBy(textInput)).toBeTruthy();
        });
      });
    });
  });
});
