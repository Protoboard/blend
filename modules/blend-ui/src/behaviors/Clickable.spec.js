"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Clickable", function () {
    var Clickable,
        clickable;

    beforeAll(function () {
      Clickable = $oop.createClass('test.$ui.Clickable.Clickable')
      .blend($widget.Widget)
      .blend($ui.Clickable)
      .build();
      Clickable.__builder.forwards = {list: [], lookup: {}};
    });

    describe("#click()", function () {
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
        .toHaveBeenCalledWith('ui.clickable.click');
      });
    });
  });
});
