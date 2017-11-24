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

    describe("getContentMarkup()", function () {
      var stringifiable = {
        toString: function () {
          return "foo";
        }
      };

      beforeEach(function () {
        htmlText = HtmlText.fromElementName('span')
        .setTextString(stringifiable);
      });

      it("should append textContent to contents", function () {
        expect(htmlText.getContentMarkup()).toBe("foo");
      });

      describe("when textContent has XML markup", function () {
        it("should encode XML entities", function () {
          htmlText.setTextString("<script>alert('Foo')</script>");
          expect(htmlText.getContentMarkup())
          .toBe("&lt;script&gt;alert(&apos;Foo&apos;)&lt;/script&gt;");
        });
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
