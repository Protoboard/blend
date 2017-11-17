"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("Event", function () {
    var event;

    describe("create()", function () {
      describe("when eventName matches EVENT_PAGE_CHANGE", function () {
        it("should return PageChangeEvent instance", function () {
          event = $event.Event.fromEventName($widgets.EVENT_PAGE_CHANGE);
          expect($widgets.PageChangeEvent.mixedBy(event)).toBeTruthy();
        });
      });
    });
  });
});
