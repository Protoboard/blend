"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-utils'],
    $event = window['cake-event'];

describe("$event", function () {
  describe("Event", function () {
    var Event,
        event,
        result;

    beforeEach(function () {
      Event = $oop.getClass('test.$event.Event.Event')
      .mix($event.Event);

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
        event
        .setCausingEvent(Event.create({eventName: 'event2'}))
        .setSender({});

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

    describe("traverse()", function () {
      var deferred,
          callback1, callback2, callback3,
          eventTrail;

      beforeEach(function () {
        deferred = $utils.Deferred.create();

        callback1 = jasmine.createSpy().and.returnValue(deferred.promise);
        callback2 = jasmine.createSpy();
        callback3 = jasmine.createSpy();

        eventTrail = $event.EventTrail.create().clear();

        $event.EventSpace.create()
        .destroy()
        .on('event1', 'foo.bar.baz'.toPath(), '1', callback1)
        .on('event1', 'foo.bar.baz'.toPath(), '2', callback2)
        .on('event1', 'foo'.toPath(), '3', callback3);

        event
        .setSender({});

        result = event.traverse([
          'foo.bar.baz'.toPath(),
          'foo.bar'.toPath(),
          'foo'.toPath()]);
      });

      it("should return pending promise", function () {
        expect($utils.Promise.mixedBy(result)).toBeTruthy();
        expect(result.promiseState).toBe($utils.PROMISE_STATE_PENDING);
      });

      it("should push event to chain", function () {
        expect(eventTrail.data.nextLink).toBe(event);
        expect(eventTrail.getItemCount()).toBe(1);
      });

      describe("when callbacks complete", function () {
        beforeEach(function () {
          deferred.resolve();
        });

        it("should unlink event", function () {
          expect(eventTrail.getItemCount()).toBe(0);
        });

        it("should resolve returned promise", function () {
          expect(result.promiseState).toBe($utils.PROMISE_STATE_FULFILLED);
        });
      });

      describe("on missing sender", function () {
        it("should throw", function () {
          expect(function () {
            Event.create({eventName: 'event1'})
            .traverse(['foo.bar'.toPath()]);
          }).toThrow();
        });
      });

      describe("on missing causingEvent", function () {
        var event2;

        beforeEach(function () {
          event = Event.create({eventName: 'event1'});
          event2 = Event.create({eventName: 'event2'});
          eventTrail.push(event2);

          event
          .setSender({})
          .traverse([
            'foo.bar.baz'.toPath(),
            'foo.bar'.toPath(),
            'foo'.toPath()]);
        });

        it("should add last event in EventTrail as causingEvent", function () {
          expect(event.causingEvent).toBe(event2);
        });
      });
    });

    describe("trigger()", function () {
      var promise;

      beforeEach(function () {
        promise = {};
        spyOn(event, 'traverse').and.returnValue(promise);
        event.setSender({});
      });

      it("should return promise", function () {
        result = event.trigger('foo.bar.baz'.toPath());
        expect(result).toBe(promise);
      });

      describe("when bubbles", function () {
        beforeEach(function () {
          event.trigger('foo.bar.baz'.toPath(), true);
        });

        it("should pass spread targetPath to traverse()", function () {
          expect(event.traverse).toHaveBeenCalledWith([
            'foo.bar.baz'.toPath(),
            'foo.bar'.toPath(),
            'foo'.toPath()
          ]);
        });
      });

      describe("when doesn't bubble", function () {
        beforeEach(function () {
          event.trigger('foo.bar.baz'.toPath(), false);
        });

        it("should pass unspread targetPath to traverse()", function () {
          expect(event.traverse).toHaveBeenCalledWith(['foo.bar.baz'.toPath()]);
        });
      });
    });

    describe("broadcast()", function () {
      var promise;

      beforeEach(function () {
        promise = {};
        spyOn(event, 'traverse').and.returnValue(promise);
        event.setSender({});

        $event.EventSpace.create()
        .destroy()
        .on('event1', 'foo.bar.baz.quux'.toPath(), '1', function () {})
        .on('event1', 'foo.bar.baz.quux'.toPath(), '2', function () {})
        .on('event1', 'foo.bar'.toPath(), '3', function () {})
        .on('event1', 'foo'.toPath(), '4', function () {});
      });

      it("should return promise", function () {
        result = event.broadcast('foo'.toPath());
        expect(result).toBe(promise);
      });

      describe("when bubbles", function () {
        beforeEach(function () {
          event.broadcast('foo.bar'.toPath(), true);
        });

        it("should pass spread targetPath to traverse()", function () {
          expect(event.traverse).toHaveBeenCalledWith([
            'foo.bar.baz.quux'.toPath(),
            'foo.bar'.toPath(),
            'foo'.toPath()
          ]);
        });
      });

      describe("when doesn't bubble", function () {
        beforeEach(function () {
          event.broadcast('foo.bar'.toPath(), false);
        });

        it("should pass spread targetPath to traverse()", function () {
          expect(event.traverse).toHaveBeenCalledWith([
            'foo.bar.baz.quux'.toPath(),
            'foo.bar'.toPath()
          ]);
        });
      });
    });

    describe("setSender()", function () {
      var sender;

      beforeEach(function () {
        sender = {};
        result = event.setSender(sender);
      });

      it("should return self", function () {
        expect(result).toBe(event);
      });

      it("should set sender", function () {
        expect(event.sender).toBe(sender);
      });
    });

    describe("setCausingEvent()", function () {
      var causingEvent;

      beforeEach(function () {
        causingEvent = Event.create({eventName: 'event2'});
        result = event.setCausingEvent(causingEvent);
      });

      it("should return self", function () {
        expect(result).toBe(event);
      });

      it("should set causingEvent", function () {
        expect(event.causingEvent).toBe(causingEvent);
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
  });
});
