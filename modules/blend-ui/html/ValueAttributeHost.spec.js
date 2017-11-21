"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("ValueAttributeHost", function () {
    var ValueAttributeHost,
        valueAttributeHost;

    beforeAll(function () {
      ValueAttributeHost = $oop.getClass('test.$ui.ValueAttributeHost.ValueAttributeHost')
      .blend($ui.TextInput)
      .blend($ui.ValueAttributeHost);
      ValueAttributeHost.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize 'value' attribute", function () {
        valueAttributeHost = ValueAttributeHost.create({
          inputValue: 'foo'
        });
        expect(valueAttributeHost.getAttribute('value')).toBe('foo');
      });
    });

    describe("setInputValue()", function () {
      beforeEach(function () {
        valueAttributeHost = ValueAttributeHost.create();
      });

      it("should return self", function () {
        var result = valueAttributeHost.setInputValue('foo');
        expect(result).toBe(valueAttributeHost);
      });

      it("should add 'disabled' attribute", function () {
        valueAttributeHost.setInputValue('foo');
        expect(valueAttributeHost.getAttribute('value')).toBe('foo');
      });
    });
  });
});
