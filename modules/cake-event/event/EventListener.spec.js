"use strict";

var $oop = window['cake-oop'],
    $event = window['cake-event'];

describe("$event", function () {
  describe("EventListener", function () {
    var EventListener,
        eventListener,
        result;

    beforeEach(function () {
      EventListener = $oop.getClass('test.$event.EventListener.EventListener')
      .mix($event.EventListener);
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

    describe("subscribe()", function () {
      var subscriber,
          eventName,
          callback;

      beforeEach(function () {
        subscriber = {subscriberId: 'FOO'};
        eventName = 'event1';
        callback = function () {};
        spyOn($event.EventSpace, 'on');

        result = eventListener.subscribe(subscriber, eventName, callback);
      });

      it("should return self", function () {
        expect(result).toBe(eventListener);
      });

      it("should invoke EventSpace#on", function () {
        expect($event.EventSpace.on).toHaveBeenCalledWith(
            eventName,
            eventListener.listeningPath,
            subscriber.subscriberId,
            callback);
      });
    });

    describe("unsubscribe()", function () {
      var subscriber,
          eventName;

      beforeEach(function () {
        subscriber = {subscriberId: 'FOO'};
        eventName = 'event1';
        spyOn($event.EventSpace, 'off');

        result = eventListener.unsubscribe(subscriber, eventName);
      });

      it("should return self", function () {
        expect(result).toBe(eventListener);
      });

      it("should invoke EventSpace#off", function () {
        expect($event.EventSpace.off).toHaveBeenCalledWith(
            eventName,
            eventListener.listeningPath,
            subscriber.subscriberId);
      });
    });
  });
});
