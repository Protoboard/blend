"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("DomText", function () {
    var DomText,
        domText;

    beforeAll(function () {
      DomText = $oop.getClass('test.$widgets.DomText.DomText')
      .blend($widgets.DomText);
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
    var text;

    describe("create()", function () {
      describe("in browser environment", function () {
        it("should return DomText instance", function () {
          text = $widgets.HtmlText.create();
          expect($widgets.DomText.mixedBy(text)).toBeTruthy();
        });
      });
    });
  });
});
