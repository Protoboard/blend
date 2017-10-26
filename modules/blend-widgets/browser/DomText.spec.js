"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("DomText", function () {
    var DomText,
        domText;

    beforeAll(function () {
      DomText = $oop.getClass('test.$widgets.DomText.DomText')
      .blend($widgets.Text)
      .blend($widgets.XmlText)
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
});