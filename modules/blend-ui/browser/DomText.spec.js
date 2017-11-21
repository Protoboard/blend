"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("DomText", function () {
    var DomText,
        domText;

    beforeAll(function () {
      DomText = $oop.getClass('test.$ui.DomText.DomText')
      .blend($ui.Text)
      .blend($ui.DomText);
      DomText.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("setTextString()", function () {
      var element,
          stringifiable;

      beforeEach(function () {
        domText = DomText.fromElementName('div');
        element = document.createElement('div');
        stringifiable = {
          toString: function () {
            return 'foo';
          }
        };
        spyOn(domText, 'getElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domText.setTextString(stringifiable);
        expect(result).toBe(domText);
      });

      it("should update element contents", function () {
        domText.setTextString(stringifiable);
        expect(element.innerHTML).toBe('foo');
      });
    });
  });

  describe("HtmlText", function () {
    var HtmlText,
        htmlText;

    beforeAll(function () {
      HtmlText = $oop.getClass('test.$ui.DomText.HtmlText')
      .blend($ui.Text)
      .blend($ui.HtmlText);
    });

    describe("create()", function () {
      describe("in browser environment", function () {
        it("should return DomText instance", function () {
          htmlText = HtmlText.create();
          expect($ui.DomText.mixedBy(htmlText)).toBeTruthy();
        });
      });
    });
  });
});
