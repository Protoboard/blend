"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-widget'];

describe("$ui", function () {
  describe("DomInputEventBound", function () {
    var DomInputEventBound,
        domInputEventHost;

    beforeAll(function () {
      DomInputEventBound = $oop.createClass('test.$ui.DomInputEventBound.DomInputEventBound')
      .blend($widget.Widget)
      .blend($ui.DomInputEventBound)
      .build();
      DomInputEventBound.__builder.forwards = {list: [], lookup: {}};
    });

    describe("#onElementInput()", function () {
      var element,
          event;

      beforeEach(function () {
        element = document.createElement('input');
        domInputEventHost = DomInputEventBound.create();
        spyOn(domInputEventHost, 'getElement').and.returnValue(element);
        domInputEventHost.onRender();
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

    describe("#onElementChange()", function () {
      var element,
          event;

      beforeEach(function () {
        element = document.createElement('input');
        domInputEventHost = DomInputEventBound.create();
        spyOn(domInputEventHost, 'getElement').and.returnValue(element);
        domInputEventHost.onRender();
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
});
