"use strict";

var $oop = window['blend-oop'],
    $event = window['blend-event'];

describe("$event", function () {
  describe("EventListener", function () {
    var EventListener,
        eventListener,
        result;

    beforeAll(function () {
      EventListener = $oop.createClass('test.$event.EventListener.EventListener')
      .blend($event.EventListener)
      .build();
    });

    beforeEach(function () {
      eventListener = EventListener.create();
    });

    describe("#setListeningPath()", function () {
      var listeningPath;

      beforeEach(function () {
        listeningPath = 'foo.bar';
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
