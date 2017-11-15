"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("XmlText", function () {
    var XmlText,
        xmlText;

    beforeAll(function () {
      XmlText = $oop.getClass('test.$widgets.XmlText.XmlText')
      .blend($widgets.Text)
      .blend($widgets.XmlText);
      XmlText.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("getContentMarkup()", function () {
      var stringifiable = {
        toString: function () {
          return "foo";
        }
      };

      beforeEach(function () {
        xmlText = XmlText.fromElementName('span')
        .setTextString(stringifiable);
      });

      it("should append textString to contents", function () {
        expect(xmlText.getContentMarkup()).toBe("foo");
      });
    });
  });

  describe("Text", function () {
    var text;

    describe("create()", function () {
      describe("in HTML environment", function () {
        it("should return XmlText instance", function () {
          text = $widgets.Text.create();
          expect($widgets.XmlText.mixedBy(text)).toBeTruthy();
        });
      });
    });
  });
});
