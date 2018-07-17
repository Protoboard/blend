"use strict";

var $event = window['blend-event'],
    $router = window['blend-router'];

describe("$router", function () {
  describe("Event", function () {
    describe(".create()", function () {
      describe("when eventName matches 'router.change.route'", function () {
        it("should return RouteChangeEvent instance", function () {
          var event = $event.Event.fromEventName('router.change.route');
          expect($router.RouteChangeEvent.mixedBy(event)).toBeTruthy();
        });
      });
    });
  });
});
