"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $event = window['blend-event'];

describe("$event", function () {
  describe("EventTrail", function () {
    var EventTrail,
        eventTrail;

    beforeAll(function () {
      EventTrail = $oop.createClass('test.$event.EventTrail.EventTrail')
      .blend($event.EventTrail)
      .build();
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
