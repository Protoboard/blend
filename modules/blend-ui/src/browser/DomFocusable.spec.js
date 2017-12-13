"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("DomFocusable", function () {
    var DomFocusable,
        domFocusable;

    beforeAll(function () {
      DomFocusable = $oop.createClass('test.$ui.DomFocusable.DomFocusable')
      .blend($widget.Widget)
      .blend($ui.DomFocusable)
      .build();
      DomFocusable.__builder.forwards = {list: [], lookup: {}};
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

      describe("when 'focused' state is true", function () {
        beforeEach(function () {
          domFocusable.focus();
        });

        it("should sync element focus", function () {
          domFocusable.onRender();
          expect(document.activeElement).toBe(element);
        });
      });

      describe("when 'focused' state is false", function () {
        beforeEach(function () {
          domFocusable.blur();
        });

        it("should sync element focus", function () {
          domFocusable.onRender();
          expect(document.activeElement).not.toBe(element);
        });
      });
    });

    describe("onElementFocusIn()", function () {
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

      it("should sync 'focused' state", function () {
        element.focus();
        expect(domFocusable.isFocused()).toBe(true);
      });

      it("should push wrapper event to EventTail", function () {
        element.focus();
        var eventTrail = $event.EventTrail.create(),
            wrapperEvent = eventTrail.data.previousLink;
        expect(wrapperEvent.eventName).toEqual('focusInWrapper');
        expect(wrapperEvent.wrapped instanceof Event).toBeTruthy();
      });
    });

    describe("onElementFocusOut()", function () {
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

      it("should sync 'focused' state", function () {
        element.blur();
        expect(domFocusable.isFocused()).toBe(false);
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
