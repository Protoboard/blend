"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("InputValueHost", function () {
    var InputValueHost,
        inputable;

    beforeAll(function () {
      InputValueHost = $oop.createClass('test.$ui.InputValueHost.InputValueHost')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .build();
      InputValueHost.__builder.forwards = {list: [], lookup: {}};
    });

    describe("setInputValue()", function () {
      beforeEach(function () {
        inputable = InputValueHost.create();
      });

      it("should return self", function () {
        var result = inputable.setInputValue('foo');
        expect(result).toBe(inputable);
      });

      it("should set inputValue", function () {
        inputable.setInputValue('foo');
        expect(inputable.inputValue).toBe('foo');
      });
    });
  });
});
