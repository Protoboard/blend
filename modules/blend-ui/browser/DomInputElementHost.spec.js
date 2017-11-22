"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-widget'];

describe("$ui", function () {
  describe("DomInputElementHost", function () {
    var DomInputElementHost,
        domInputElementHost;

    beforeAll(function () {
      DomInputElementHost = $oop.getClass('test.$ui.DomInputElementHost.DomInputElementHost')
      .blend($widget.Widget)
      .blend($ui.Inputable)
      .blend($ui.DomInputElementHost);
      DomInputElementHost.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("onInput()", function () {
      var element,
          event;

      beforeEach(function () {
        element = document.createElement('input');
        domInputElementHost = DomInputElementHost.create();
        spyOn(domInputElementHost, 'getElement').and.returnValue(element);
        domInputElementHost.onRender();
        element.value = 'foo';
        event = new Event('input');
      });

      it("should push wrapped DOM event to EventTrail", function () {
        var eventTrail = $event.EventTrail.create();
        element.dispatchEvent(event);
        var wrapperEvent = eventTrail.data.previousLink;
        expect(wrapperEvent.eventName).toBe('inputWrapper');
        expect(wrapperEvent.wrapped).toBe(event);
      });
    });

    describe("onChange()", function () {
      var element,
          event;

      beforeEach(function () {
        element = document.createElement('input');
        domInputElementHost = DomInputElementHost.create();
        spyOn(domInputElementHost, 'getElement').and.returnValue(element);
        domInputElementHost.onRender();
        element.value = 'foo';
        event = new Event('change');
      });

      it("should push wrapped DOM event to EventTrail", function () {
        var eventTrail = $event.EventTrail.create();
        element.dispatchEvent(event);
        var wrapperEvent = eventTrail.data.previousLink;
        expect(wrapperEvent.eventName).toBe('changeWrapper');
        expect(wrapperEvent.wrapped).toBe(event);
      });
    });
  });

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
