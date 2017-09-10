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
        result = eventSender.spawnEvent({
          eventName: eventName
        });
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
      var event,
          promise,
          eventName;

      beforeEach(function () {
        event = $event.Event.fromEventName('event1');
        promise = {};
        spyOn(eventSender, 'spawnEvent').and.returnValue(event);
        spyOn(event, 'trigger').and.returnValue(promise);
        eventName = 'event1';
        result = eventSender.trigger(eventName);
      });

      it("should return promise from Event#trigger", function () {
        expect(result).toBe(promise);
      });

      it("should spawn event", function () {
        expect(eventSender.spawnEvent).toHaveBeenCalledWith({
          eventName: eventName
        });
      });

      it("should invoke trigger on spawned event", function () {
        expect(event.trigger).toHaveBeenCalled();
      });
    });
  });
});
