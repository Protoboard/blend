"use strict";

var $oop = window['blend-oop'],
    $session = window['blend-session'];

describe("$event", function () {
  describe("Event", function () {
    describe(".create()", function () {
      describe("when event name is prefixed with 'api'", function () {
        it("should return ApiEvent instance", function () {
          var result = $event.Event.create({eventName: 'session.change.session-state'});
          expect($session.SessionStateChangeEvent.mixedBy(result)).toBeTruthy();
        });
      });
    });
  });
});
