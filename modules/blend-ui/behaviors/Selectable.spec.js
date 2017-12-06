"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Selectable", function () {
    var Selectable,
        selectable;

    beforeAll(function () {
      Selectable = $oop.createClass('test.$ui.Selectable.Selectable')
      .blend($widget.Widget)
      .blend($ui.Selectable)
      .build();
      Selectable.__builder.forwards = {list: [], lookup: {}};
    });

    describe("setOwnValue()", function () {
      beforeEach(function () {
        selectable = Selectable.create();
        spyOn($ui.SelectableOwnValueChangeEvent, 'trigger');
      });

      it("should return self", function () {
        var result = selectable.setOwnValue('foo');
        expect(result).toBe(selectable);
      });

      it("should set ownValue", function () {
        selectable.setOwnValue('foo');
        expect(selectable.ownValue).toBe('foo');
      });

      it("should trigger EVENT_SELECTABLE_OWN_VALUE_CHANGE", function () {
        selectable.setOwnValue('foo');
        var calls = $ui.SelectableOwnValueChangeEvent.trigger.calls.all(),
            event = calls[0].object;
        expect(event.eventName).toBe('ui.selectable.ownValue.change');
        expect(event.ownValueBefore).toBeUndefined();
        expect(event.ownValueAfter).toBe('foo');
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

      it("should set 'selected' state", function () {
        selectable.select();
        expect(selectable.getStateValue('selected')).toBeTruthy();
      });

      it("should save before state", function () {
        selectable.select();
        expect(selectable.select.shared.selectedStateBefore).toBeFalsy();
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

      it("should set 'selected' state", function () {
        selectable.deselect();
        expect(selectable.getStateValue('selected')).toBeFalsy();
      });

      it("should save before state", function () {
        selectable.deselect();
        expect(selectable.deselect.shared.selectedStateBefore).toBeTruthy();
      });
    });

    describe("isSelected()", function () {
      beforeEach(function () {
        selectable = Selectable.create();
      });

      describe("when selected", function () {
        beforeEach(function () {
          selectable.select();
        });

        it("should return truthy", function () {
          expect(selectable.isSelected()).toBeTruthy();
        });
      });

      describe("when not selected", function () {
        it("should return falsy", function () {
          expect(selectable.isSelected()).toBeFalsy();
        });
      });
    });
  });
});
