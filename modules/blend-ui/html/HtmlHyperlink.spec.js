"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("HtmlHyperlink", function () {
    var HtmlHyperlink,
        htmlHyperlink;

    beforeAll(function () {
      HtmlHyperlink = $oop.createClass('test.$ui.HtmlHyperlink.HtmlHyperlink')
      .blend($ui.Hyperlink)
      .blend($ui.HtmlHyperlink)
      .build();
      HtmlHyperlink.__builder.forwards = {list: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize elementName", function () {
        htmlHyperlink = HtmlHyperlink.create();
        expect(htmlHyperlink.elementName).toBe('a');
      });

      it("should initialize 'href' attribute", function () {
        htmlHyperlink = HtmlHyperlink.create({
          targetUrl: 'foo'
        });
        expect(htmlHyperlink.getAttribute('href')).toBe('foo');
      });
    });

    describe("setTargetUrl()", function () {
      beforeEach(function () {
        htmlHyperlink = HtmlHyperlink.create({
          targetUrl: 'foo'
        });
      });

      it("should return self", function () {
        var result = htmlHyperlink.setTargetUrl('bar');
        expect(result).toBe(htmlHyperlink);
      });

      it("should sync 'href' attribute", function () {
        htmlHyperlink.setTargetUrl('bar');
        expect(htmlHyperlink.getAttribute('href')).toBe('bar');
      });
    });
  });

  describe("Hyperlink", function () {
    var hyperlink;

    describe("create()", function () {
      describe("when HTML is available", function () {
        it("should return HtmlHyperlink instance", function () {
          hyperlink = $ui.Hyperlink.create();
          expect($ui.HtmlHyperlink.mixedBy(hyperlink)).toBeTruthy();
        });
      });
    });
  });
});
