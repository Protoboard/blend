"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Event", function () {
    var event;

    describe("create()", function () {
      describe("when eventName matches EVENT_PAGE_CHANGE", function () {
        it("should return PageChangeEvent instance", function () {
          event = $event.Event.fromEventName($ui.EVENT_PAGE_CHANGE);
          expect($ui.PageChangeEvent.mixedBy(event)).toBeTruthy();
        });
      });
    });
  });
});
