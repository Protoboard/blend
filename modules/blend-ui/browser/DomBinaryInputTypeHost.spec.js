"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-widget'];

describe("$ui", function () {
  describe("DomBinaryInputTypeHost", function () {
    var DomBinaryInputTypeHost,
        domBinaryInputTypeHost;

    beforeAll(function () {
      DomBinaryInputTypeHost = $oop.getClass('test.$ui.DomBinaryInputTypeHost.DomBinaryInputTypeHost')
      .blend($widget.Widget)
      .blend($ui.Selectable)
      .blend($ui.DomBinaryInputTypeHost);
      DomBinaryInputTypeHost.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("select()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('input');
        domBinaryInputTypeHost = DomBinaryInputTypeHost.create({
          inputType: 'checkbox'
        });
        spyOn(domBinaryInputTypeHost, 'getElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domBinaryInputTypeHost.select();
        expect(result).toBe(domBinaryInputTypeHost);
      });

      it("should sync element checked property", function () {
        domBinaryInputTypeHost.select();
        expect(element.checked).toBeTruthy();
      });
    });

    describe("deselect()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('input');
        element.checked = true;
        domBinaryInputTypeHost = DomBinaryInputTypeHost.create({
          inputType: 'checkbox'
        });
        domBinaryInputTypeHost.select();
        spyOn(domBinaryInputTypeHost, 'getElement').and.returnValue(element);
      });

      it("should return self", function () {
        var result = domBinaryInputTypeHost.deselect();
        expect(result).toBe(domBinaryInputTypeHost);
      });

      it("should sync element checked property", function () {
        domBinaryInputTypeHost.deselect();
        expect(element.checked).toBeFalsy();
      });
    });

    describe("onRender()", function () {
      var element;

      beforeEach(function () {
        element = document.createElement('input');
        domBinaryInputTypeHost = DomBinaryInputTypeHost.create({
          inputType: 'checkbox',
          state: {
            selected: true
          }
        });
        spyOn(domBinaryInputTypeHost, 'getElement').and.returnValue(element);
      });

      it("should sync element checked property to 'selected' state", function () {
        domBinaryInputTypeHost.onRender();
        expect(element.checked).toBeTruthy();
      });
    });

    describe("onElementInput()", function () {
      var element,
          event;

      beforeEach(function () {
        element = document.createElement('input');
        domBinaryInputTypeHost = DomBinaryInputTypeHost.create({
          inputType: 'checkbox'
        });
        spyOn(domBinaryInputTypeHost, 'getElement').and.returnValue(element);
        domBinaryInputTypeHost.onRender();
        element.checked = true;
        event = new Event('input');
      });

      it("should sync 'selected' state to element checked property", function () {
        element.dispatchEvent(event);
        expect(domBinaryInputTypeHost.getStateValue('selected')).toBeTruthy();
      });
    });

    describe("onElementChange()", function () {
      var element,
          event;

      beforeEach(function () {
        element = document.createElement('input');
        domBinaryInputTypeHost = DomBinaryInputTypeHost.create({
          inputType: 'checkbox'
        });
        spyOn(domBinaryInputTypeHost, 'getElement').and.returnValue(element);
        domBinaryInputTypeHost.onRender();
        element.checked = false;
        event = new Event('change');
      });

      it("should sync 'selected' state to element checked property", function () {
        element.dispatchEvent(event);
        expect(domBinaryInputTypeHost.getStateValue('selected')).toBeFalsy();
      });
    });
  });

  describe("BinaryInputTypeHost", function () {
    var BinaryInputTypeHost,
        binaryInputTypeHost;

    beforeAll(function () {
      BinaryInputTypeHost = $oop.getClass('test.$ui.DomBinaryInputTypeHost.BinaryInputTypeHost')
      .blend($widget.Widget)
      .blend($ui.Selectable)
      .blend($ui.BinaryInputTypeHost);
    });

    describe("create()", function () {
      describe("in browser environment", function () {
        it("should return DomBinaryInputTypeHost instance", function () {
          binaryInputTypeHost = BinaryInputTypeHost.create({
            inputType: 'checkbox'
          });
          expect($ui.DomBinaryInputTypeHost.mixedBy(binaryInputTypeHost))
          .toBeTruthy();
        });
      });
    });
  });
});
