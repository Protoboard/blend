"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $event = window['blend-event'];

describe("$event", function () {
  describe("Event", function () {
    var Event,
        event;

    beforeAll(function () {
      Event = $oop.createClass('test.$event.Event.Event')
      .blend($event.Event)
      .build();
      Event.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".fromEventName()", function () {
      it("should return Event instance", function () {
        event = Event.fromEventName('event1');
        expect(Event.mixedBy(event)).toBeTruthy();
      });

      it("should set eventName property", function () {
        event = Event.fromEventName('event1');
        expect(event.eventName).toBe('event1');
      });

      it("should pass additional properties to create", function () {
        event = Event.fromEventName('event1', {bar: 'baz'});
        expect(event.bar).toBe('baz');
      });
    });

    describe(".create()", function () {
      it("should set eventName", function () {
        event = Event.create({eventName: 'event1'});
        expect(event.eventName).toBe('event1');
      });

      it("should elevate unlink()", function () {
        event = Event.create({eventName: 'event1'});
        expect(event.hasOwnProperty('unlink')).toBeTruthy();
      });

      it("should initialize propagates flag to default", function () {
        event = Event.create({eventName: 'event1'});
        expect(event.propagates).toBe(true);
      });

      it("should initialize targetPaths array", function () {
        event = Event.create({eventName: 'event1'});
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

    describe("#clone()", function () {
      beforeEach(function () {
        event = Event.create({eventName: 'event1'});
        event.causingEvent = Event.create({
          eventName: 'event2',
          sender: {}
        });
      });

      it("should return cloned instance", function () {
        var result = event.clone();
        expect(result).not.toBe(event);
      });

      it("should be equivalent", function () {
        var result = event.clone();
        expect(result.eventName).toEqual(event.eventName);
        expect(result.causingEvent).toEqual(event.causingEvent);
        expect(result.sender).toEqual(event.sender);
        expect(result.currentPath).toEqual(event.currentPath);
      });
    });

    describe("#addTargetPaths()", function () {
      var targetPaths;

      beforeEach(function () {
        event = Event.create({eventName: 'event1'});
        targetPaths = [
          'foo.bar',
          'baz.quux'
        ];
      });

      it("should return self", function () {
        var result = event.addTargetPaths(targetPaths);
        expect(result).toBe(event);
      });

      it("should add paths to targetPaths", function () {
        event.addTargetPaths(targetPaths);
        expect(event.targetPaths).toEqual([
          'foo.bar',
          'baz.quux'
        ]);
      });
    });

    describe("#addTargetPath()", function () {
      var targetPath;

      beforeEach(function () {
        event = Event.create({eventName: 'event1'});
        targetPath = 'foo.bar';
      });

      it("should return self", function () {
        var result = event.addTargetPath(targetPath);
        expect(result).toBe(event);
      });

      it("should add path to targetPaths", function () {
        event.addTargetPath(targetPath);
        expect(event.targetPaths).toEqual([
          'foo.bar'
        ]);
      });
    });

    describe("#addBubblingPath()", function () {
      var bubblingPath;

      beforeEach(function () {
        event = Event.create({eventName: 'event1'});
        bubblingPath = 'foo.bar.baz';
      });

      it("should return self", function () {
        var result = event.addBubblingPath(bubblingPath);
        expect(result).toBe(event);
      });

      it("should add bubble paths to targetPaths", function () {
        event.addBubblingPath(bubblingPath);
        expect(event.targetPaths).toEqual([
          'foo.bar',
          'foo'
        ]);
      });
    });

    describe("#addBroadcastPath()", function () {
      var subscriptionData,
          broadcastPath;

      beforeEach(function () {
        event = Event.create({eventName: 'event1'});
        subscriptionData = $event.EventSpace.create().subscriptions.data;
        $event.EventSpace.create().subscriptions.data = {};

        broadcastPath = 'foo.bar';
        $event.EventSpace.create()
        .on('event1', 'foo.bar.baz.quux', '1', function () {})
        .on('event1', 'foo.bar.baz.quux', '2', function () {})
        .on('event1', 'foo.bar', '3', function () {})
        .on('event1', 'foo', '4', function () {});
      });

      afterEach(function () {
        $event.EventSpace.create().subscriptions.data = subscriptionData;
      });

      it("should return self", function () {
        var result = event.addBroadcastPath(broadcastPath);
        expect(result).toBe(event);
      });

      it("should add broadcast paths to targetPaths", function () {
        event.addBroadcastPath(broadcastPath);
        expect(event.targetPaths).toEqual([
          'foo.bar.baz.quux'
        ]);
      });
    });

    describe("#setPropagates()", function () {
      beforeEach(function () {
        event = Event.create({eventName: 'event1'});
      });

      it("should return self", function () {
        var result = event.setPropagates(false);
        expect(result).toBe(event);
      });

      it("should set causingEvent", function () {
        event.setPropagates(false);
        expect(event.propagates).toBe(false);
      });
    });

    describe("#stopPropagation()", function () {
      beforeEach(function () {
        event = Event.create({eventName: 'event1'});
      });

      it("should return self", function () {
        var result = event.stopPropagation();
        expect(result).toBe(event);
      });

      it("should set bubbles", function () {
        event.stopPropagation();
        expect(event.bubbles).toBeFalsy();
      });
    });

    describe("#getCausingEvents()", function () {
      var event2, event3;

      beforeEach(function () {
        event = Event.create({eventName: 'event1'});
        event2 = Event.create({eventName: 'event2'});
        event3 = Event.create({eventName: 'event3'});
        event.causingEvent = event2;
        event2.causingEvent = event3;
      });

      it("should return Array of causingEvents", function () {
        var result = event.getCausingEvents();
        expect(result).toEqual([event3, event2]);
      });
    });

    describe("#getLastCausingEventByName()", function () {
      var event2, event3, event4;

      beforeEach(function () {
        event = Event.create({eventName: 'event1'});
        event2 = Event.create({eventName: 'foo'});
        event3 = Event.create({eventName: 'bar'});
        event4 = Event.create({eventName: 'foo'});
        event.causingEvent = event2;
        event2.causingEvent = event3;
        event3.causingEvent = event4;
      });

      describe("when there is a match", function () {
        it("should return last event matching eventName", function () {
          var result = event.getLastCausingEventByName('foo');
          expect(result).toBe(event2);
        });
      });

      describe("when there is no match", function () {
        it("should return undefined", function () {
          var result = event.getLastCausingEventByName('baz');
          expect(result).toBeUndefined();
        });
      });
    });

    describe("#getLastCausingEventByClass()", function () {
      var Event2,
          Event3,
          event2,
          event3;

      beforeEach(function () {
        Event2 = $oop.createClass('test.$event.Event.Event2').build();
        Event3 = $oop.createClass('test.$event.Event.Event3').build();
        event = Event.create({eventName: 'event1'});
        event2 = Event2.create({eventName: 'event2'});
        event3 = Event.create({eventName: 'event3'});
        event.causingEvent = event2;
        event2.causingEvent = event3;
      });

      describe("when there is a match", function () {
        it("should return last event matching Class", function () {
          var result = event.getLastCausingEventByClass(Event2);
          expect(result).toBe(event2);
        });
      });

      describe("when there is no match", function () {
        it("should return undefined", function () {
          var result = event.getLastCausingEventByClass(Event3);
          expect(result).toBeUndefined();
        });
      });
    });

    describe("#trigger()", function () {
      var subscriptionData,
          deferred,
          callback1, callback2, callback3,
          eventTrail,
          lastEvent;

      beforeEach(function () {
        event = Event.create({eventName: 'event1'});
        subscriptionData = $event.EventSpace.create().subscriptions.data;
        $event.EventSpace.create().subscriptions.data = {};

        deferred = $utils.Deferred.create();

        callback1 = jasmine.createSpy().and.returnValue(deferred.promise);
        callback2 = jasmine.createSpy();
        callback3 = jasmine.createSpy();

        $event.EventSpace.create()
        .on('event1', 'foo.bar.baz', '1', callback1)
        .on('event1', 'foo.bar.baz', '2', callback2)
        .on('event1', 'foo', '3', callback3);

        lastEvent = Event.create({
          eventName: 'event2',
          sender: {}
        });
        eventTrail = $event.EventTrail.create()
        .clear()
        .push(lastEvent);

        event.addTargetPaths([
          'foo.bar.baz',
          'foo.bar',
          'foo']);
      });

      afterEach(function () {
        $event.EventSpace.create().subscriptions.data = subscriptionData;
      });

      it("should return pending promise", function () {
        var result = event.trigger();
        expect($utils.Promise.mixedBy(result)).toBeTruthy();
        expect(result.promiseState).toBe($utils.PROMISE_STATE_PENDING);
      });

      it("should push event to chain", function () {
        event.trigger();
        expect(eventTrail.data.previousLink).toBe(event);
      });

      it("should add last event in EventTrail as causingEvent", function () {
        event.trigger();
        expect(event.causingEvent).toBe(lastEvent);
      });

      describe("when callbacks complete", function () {
        var promise;

        beforeEach(function () {
          promise = event.trigger();
        });

        it("should unlink event", function () {
          deferred.resolve();
          expect(eventTrail.data.previousLink).not.toBe(event);
        });

        it("should resolve returned promise", function () {
          deferred.resolve();
          expect(promise.promiseState).toBe($utils.PROMISE_STATE_FULFILLED);
        });
      });
    });
  });
});
