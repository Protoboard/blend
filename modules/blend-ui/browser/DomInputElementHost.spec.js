"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-widget'];

describe("$ui", function () {
  describe("InputElementHost", function () {
    var InputElementHost,
        inputElementHost;

    beforeAll(function () {
      InputElementHost = $oop.getClass('test.$ui.DomInputElementHost.InputElementHost')
      .blend($widget.Widget)
      .blend($ui.Inputable)
      .blend($ui.InputElementHost);
    });

    describe("create()", function () {
      describe("in browser environment", function () {
        it("should return DomInputElementHost instance", function () {
          inputElementHost = InputElementHost.create();
          expect($ui.DomInputElementHost.mixedBy(inputElementHost))
          .toBeTruthy();
        });
      });
    });
  });
});
