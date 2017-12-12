"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("DomMultiSelectElementHost", function () {
    var DomMultiSelectElementHost,
        domMultiSelectElementHost;

    beforeAll(function () {
      DomMultiSelectElementHost = $oop.createClass('test.$ui.DomMultiSelectElementHost.DomMultiSelectElementHost')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .blend($ui.DomMultiSelectElementHost)
      .build();
      DomMultiSelectElementHost.__forwards = {
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
        domMultiSelectElementHost = DomMultiSelectElementHost.create();
        spyOn(domMultiSelectElementHost, 'getElement').and
        .returnValue(element);
      });

      it("should sync to selectedOptions", function () {
        domMultiSelectElementHost.onRender();
        expect(domMultiSelectElementHost.inputValue).toEqual({foo: 'foo'});
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
        domMultiSelectElementHost = DomMultiSelectElementHost.create();
        spyOn(domMultiSelectElementHost, 'getElement').and
        .returnValue(element);
        domMultiSelectElementHost.onRender();
      });

      it("should sync to selectedOptions", function () {
        element.dispatchEvent(new Event('input'));
        expect(domMultiSelectElementHost.inputValue).toEqual({foo: 'foo'});
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
        domMultiSelectElementHost = DomMultiSelectElementHost.create();
        spyOn(domMultiSelectElementHost, 'getElement').and
        .returnValue(element);
        domMultiSelectElementHost.onRender();
      });

      it("should sync to selectedOptions", function () {
        element.dispatchEvent(new Event('change'));
        expect(domMultiSelectElementHost.inputValue).toEqual({foo: 'foo'});
      });
    });
  });

  describe("MultiSelectElementHost", function () {
    var MultiSelectElementHost,
        multiSelectElementHost;

    beforeAll(function () {
      MultiSelectElementHost = $oop.createClass('test.$ui.DomMultiSelectElementHost.MultiSelectElementHost')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .blend($ui.MultiSelectElementHost)
      .build();
    });

    describe("create()", function () {
      describe("in browser environment", function () {
        it("should return DomMultiSelectElementHost instance", function () {
          multiSelectElementHost = MultiSelectElementHost.create();
          expect($ui.DomMultiSelectElementHost.mixedBy(multiSelectElementHost))
          .toBeTruthy();
        });
      });
    });
  });
});
