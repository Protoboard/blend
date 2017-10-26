"use strict";

var $oop = window['blend-oop'],
    $event = window['blend-event'];

describe("$event", function () {
  describe("EventListener", function () {
    var EventListener,
        eventListener,
        result;

    beforeAll(function () {
      EventListener = $oop.getClass('test.$event.EventListener.EventListener')
      .blend($event.EventListener);
    });

    beforeEach(function () {
      eventListener = EventListener.create();
    });

    describe("setListeningPath()", function () {
      var listeningPath;

      beforeEach(function () {
        listeningPath = 'foo.bar'.toPath().toString();
        result = eventListener.setListeningPath(listeningPath);
      });

      it("should return self", function () {
        expect(result).toBe(eventListener);
      });

      it("should set listeningPath property", function () {
        expect(eventListener.listeningPath).toBe(listeningPath);
      });
    });
  });
});
