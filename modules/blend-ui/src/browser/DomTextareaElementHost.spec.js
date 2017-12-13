"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-widget'];

describe("$ui", function () {
  describe("DomTextareaElementHost", function () {
    var DomTextareaElementHost,
        domTextareaElementHost;

    beforeAll(function () {
      DomTextareaElementHost = $oop.createClass('test.$ui.DomTextareaElementHost.TextareaElementHost')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .blend($ui.DomTextareaElementHost)
      .build();
      DomTextareaElementHost.__builder.forwards = {list: [], lookup: {}};
    });

    describe("setInputValue()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('textarea');
        domTextareaElementHost = DomTextareaElementHost.create();
        spyOn(domTextareaElementHost, 'getElement').and.returnValue(element);
        domTextareaElementHost.onRender();
      });

      it("should return self", function () {
        var result = domTextareaElementHost.setInputValue('foo');
        expect(result).toBe(domTextareaElementHost);
      });

      it("should sync element value", function () {
        domTextareaElementHost.setInputValue('foo');
        expect(element.value).toBe('foo');
      });
    });

    describe("onRender()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('textarea');
        domTextareaElementHost = DomTextareaElementHost.create({
          inputValue: 'foo'
        });
        spyOn(domTextareaElementHost, 'getElement').and.returnValue(element);
      });

      it("should sync element value", function () {
        domTextareaElementHost.onRender();
        expect(element.value).toBe('foo');
      });
    });

    describe("onElementInput()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('textarea');
        domTextareaElementHost = DomTextareaElementHost.create();
        spyOn(domTextareaElementHost, 'getElement').and.returnValue(element);
        domTextareaElementHost.onRender();
        element.value = 'foo';
      });

      it("should sync element value", function () {
        element.dispatchEvent(new Event('input'));
        expect(domTextareaElementHost.inputValue).toBe('foo');
      });
    });

    describe("onElementChange()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('textarea');
        domTextareaElementHost = DomTextareaElementHost.create();
        spyOn(domTextareaElementHost, 'getElement').and.returnValue(element);
        domTextareaElementHost.onRender();
        element.value = 'foo';
      });

      it("should sync element value", function () {
        element.dispatchEvent(new Event('change'));
        expect(domTextareaElementHost.inputValue).toBe('foo');
      });
    });
  });

  describe("TextareaElementHost", function () {
    var TextareaElementHost,
        textareaElementHost;

    beforeAll(function () {
      TextareaElementHost = $oop.createClass('test.$ui.DomTextareaElementHost.TextareaElementHost')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .blend($ui.TextareaElementHost)
      .build();
    });

    describe("create()", function () {
      describe("in browser environment", function () {
        it("should return DomTextareaElementHost instance", function () {
          textareaElementHost = TextareaElementHost.create();
          expect($ui.DomTextareaElementHost.mixedBy(textareaElementHost))
          .toBeTruthy();
        });
      });
    });
  });
});
