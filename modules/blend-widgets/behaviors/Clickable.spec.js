"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("Clickable", function () {
    var Clickable,
        clickable;

    beforeAll(function () {
      Clickable = $oop.getClass('test.$widgets.Clickable.Clickable')
      .blend($widget.Widget)
      .blend($widgets.Clickable);
      Clickable.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("click()", function () {
      beforeEach(function () {
        clickable = Clickable.create();
        spyOn(clickable, 'trigger');
      });

      it("should return self", function () {
        var result = clickable.click();
        expect(result).toBe(clickable);
      });

      it("should trigger EVENT_CLICKABLE_CLICK", function () {
        clickable.click();
        expect(clickable.trigger)
        .toHaveBeenCalledWith('widgets.clickable.click');
      });
    });
  });
});
