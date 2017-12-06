"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("DomValidatable", function () {
    var DomValidatable,
        domValidatable;

    beforeAll(function () {
      DomValidatable = $oop.createClass('test.$ui.DomValidatable.DomValidatable')
      .blend($widget.Widget)
      .blend($widget.DomWidget)
      .blend($ui.Inputable)
      .blend($ui.DomValidatable)
      .build();
      DomValidatable.__builder.forwards = {list: [], lookup: {}};
    });

    describe("setInputValue()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('input');
        domValidatable = DomValidatable.create();
        spyOn(domValidatable, 'getElement').and.returnValue(element);
        spyOn(element, 'checkValidity').and.returnValue(false);
      });

      it("should return self", function () {
        var result = domValidatable.setInputValue('foo');
        expect(result).toBe(domValidatable);
      });

      it("should sync to element validity", function () {
        domValidatable.setInputValue('foo');
        expect(domValidatable.isStateOn('invalid')).toBeTruthy();
      });
    });

    describe("onRender()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('input');
        domValidatable = DomValidatable.create();
        spyOn(domValidatable, 'getElement').and.returnValue(element);
        spyOn(element, 'checkValidity').and.returnValue(false);
      });

      it("should sync to element validity", function () {
        domValidatable.onRender();
        expect(domValidatable.isStateOn('invalid')).toBeTruthy();
      });
    });

    describe("onElementInvalid()", function () {
      var element,
          event;

      beforeEach(function () {
        element = document.createElement('input');
        domValidatable = DomValidatable.create();
        spyOn(domValidatable, 'getElement').and.returnValue(element);
        event = new Event('invalid');
        domValidatable.onRender();
      });

      it("should push wrapper event to EventTrail", function () {
        element.dispatchEvent(event);
        var eventTrail = $event.EventTrail.create(),
            wrapperEvent = eventTrail.data.previousLink;
        expect(wrapperEvent.eventName).toBe('invalidWrapper');
        expect(wrapperEvent.wrapped).toBe(event);
      });

      it("should sync to element validity", function () {
        element.dispatchEvent(event);
        expect(domValidatable.isStateOn('invalid')).toBeTruthy();
      });
    });
  });
});
