"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $event = window['blend-event'];

describe("$event", function () {
  describe("EventTrail", function () {
    var EventTrail,
        eventTrail;

    beforeAll(function () {
      EventTrail = $oop.getClass('test.$event.EventTrail.EventTrail')
      .blend($event.EventTrail);
    });

    describe("create()", function () {
      beforeEach(function () {
        eventTrail = EventTrail.create();
      });

      describe("then creating another again", function () {
        it("should return the same instance", function () {
          expect(EventTrail.create()).toBe(eventTrail);
        });
      });
    });
  });
});