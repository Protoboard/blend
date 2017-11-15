"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("HtmlText", function () {
    var HtmlText,
        htmlText;

    beforeAll(function () {
      HtmlText = $oop.getClass('test.$widgets.HtmlText.HtmlText')
      .blend($widgets.Text)
      .blend($widgets.HtmlText);
      HtmlText.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize elementName", function () {
        htmlText = HtmlText.create();
        expect(htmlText.elementName).toBe('span');
      });
    });
  });

  describe("XmlText", function () {
    var text;

    describe("create()", function () {
      describe("in HTML environment", function () {
        it("should return HtmlText instance", function () {
          text = $widgets.XmlText.create();
          expect($widgets.HtmlText.mixedBy(text)).toBeTruthy();
        });
      });
    });
  });
});
