"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("DomSingleSelectElementHost", function () {
    var DomSingleSelectElementHost,
        domSingleSelectElementHost;

    beforeAll(function () {
      DomSingleSelectElementHost = $oop.createClass('test.$ui.DomSingleSelectElementHost.DomSingleSelectElementHost')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .blend($ui.DomSingleSelectElementHost)
      .build();
      DomSingleSelectElementHost.__forwards = {
        list: [],
        sources: [],
        lookup: {}
      };
    });

    describe("onRender()", function () {
      var element,
          optionElement;

      beforeEach(function () {
        element = document.createElement('select');
        optionElement = document.createElement('option');
        optionElement.value = 'foo';
        element.add(optionElement);
        domSingleSelectElementHost = DomSingleSelectElementHost.create();
        spyOn(domSingleSelectElementHost, 'getElement').and
        .returnValue(element);
      });

      it("should sync to selectedOptions", function () {
        domSingleSelectElementHost.onRender();
        expect(domSingleSelectElementHost.inputValue).toBe('foo');
      });
    });

    describe("onElementInput()", function () {
      var element,
          optionElement;

      beforeEach(function () {
        element = document.createElement('select');
        optionElement = document.createElement('option');
        optionElement.value = 'foo';
        element.add(optionElement);
        domSingleSelectElementHost = DomSingleSelectElementHost.create();
        spyOn(domSingleSelectElementHost, 'getElement').and
        .returnValue(element);
        domSingleSelectElementHost.onRender();
      });

      it("should sync to selectedOptions", function () {
        element.dispatchEvent(new Event('input'));
        expect(domSingleSelectElementHost.inputValue).toBe('foo');
      });
    });

    describe("onElementChange()", function () {
      var element,
          optionElement;

      beforeEach(function () {
        element = document.createElement('select');
        optionElement = document.createElement('option');
        optionElement.value = 'foo';
        element.add(optionElement);
        domSingleSelectElementHost = DomSingleSelectElementHost.create();
        spyOn(domSingleSelectElementHost, 'getElement').and
        .returnValue(element);
        domSingleSelectElementHost.onRender();
      });

      it("should sync to selectedOptions", function () {
        element.dispatchEvent(new Event('change'));
        expect(domSingleSelectElementHost.inputValue).toBe('foo');
      });
    });
  });

  describe("SingleSelectElementHost", function () {
    var SingleSelectElementHost,
        singleSelectElementHost;

    beforeAll(function () {
      SingleSelectElementHost = $oop.createClass('test.$ui.DomSingleSelectElementHost.SingleSelectElementHost')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .blend($ui.SingleSelectElementHost)
      .build();
    });

    describe("create()", function () {
      describe("in browser environment", function () {
        it("should return DomSingleSelectElementHost instance", function () {
          singleSelectElementHost = SingleSelectElementHost.create();
          expect($ui.DomSingleSelectElementHost.mixedBy(singleSelectElementHost))
          .toBeTruthy();
        });
      });
    });
  });
});
