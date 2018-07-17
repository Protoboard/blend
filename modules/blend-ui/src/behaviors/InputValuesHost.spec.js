"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("InputValuesHost", function () {
    var InputValuesHost,
        inputValuesHost;

    beforeAll(function () {
      InputValuesHost = $oop.createClass('test.$ui.InputValuesHost.InputValuesHost')
      .blend($widget.Widget)
      .blend($ui.InputValuesHost)
      .build();
      InputValuesHost.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".create()", function () {
      it("should initialize inputValues", function () {
        inputValuesHost = InputValuesHost.create();
        expect(inputValuesHost.inputValues).toEqual({});
      });
    });

    describe("#setInputValues()", function () {
      beforeEach(function () {
        inputValuesHost = InputValuesHost.create();
      });

      it("should return self", function () {
        var result = inputValuesHost.setInputValues({foo: 'foo'});
        expect(result).toBe(inputValuesHost);
      });

      it("should set inputValues", function () {
        inputValuesHost.setInputValues({foo: 'foo'});
        expect(inputValuesHost.inputValues).toEqual({foo: 'foo'});
      });

      it("should save before state", function () {
        inputValuesHost.setInputValues({foo: 'foo'});
        expect(inputValuesHost.setInputValues.shared.inputValuesBefore)
        .toEqual({});
      });
    });

    describe("#setInputValue()", function () {
      beforeEach(function () {
        inputValuesHost = InputValuesHost.create();
      });

      it("should return self", function () {
        var result = inputValuesHost.setInputValue('foo');
        expect(result).toBe(inputValuesHost);
      });

      it("should set inputValue", function () {
        inputValuesHost.setInputValue('foo');
        expect(inputValuesHost.inputValues).toEqual({foo: 'foo'});
      });

      it("should save before state", function () {
        inputValuesHost.setInputValue('foo');
        expect(inputValuesHost.setInputValue.shared.inputValueBefore)
        .toBeUndefined();
      });
    });

    describe("#setInputValue()", function () {
      beforeEach(function () {
        inputValuesHost = InputValuesHost.create({
          inputValues: {
            foo: 'foo'
          }
        });
      });

      it("should return self", function () {
        var result = inputValuesHost.deleteInputValue('foo');
        expect(result).toBe(inputValuesHost);
      });

      it("should delete inputValue", function () {
        inputValuesHost.deleteInputValue('foo');
        expect(inputValuesHost.inputValues).toEqual({});
      });

      it("should save before state", function () {
        inputValuesHost.deleteInputValue('foo');
        expect(inputValuesHost.deleteInputValue.shared.inputValueBefore)
        .toBe('foo');
      });
    });
  });
});
