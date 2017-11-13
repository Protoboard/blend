"use strict";

var $oop = window['blend-oop'],
    $event = window['blend-event'],
    $api = window['blend-api'];

describe("$event", function () {
  describe("Event", function () {
    describe("create()", function () {
      describe("when event name is prefixed with 'api'", function () {
        it("should return ApiEvent instance", function () {
          var result = $event.Event.create({eventName: 'api.foo'});
          expect($api.ApiEvent.mixedBy(result)).toBeTruthy();
        });
      });
    });
  });
});
