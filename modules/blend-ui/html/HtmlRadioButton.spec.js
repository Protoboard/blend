"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("HtmlRadioButton", function () {
    var HtmlRadioButton,
        htmlRadioButton;

    beforeAll(function () {
      HtmlRadioButton = $oop.getClass('test.$ui.HtmlRadioButton.HtmlRadioButton')
      .blend($ui.RadioButton)
      .blend($ui.HtmlRadioButton);
      HtmlRadioButton.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize inputType", function () {
        htmlRadioButton = HtmlRadioButton.create();
        expect(htmlRadioButton.inputType).toBe('radio');
      });
    });
  });

  describe("RadioButton", function () {
    var radioButton;

    describe("create()", function () {
      describe("in HTML environment", function () {
        it("should return HtmlRadioButton instance", function () {
          radioButton = $ui.RadioButton.create();
          expect($ui.HtmlRadioButton.mixedBy(radioButton)).toBeTruthy();
        });
      });
    });
  });
});
