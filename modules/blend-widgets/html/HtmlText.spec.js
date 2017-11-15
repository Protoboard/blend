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
    var XmlText,
        xmlText;

    beforeAll(function () {
      XmlText = $oop.getClass('test.$widgets.HtmlText.XmlText')
      .blend($widgets.Text)
      .blend($widgets.XmlText);
    });

    describe("create()", function () {
      describe("in HTML environment", function () {
        it("should return HtmlText instance", function () {
          xmlText = XmlText.create();
          expect($widgets.HtmlText.mixedBy(xmlText)).toBeTruthy();
        });
      });
    });
  });
});
