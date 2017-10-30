"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $event = window['blend-event'];

describe("$event", function () {
  describe("Event", function () {
    var Event,
        event,
        result;

    beforeAll(function () {
      Event = $oop.getClass('test.$event.Event.Event')
      .blend($event.Event);
    });

    beforeEach(function () {
      event = Event.create({eventName: 'event1'});
    });

    describe("create()", function () {
      it("should set eventName", function () {
        expect(event.eventName).toBe('event1');
      });

      it("should elevate unlink()", function () {
        expect(event.hasOwnProperty('unlink')).toBeTruthy();
      });

      it("should initialize propagates flag to default", function () {
        expect(event.propagates).toBe(true);
      });

      it("should initialize targetPaths array", function () {
        expect(event.targetPaths).toEqual([]);
      });

      describe("on invalid arguments", function () {
        it("should throw", function () {
          expect(function () {
            Event.create({});
          }).toThrow();
        });
      });
    });

    describe("fromEventName()", function () {
      var event;

      beforeEach(function () {
        event = {};
        spyOn(Event, 'create').and.returnValue(event);
        result = Event.fromEventName('event1');
      });

      it("should pass eventName to create", function () {
        expect(Event.create).toHaveBeenCalledWith({
          eventName: 'event1'
        });
      });

      it("should return created instance", function () {
        expect(result).toBe(event);
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        event.causingEvent = Event.create({
          eventName: 'event2',
          sender: {}
        });

        result = event.clone();
      });

      it("should return cloned instance", function () {
        expect(result).not.toBe(event);
      });

      it("should be equivalent", function () {
        expect(result.eventName).toEqual(event.eventName);
        expect(result.causingEvent).toEqual(event.causingEvent);
        expect(result.sender).toEqual(event.sender);
        expect(result.currentPath).toEqual(event.currentPath);
      });
    });

    describe("addTargetPaths()", function () {
      var targetPaths;

      beforeEach(function () {
        targetPaths = [
          'foo.bar'.toPath(),
          'baz.quux'.toPath()
        ];
        result = event.addTargetPaths(targetPaths);
      });

      it("should return self", function () {
        expect(result).toBe(event);
      });

      it("should add paths to targetPaths", function () {
        expect(event.targetPaths).toEqual([
          'foo.bar'.toPath(),
          'baz.quux'.toPath()
        ]);
      });
    });

    describe("addTargetPath()", function () {
      var targetPath;

      beforeEach(function () {
        targetPath = 'foo.bar'.toPath();
        result = event.addTargetPath(targetPath);
      });

      it("should return self", function () {
        expect(result).toBe(event);
      });

      it("should add path to targetPaths", function () {
        expect(event.targetPaths).toEqual([
          'foo.bar'.toPath()
        ]);
      });
    });

    describe("addBubblingPath()", function () {
      var bubblingPath;

      beforeEach(function () {
        bubblingPath = 'foo.bar.baz'.toPath();
        result = event.addBubblingPath(bubblingPath);
      });

      it("should return self", function () {
        expect(result).toBe(event);
      });

      it("should add bubble paths to targetPaths", function () {
        expect(event.targetPaths).toEqual([
          'foo.bar'.toPath(),
          'foo'.toPath()
        ]);
      });
    });

    describe("addBroadcastPath()", function () {
      var subscriptionData,
          broadcastPath;

      beforeEach(function () {
        subscriptionData = $event.EventSpace.create().subscriptions.data;
        $event.EventSpace.create().subscriptions.data = {};

        broadcastPath = 'foo.bar'.toPath();
        $event.EventSpace.create()
        .on('event1', 'foo.bar.baz.quux'.toPath(), '1', function () {})
        .on('event1', 'foo.bar.baz.quux'.toPath(), '2', function () {})
        .on('event1', 'foo.bar'.toPath(), '3', function () {})
        .on('event1', 'foo'.toPath(), '4', function () {});
        result = event.addBroadcastPath(broadcastPath);
      });

      afterEach(function () {
        $event.EventSpace.create().subscriptions.data = subscriptionData;
      });

      it("should return self", function () {
        expect(result).toBe(event);
      });

      it("should add broadcast paths to targetPaths", function () {
        expect(event.targetPaths).toEqual([
          'foo.bar.baz.quux'.toPath()
        ]);
      });
    });

    describe("setPropagates()", function () {
      beforeEach(function () {
        result = event.setPropagates(false);
      });

      it("should return self", function () {
        expect(result).toBe(event);
      });

      it("should set causingEvent", function () {
        expect(event.propagates).toBe(false);
      });
    });

    describe("stopPropagation()", function () {
      beforeEach(function () {
        result = event
        .stopPropagation();
      });

      it("should return self", function () {
        expect(result).toBe(event);
      });

      it("should set bubbles", function () {
        expect(event.bubbles).toBeFalsy();
      });
    });

    describe("trigger()", function () {
      var subscriptionData,
          deferred,
          callback1, callback2, callback3,
          eventTrail,
          lastEvent;

      beforeEach(function () {
        subscriptionData = $event.EventSpace.create().subscriptions.data;
        $event.EventSpace.create().subscriptions.data = {};

        deferred = $utils.Deferred.create();

        callback1 = jasmine.createSpy().and.returnValue(deferred.promise);
        callback2 = jasmine.createSpy();
        callback3 = jasmine.createSpy();

        $event.EventSpace.create()
        .on('event1', 'foo.bar.baz'.toPath(), '1', callback1)
        .on('event1', 'foo.bar.baz'.toPath(), '2', callback2)
        .on('event1', 'foo'.toPath(), '3', callback3);

        lastEvent = Event.create({
          eventName: 'event2',
          sender: {}
        });
        eventTrail = $event.EventTrail.create()
        .clear()
        .push(lastEvent);

        event.addTargetPaths([
          'foo.bar.baz'.toPath(),
          'foo.bar'.toPath(),
          'foo'.toPath()]);

        result = event.trigger();
      });

      afterEach(function () {
        $event.EventSpace.create().subscriptions.data = subscriptionData;
      });

      it("should return pending promise", function () {
        expect($utils.Promise.mixedBy(result)).toBeTruthy();
        expect(result.promiseState).toBe($utils.PROMISE_STATE_PENDING);
      });

      it("should push event to chain", function () {
        expect(eventTrail.data.previousLink).toBe(event);
      });

      it("should add last event in EventTrail as causingEvent", function () {
        expect(event.causingEvent).toBe(lastEvent);
      });

      describe("when callbacks complete", function () {
        beforeEach(function () {
          deferred.resolve();
        });

        it("should unlink event", function () {
          expect(eventTrail.data.previousLink).not.toBe(event);
        });

        it("should resolve returned promise", function () {
          expect(result.promiseState).toBe($utils.PROMISE_STATE_FULFILLED);
        });
      });
    });
  });
});
