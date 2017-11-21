"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("InputElementHost", function () {
    var InputElementHost,
        inputElementHost;

    beforeAll(function () {
      InputElementHost = $oop.getClass('test.$ui.InputElementHost.InputElementHost')
      .blend($widget.Widget)
      .blend($ui.Inputable)
      .blend($ui.InputElementHost);
      InputElementHost.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize elementName", function () {
        inputElementHost = InputElementHost.create();
        expect(inputElementHost.elementName).toBe('input');
      });

      it("should initialize 'type' attribute", function () {
        inputElementHost = InputElementHost.create({
          inputType: 'text'
        });
        expect(inputElementHost.getAttribute('type')).toBe('text');
      });
    });
  });
});
