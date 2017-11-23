"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("BinaryInputTypeHost", function () {
    var BinaryInputTypeHost,
        binaryInputTypeHost;

    beforeAll(function () {
      BinaryInputTypeHost = $oop.getClass('test.$ui.BinaryInputTypeHost.BinaryInputTypeHost')
      .blend($widget.Widget)
      .blend($ui.Selectable)
      .blend($ui.BinaryInputTypeHost);
      BinaryInputTypeHost.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      describe("on invalid inputType", function () {
        it("should throw", function () {
          expect(function () {
            BinaryInputTypeHost.create();
          }).toThrow();
          expect(function () {
            BinaryInputTypeHost.create({inputType: 'text'});
          }).toThrow();
        });
      });

      it("should initialize 'value' attribute", function () {
        binaryInputTypeHost = BinaryInputTypeHost.create({
          inputType: 'checkbox',
          ownValue: 'foo'
        });
        expect(binaryInputTypeHost.getAttribute('value')).toBe('foo');
      });

      it("should initialize 'checked' attribute", function () {
        binaryInputTypeHost = BinaryInputTypeHost.create({
          inputType: 'checkbox',
          state: {
            selected: true
          }
        });
        expect(binaryInputTypeHost.getAttribute('checked')).toBe('checked');
      });
    });

    describe("setOwnValue()", function () {
      beforeEach(function () {
        binaryInputTypeHost = BinaryInputTypeHost.create({
          inputType: 'checkbox'
        });
      });

      it("should return self", function () {
        var result = binaryInputTypeHost.setOwnValue('foo');
        expect(result).toBe(binaryInputTypeHost);
      });

      it("should add 'value' attribute", function () {
        binaryInputTypeHost.setOwnValue('foo');
        expect(binaryInputTypeHost.getAttribute('value')).toBe('foo');
      });
    });

    describe("select()", function () {
      beforeEach(function () {
        binaryInputTypeHost = BinaryInputTypeHost.create({
          inputType: 'checkbox'
        });
      });

      it("should return self", function () {
        var result = binaryInputTypeHost.select();
        expect(result).toBe(binaryInputTypeHost);
      });

      it("should add 'checked' attribute", function () {
        binaryInputTypeHost.select();
        expect(binaryInputTypeHost.getAttribute('checked')).toBe('checked');
      });
    });

    describe("deselect()", function () {
      beforeEach(function () {
        binaryInputTypeHost = BinaryInputTypeHost.create({
          inputType: 'checkbox'
        });
        binaryInputTypeHost.select();
      });

      it("should return self", function () {
        var result = binaryInputTypeHost.deselect();
        expect(result).toBe(binaryInputTypeHost);
      });

      it("should remove 'checked' attribute", function () {
        binaryInputTypeHost.deselect();
        expect(binaryInputTypeHost.getAttribute('checked')).toBeUndefined();
      });
    });
  });
});
