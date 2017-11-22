"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-widget'];

describe("$ui", function () {
  describe("DomOtherInputTypeHost", function () {
    var DomOtherInputTypeHost,
        domOtherInputTypeHost;

    beforeAll(function () {
      DomOtherInputTypeHost = $oop.getClass('test.$ui.DomOtherInputTypeHost.DomOtherInputTypeHost')
      .blend($widget.Widget)
      .blend($ui.Inputable)
      .blend($ui.DomOtherInputTypeHost);
      DomOtherInputTypeHost.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("setInputValue()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('input');
        domOtherInputTypeHost = DomOtherInputTypeHost.create();
        spyOn(domOtherInputTypeHost, 'getElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domOtherInputTypeHost.setInputValue('foo');
        expect(result).toBe(domOtherInputTypeHost);
      });

      it("should set element value", function () {
        domOtherInputTypeHost.setInputValue('foo');
        expect(element.value).toBe('foo');
      });
    });

    describe("onRender()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('input');
        domOtherInputTypeHost = DomOtherInputTypeHost.create({
          inputValue: 'foo'
        });
        spyOn(domOtherInputTypeHost, 'getElement').and.returnValue(element);
      });

      it("should sync element value to inputValue", function () {
        domOtherInputTypeHost.onRender();
        expect(element.value).toBe('foo');
      });
    });

    describe("onInput()", function () {
      var element,
          event;

      beforeEach(function () {
        element = document.createElement('input');
        domOtherInputTypeHost = DomOtherInputTypeHost.create();
        spyOn(domOtherInputTypeHost, 'getElement').and.returnValue(element);
        domOtherInputTypeHost.onRender();
        element.value = 'foo';
        event = new Event('input');
      });

      it("should sync inputValue to element value", function () {
        element.dispatchEvent(event);
        expect(domOtherInputTypeHost.inputValue).toBe('foo');
      });
    });

    describe("onChange()", function () {
      var element,
          event;

      beforeEach(function () {
        element = document.createElement('input');
        domOtherInputTypeHost = DomOtherInputTypeHost.create();
        spyOn(domOtherInputTypeHost, 'getElement').and.returnValue(element);
        domOtherInputTypeHost.onRender();
        element.value = 'foo';
        event = new Event('change');
      });

      it("should sync inputValue to element value", function () {
        element.dispatchEvent(event);
        expect(domOtherInputTypeHost.inputValue).toBe('foo');
      });
    });
  });

  describe("OtherInputTypeHost", function () {
    var OtherInputTypeHost,
        otherInputTypeHost;

    beforeAll(function () {
      OtherInputTypeHost = $oop.getClass('test.$ui.DomOtherInputTypeHost.OtherInputTypeHost')
      .blend($widget.Widget)
      .blend($ui.Inputable)
      .blend($ui.OtherInputTypeHost);
    });

    describe("create()", function () {
      describe("in browser environment", function () {
        it("should return DomOtherInputTypeHost instance", function () {
          otherInputTypeHost = OtherInputTypeHost.create();
          expect($ui.DomOtherInputTypeHost.mixedBy(otherInputTypeHost))
          .toBeTruthy();
        });
      });
    });
  });
});
