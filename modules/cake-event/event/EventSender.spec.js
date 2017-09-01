"use strict";

var $oop = window['cake-oop'],
    $event = window['cake-event'];

describe("$event", function () {
  describe("EventSender", function () {
    var EventSender,
        eventSender,
        result;

    beforeEach(function () {
      EventSender = $oop.getClass('test.$event.EventSender.EventSender')
      .mix($event.EventSender);
      eventSender = EventSender.create();
    });

    describe("create()", function () {
      it("should initialize triggerPaths property", function () {
        expect(eventSender.triggerPaths).toEqual([]);
      });
    });

    describe("spawnEvent()", function () {
      var eventName;

      beforeEach(function () {
        eventName = 'event1';
        result = eventSender.spawnEvent(eventName);
      });

      it("should return an Event instance", function () {
        expect($event.Event.mixedBy(result)).toBeTruthy();
      });

      it("should set eventName on returned event", function () {
        expect(result.eventName).toBe(eventName);
      });

      it("should set sender to EventSender instance", function () {
        expect(result.sender).toBe(eventSender);
      });
    });

    describe("addTriggerPath()", function () {
      var triggerPath;

      beforeEach(function () {
        triggerPath = 'foo.bar'.toPath();
        result = eventSender.addTriggerPath(triggerPath);
      });

      it("should return self", function () {
        expect(result).toBe(eventSender);
      });

      it("should add to triggerPaths", function () {
        expect(eventSender.triggerPaths).toEqual([triggerPath]);
      });
    });

    describe("addTriggerPaths()", function () {
      var triggerPaths;

      beforeEach(function () {
        triggerPaths = [
          'foo'.toPath(),
          'bar.baz'.toPath()];
        result = eventSender.addTriggerPaths(triggerPaths);
      });

      it("should return self", function () {
        expect(result).toBe(eventSender);
      });

      it("should add to triggerPaths", function () {
        expect(eventSender.triggerPaths).toEqual(triggerPaths);
      });
    });

    describe("trigger()", function () {
      var promise,
          eventName;

      beforeEach(function () {
        promise = {};
        spyOn($event.Event, 'traverse').and.returnValue(promise);
        eventName = 'event1';
        result = eventSender.trigger(eventName);
      });

      it("should return promise from Event#traverse", function () {
        expect(result).toBe(promise);
      });

      it("should pass triggerPaths to Event#traverse", function () {
        expect($event.Event.traverse)
        .toHaveBeenCalledWith(eventSender.triggerPaths);
      });
    });

    describe("broadcast()", function () {
      var promise,
          eventName,
          bubbles,
          triggerPath;

      beforeEach(function () {
        promise = {};
        eventName = 'event1';
        bubbles = true;
        triggerPath = 'foo.bar'.toPath();
        spyOn($event.Event, 'broadcast').and.returnValue(promise);

        eventSender.addTriggerPath(triggerPath);

        result = eventSender.broadcast(eventName, bubbles);
      });

      it("should return promise from Event#broadcast", function () {
        expect(result).toBe(promise);
      });

      it("should pass triggerPaths to Event#traverse", function () {
        expect($event.Event.broadcast)
        .toHaveBeenCalledWith(triggerPath, bubbles);
      });

      describe("when triggerPaths are too few", function () {
        it("should throw", function () {
          eventSender = EventSender.create();
          expect(function () {
            eventSender.broadcast(eventName, bubbles);
          }).toThrow();
        });
      });

      describe("when triggerPaths are too many", function () {
        it("should throw", function () {
          eventSender = EventSender.create()
          .addTriggerPaths([
            'foo'.toPath(),
            'foo.bar'.toPath()]);
          expect(function () {
            eventSender.broadcast(eventName, bubbles);
          }).toThrow();
        });
      });
    });
  });
});
