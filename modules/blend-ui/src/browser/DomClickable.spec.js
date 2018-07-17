"use strict";

var $oop = window['blend-oop'],
    $event = window['blend-event'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("DomClickable", function () {
    var DomClickable,
        domClickable;

    beforeAll(function () {
      DomClickable = $oop.createClass('test.$ui.DomClickable.DomClickable')
      .blend($widget.Widget)
      .blend($ui.DomClickable)
      .build();
      DomClickable.__builder.forwards = {list: [], lookup: {}};
    });

    describe("#onClick()", function () {
      var element,
          clickEvent;

      beforeEach(function () {
        element = document.createElement('div');
        domClickable = DomClickable.create();

        spyOn(domClickable, 'getElement').and.returnValue(element);
        spyOn(domClickable, 'click');

        domClickable.onRender();
        clickEvent = new Event('click');
      });

      it('should push click event to EventTrail', function () {
        domClickable.getElement().dispatchEvent(clickEvent);
        var wrapperEvent = $event.EventTrail.create().data.previousLink;
        expect($event.WrapperEvent.mixedBy(wrapperEvent)).toBeTruthy();
        expect(wrapperEvent.wrapped).toBe(clickEvent);
      });

      it("should invoke click()", function () {
        domClickable.getElement().dispatchEvent(new Event('click'));
        expect(domClickable.click).toHaveBeenCalled();
      });
    });
  });

  describe("Clickable", function () {
    var Clickable,
        clickable;

    beforeEach(function () {
      Clickable = $oop.createClass('test.$ui.DomClickable.Clickable')
      .blend($widget.Widget)
      .blend($ui.Clickable)
      .build();
    });

    describe(".create()", function () {
      describe("when browser is available", function () {
        it("should return DomClickable instance", function () {
          clickable = Clickable.create();
          expect($ui.DomClickable.mixedBy(clickable)).toBeTruthy();
        });
      });
    });
  });
});
