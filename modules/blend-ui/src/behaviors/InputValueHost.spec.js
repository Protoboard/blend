"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("InputValueHost", function () {
    var InputValueHost,
        inputValueHost;

    beforeAll(function () {
      InputValueHost = $oop.createClass('test.$ui.InputValueHost.InputValueHost')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .build();
      InputValueHost.__builder.forwards = {list: [], lookup: {}};
    });

    describe("setInputValue()", function () {
      beforeEach(function () {
        inputValueHost = InputValueHost.create();
      });

      it("should return self", function () {
        var result = inputValueHost.setInputValue('foo');
        expect(result).toBe(inputValueHost);
      });

      it("should set inputValue", function () {
        inputValueHost.setInputValue('foo');
        expect(inputValueHost.inputValue).toBe('foo');
      });

      it("should save before state", function () {
        inputValueHost.setInputValue('foo');
        expect(inputValueHost.setInputValue.shared.inputValueBefore)
        .toBeUndefined();
      });
    });
  });
});
