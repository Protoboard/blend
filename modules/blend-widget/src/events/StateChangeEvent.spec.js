"use strict";

var $event = window['blend-event'],
    $widget = window['blend-router'];

describe("$widget", function () {
  describe("Event", function () {
    describe(".create()", function () {
      describe("when eventName matches 'router.change.route'", function () {
        it("should return StateChangeEvent instance", function () {
          var event = $event.Event.fromEventName('widget.state.change');
          expect($widget.StateChangeEvent.mixedBy(event)).toBeTruthy();
        });
      });
    });
  });
});
