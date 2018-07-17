"use strict";

var $oop = window['blend-oop'],
    $event = window['blend-event'];

describe("$event", function () {
  describe("EventSender", function () {
    var EventSender,
        eventSender,
        result;

    beforeAll(function () {
      EventSender = $oop.createClass('test.$event.EventSender.EventSender')
      .blend($event.EventSender)
      .build();
    });

    beforeEach(function () {
      eventSender = EventSender.create();
    });

    describe(".create()", function () {
      it("should initialize triggerPaths property", function () {
        expect(eventSender.triggerPaths).toEqual({list: [], lookup: {}});
      });
    });

    describe("#spawnEvent()", function () {
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

    describe("#addTriggerPath()", function () {
      var triggerPath;

      beforeEach(function () {
        triggerPath = 'foo.bar';
      });

      it("should return self", function () {
        var result = eventSender.addTriggerPath(triggerPath);
        expect(result).toBe(eventSender);
      });

      it("should add to triggerPaths", function () {
        eventSender.addTriggerPath(triggerPath);
        expect(eventSender.triggerPaths).toEqual({
          list: [triggerPath],
          lookup: {
            'foo.bar': 1
          }
        });
      });

      describe("when adding existing triggerPath", function () {
        beforeEach(function () {
          eventSender.addTriggerPath(triggerPath);
        });

        it("should not add path again", function () {
          eventSender.addTriggerPath(triggerPath);
          expect(eventSender.triggerPaths).toEqual({
            list: [triggerPath],
            lookup: {
              'foo.bar': 1
            }
          });
        });
      });
    });

    describe("#addTriggerPathBefore()", function () {
      var triggerPath,
          nextTriggerPath;

      beforeEach(function () {
        eventSender
        .addTriggerPath('foo.bar')
        .addTriggerPath('foo');
        triggerPath = 'foo.bar.baz';
        nextTriggerPath = 'foo.bar';
      });

      it("should return self", function () {
        var result = eventSender.addTriggerPath(triggerPath);
        expect(result).toBe(eventSender);
      });

      it("should insert before nextTriggerPath", function () {
        eventSender.addTriggerPathBefore(triggerPath, nextTriggerPath);
        expect(eventSender.triggerPaths).toEqual({
          list: [triggerPath, 'foo.bar', 'foo'],
          lookup: {
            'foo.bar.baz': 1,
            'foo.bar': 1,
            'foo': 1
          }
        });
      });

      describe("when nextTriggerPath is not present", function () {
        it("should append to triggerPaths", function () {
          eventSender.addTriggerPathBefore(triggerPath, 'xyz');
          expect(eventSender.triggerPaths).toEqual({
            list: ['foo.bar', 'foo', triggerPath],
            lookup: {
              'foo.bar.baz': 1,
              'foo.bar': 1,
              'foo': 1
            }
          });
        });
      });

      describe("when adding existing triggerPath", function () {
        beforeEach(function () {
          eventSender.addTriggerPath(triggerPath);
        });

        it("should not add path again", function () {
          eventSender.addTriggerPathBefore(triggerPath, nextTriggerPath);
          expect(eventSender.triggerPaths).toEqual({
            list: ['foo.bar', 'foo', triggerPath],
            lookup: {
              'foo.bar.baz': 1,
              'foo.bar': 1,
              'foo': 1
            }
          });
        });
      });
    });

    describe("#addTriggerPaths()", function () {
      var triggerPaths;

      beforeEach(function () {
        triggerPaths = ['foo', 'bar.baz'];
      });

      it("should return self", function () {
        var result = eventSender.addTriggerPaths(triggerPaths);
        expect(result).toBe(eventSender);
      });

      it("should add to triggerPaths", function () {
        eventSender.addTriggerPaths(triggerPaths);
        expect(eventSender.triggerPaths).toEqual({
          list: triggerPaths,
          lookup: {
            'foo': 1,
            'bar.baz': 1
          }
        });
      });

      describe("when adding existing triggerPaths", function () {
        var triggerPaths2;

        beforeEach(function () {
          eventSender.addTriggerPaths(triggerPaths);
          triggerPaths2 = ['baz', 'bar.baz'];
        });

        it("should not add existing paths", function () {
          eventSender.addTriggerPaths(triggerPaths2);
          expect(eventSender.triggerPaths).toEqual({
            list: ['foo', 'bar.baz', 'baz'],
            lookup: {
              'foo': 1,
              'bar.baz': 1,
              'baz': 1
            }
          });
        });
      });
    });

    describe("#removeTriggerPath()", function () {
      var triggerPath;

      beforeEach(function () {
        triggerPath = 'foo.bar';
        eventSender.addTriggerPath(triggerPath);
      });

      it("should return self", function () {
        var result = eventSender.removeTriggerPath(triggerPath);
        expect(result).toBe(eventSender);
      });

      it("should remove from triggerPaths", function () {
        eventSender.removeTriggerPath(triggerPath);
        expect(eventSender.triggerPaths).toEqual({
          list: [],
          lookup: {}
        });
      });

      describe("when removing absent triggerPath", function () {
        beforeEach(function () {
          eventSender.removeTriggerPath(triggerPath);
        });

        it("should not affect triggerPaths", function () {
          eventSender.removeTriggerPath(triggerPath);
          expect(eventSender.triggerPaths).toEqual({
            list: [],
            lookup: {}
          });
        });
      });
    });

    describe("#removeTriggerPaths()", function () {
      var triggerPaths;

      beforeEach(function () {
        triggerPaths = ['foo', 'bar.baz'];
        eventSender.addTriggerPaths(triggerPaths);
      });

      it("should return self", function () {
        var result = eventSender.removeTriggerPaths(triggerPaths);
        expect(result).toBe(eventSender);
      });

      it("should remove from triggerPaths", function () {
        eventSender.removeTriggerPaths(triggerPaths);
        expect(eventSender.triggerPaths).toEqual({
          list: [],
          lookup: {}
        });
      });

      describe("when removing absent triggerPaths", function () {
        var triggerPaths2;

        beforeEach(function () {
          triggerPaths2 = ['baz', 'bar.baz'];
        });

        it("should only remove existing paths", function () {
          eventSender.removeTriggerPaths(triggerPaths2);
          expect(eventSender.triggerPaths).toEqual({
            list: ['foo'],
            lookup: {
              'foo': 1
            }
          });
        });
      });
    });

    describe("#trigger()", function () {
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
