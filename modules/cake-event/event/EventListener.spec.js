"use strict";

var $oop = window['cake-oop'],
    $event = window['cake-event'];

describe("$event", function () {
  describe("EventListener", function () {
    var EventListener,
        eventListener,
        result;

    beforeAll(function () {
      EventListener = $oop.getClass('test.$event.EventListener.EventListener')
      .mix($event.EventListener);
    });

    beforeEach(function () {
      eventListener = EventListener.create();
    });

    describe("setListeningPath()", function () {
      var listeningPath;

      beforeEach(function () {
        listeningPath = 'foo.bar'.toPath();
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
