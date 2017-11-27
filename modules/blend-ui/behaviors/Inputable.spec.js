"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Inputable", function () {
    var Inputable,
        inputable;

    beforeAll(function () {
      Inputable = $oop.getClass('test.$ui.Inputable.Inputable')
      .blend($widget.Widget)
      .blend($ui.Inputable);
      Inputable.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("setInputValue()", function () {
      beforeEach(function () {
        inputable = Inputable.create();
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