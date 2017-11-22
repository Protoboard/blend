"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("HtmlText", function () {
    var HtmlText,
        htmlText;

    beforeAll(function () {
      HtmlText = $oop.getClass('test.$ui.HtmlText.HtmlText')
      .blend($ui.Text)
      .blend($ui.HtmlText);
      HtmlText.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize elementName", function () {
        htmlText = HtmlText.create();
        expect(htmlText.elementName).toBe('span');
      });
    });
  });

  describe("Text", function () {
    var text;

    describe("create()", function () {
      describe("in HTML environment", function () {
        it("should return HtmlText instance", function () {
          text = $ui.Text.create();
          expect($ui.HtmlText.mixedBy(text)).toBeTruthy();
        });
      });
    });
  });
});
