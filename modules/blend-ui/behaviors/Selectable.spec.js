"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Selectable", function () {
    var Selectable,
        selectable;

    beforeAll(function () {
      Selectable = $oop.getClass('test.$ui.Selectable.Selectable')
      .blend($widget.Widget)
      .blend($ui.Selectable);
      Selectable.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("setOwnValue()", function () {
      beforeEach(function () {
        selectable = Selectable.create();
      });

      it("should return self", function () {
        var result = selectable.setOwnValue('foo');
        expect(result).toBe(selectable);
      });

      it("should set ownValue", function () {
        selectable.setOwnValue('foo');
        expect(selectable.ownValue).toBe('foo');
      });

      describe("when selected", function () {
        beforeEach(function () {
          selectable.select();
        });

        it("should sync inputValue", function () {
          selectable.setOwnValue('foo');
          expect(selectable.inputValue).toBe('foo');
        });
      });
    });

    describe("select()", function () {
      beforeEach(function () {
        selectable = Selectable.create();
        selectable.setOwnValue('foo');
      });

      it("should return self", function () {
        var result = selectable.select();
        expect(result).toBe(selectable);
      });

      it("should set isSelected", function () {
        selectable.select();
        expect(selectable.isSelected).toBeTruthy();
      });

      it("should sync inputValue", function () {
        selectable.select();
        expect(selectable.inputValue).toBe('foo');
      });
    });

    describe("deselect()", function () {
      beforeEach(function () {
        selectable = Selectable.create();
        selectable.setOwnValue('foo');
        selectable.select();
      });

      it("should return self", function () {
        var result = selectable.deselect();
        expect(result).toBe(selectable);
      });

      it("should set isSelected", function () {
        selectable.deselect();
        expect(selectable.isSelected).toBeFalsy();
      });

      it("should sync inputValue", function () {
        selectable.deselect();
        expect(selectable.inputValue).toBeUndefined();
      });
    });
  });
});
