"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("DomFocusable", function () {
    var DomFocusable,
        domFocusable;

    beforeAll(function () {
      DomFocusable = $oop.getClass('test.$widgets.DomFocusable.DomFocusable')
      .blend($widget.Widget)
      .blend($widgets.DomFocusable);
      DomFocusable.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("focus()", function () {
      var element;

      beforeEach(function () {
        domFocusable = DomFocusable.create();
        element = document.createElement('button');
        document.body.appendChild(element);
        spyOn(domFocusable, 'getElement').and.returnValue(element);
        domFocusable.onRender();
      });

      afterEach(function () {
        document.body.removeChild(element);
      });

      it("should return self", function () {
        var result = domFocusable.focus();
        expect(result).toBe(domFocusable);
      });

      it("should focus element", function () {
        domFocusable.focus();
        expect(document.activeElement).toBe(element);
      });
    });

    describe("blur()", function () {
      var element;

      beforeEach(function () {
        domFocusable = DomFocusable.create();
        element = document.createElement('button');
        document.body.appendChild(element);
        spyOn(domFocusable, 'getElement').and.returnValue(element);
        domFocusable.focus();
        domFocusable.onRender();
      });

      afterEach(function () {
        document.body.removeChild(element);
      });

      it("should return self", function () {
        var result = domFocusable.blur();
        expect(result).toBe(domFocusable);
      });

      it("should blur element", function () {
        domFocusable.blur();
        expect(document.activeElement).not.toBe(element);
      });
    });

    describe("onRender()", function () {
      var element;

      beforeEach(function () {
        domFocusable = DomFocusable.create();
        element = document.createElement('button');
        document.body.appendChild(element);
        spyOn(domFocusable, 'getElement').and.returnValue(element);
      });

      afterEach(function () {
        document.body.removeChild(element);
      });

      describe("when isFocused is true", function () {
        beforeEach(function () {
          domFocusable.focus();
        });

        it("should sync element focus", function () {
          domFocusable.onRender();
          expect(document.activeElement).toBe(element);
        });
      });

      describe("when isFocused is false", function () {
        beforeEach(function () {
          domFocusable.blur();
        });

        it("should sync element focus", function () {
          domFocusable.onRender();
          expect(document.activeElement).not.toBe(element);
        });
      });
    });

    describe("onFocusIn()", function () {
      var element;

      beforeEach(function () {
        domFocusable = DomFocusable.create();
        element = document.createElement('button');
        document.body.appendChild(element);
        spyOn(domFocusable, 'getElement').and.returnValue(element);
        domFocusable.onRender();
      });

      afterEach(function () {
        document.body.removeChild(element);
      });

      it("should sync isFocused", function () {
        element.focus();
        expect(domFocusable.isFocused).toBe(true);
      });

      it("should push wrapper event to EventTail", function () {
        element.focus();
        var eventTrail = $event.EventTrail.create(),
            wrapperEvent = eventTrail.data.previousLink;
        expect(wrapperEvent.eventName).toEqual('focusInWrapper');
        expect(wrapperEvent.wrapped instanceof Event).toBeTruthy();
      });
    });

    describe("onFocusOut()", function () {
      var element;

      beforeEach(function () {
        domFocusable = DomFocusable.create();
        element = document.createElement('button');
        document.body.appendChild(element);
        spyOn(domFocusable, 'getElement').and.returnValue(element);
        domFocusable.focus();
        domFocusable.onRender();
      });

      afterEach(function () {
        document.body.removeChild(element);
      });

      it("should sync isFocused", function () {
        element.blur();
        expect(domFocusable.isFocused).toBe(false);
      });

      it("should push wrapper event to EventTail", function () {
        element.blur();
        var eventTrail = $event.EventTrail.create(),
            wrapperEvent = eventTrail.data.previousLink;
        expect(wrapperEvent.eventName).toEqual('focusOutWrapper');
        expect(wrapperEvent.wrapped instanceof Event).toBeTruthy();
      });
    });
  });
});
