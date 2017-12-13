"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-widget'];

describe("$ui", function () {
  describe("InputElementHost", function () {
    var InputElementHost,
        inputElementHost;

    beforeAll(function () {
      InputElementHost = $oop.createClass('test.$ui.DomInputElementHost.InputElementHost')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .blend($ui.InputElementHost)
      .build();
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
