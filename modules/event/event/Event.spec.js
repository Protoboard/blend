"use strict";

var $oop = window['giant-oop'],
  $data = window['giant-data'],
  $event = window['giant-event'];

describe("$event", function () {
  describe("Event", function () {
    var Event,
      event,
      result;

    beforeEach(function () {
      Event = $oop.getClass('test.$event.Event.Event')
        .extend($event.Event);

      event = Event.create('event1');
    });

    describe("create()", function () {
      it("should set eventName", function () {
        expect(event.eventName).toBe('event1');
      });

      it("should initialize originalEvent", function () {
        expect(event.hasOwnProperty('originalEvent')).toBeTruthy();
      });

      it("should initialize sender", function () {
        expect(event.hasOwnProperty('sender')).toBeTruthy();
      });

      it("should initialize targetPath", function () {
        expect(event.hasOwnProperty('targetPath')).toBeTruthy();
      });

      it("should initialize currentPath", function () {
        expect(event.hasOwnProperty('currentPath')).toBeTruthy();
      });

      it("should initialize bubbles", function () {
        expect(event.bubbles).toBe(false);
      });

      it("should initialize defaultPrevented", function () {
        expect(event.defaultPrevented).toBe(false);
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        event
          .setOriginalEvent(Event.create('event2'))
          .setSender({})
          .setTargetPath('foo.bar.baz'.toPath())
          .setBubbles(true)
          .preventDefault();

        result = event.clone();
      });

      it("should return cloned instance", function () {
        expect(result).not.toBe(event);
      });

      it("should be equivalent", function () {
        expect(result.eventName).toEqual(event.eventName);
        expect(result.originalEvent).toEqual(event.originalEvent);
        expect(result.sender).toEqual(event.sender);
        expect(result.targetPath).toEqual(event.targetPath);
        expect(result.currentPath).toEqual(event.currentPath);
        expect(result.bubbles).toEqual(event.bubbles);
        expect(result.defaultPrevented).toEqual(event.defaultPrevented);
      });
    });

    describe("trigger()", function () {
      var callback1, callback2, callback3;

      beforeEach(function () {
        callback1 = jasmine.createSpy();
        callback2 = jasmine.createSpy();
        callback3 = jasmine.createSpy();

        $event.EventSpace.create()
          .destroy()
          .on('event1', callback1, 'foo.bar.baz'.toPath(), '1')
          .on('event1', callback2, 'foo.bar.baz'.toPath(), '2')
          .on('event1', callback3, 'foo'.toPath(), '3');

        event
          .setOriginalEvent(Event.create('event1'))
          .setSender({})
          .setTargetPath('foo.bar.baz'.toPath());
      });

      it("should return self", function () {
        result = event.trigger();
        expect(result).toBe(event);
      });

      describe("on missing sender", function () {
        it("should throw", function () {
          expect(function () {
            Event.create('event1')
              .setOriginalEvent(Event.create('foo'))
              .setTargetPath('foo.bar'.toPath())
              .trigger();
          }).toThrow();
        });
      });

      describe("on missing originalEvent", function () {
        it("should throw", function () {
          expect(function () {
            Event.create('event1')
              .setSender({})
              .setTargetPath('foo.bar'.toPath())
              .trigger();
          }).toThrow();
        });
      });

      describe("on missing targetPath", function () {
        it("should throw", function () {
          expect(function () {
            Event.create('event1')
              .setSender({})
              .setOriginalEvent(Event.create('foo'))
              .trigger();
          }).toThrow();
        });
      });

      describe("when bubbling is off", function () {
        it("should not invoke callbacks on parent paths", function () {
          event.trigger();
          expect(callback1).toHaveBeenCalledTimes(1);
          expect(callback2).toHaveBeenCalledTimes(1);
          expect(callback3).not.toHaveBeenCalled();
        });
      });

      describe("when bubbling is on", function () {
        it("should invoke callbacks on parent paths", function () {
          event
            .setBubbles(true)
            .trigger();
          expect(callback1).toHaveBeenCalledTimes(1);
          expect(callback2).toHaveBeenCalledTimes(1);
          expect(callback3).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("broadcast", function () {
      var callback1, callback2, callback3, callback4;

      beforeEach(function () {
        callback1 = jasmine.createSpy();
        callback2 = jasmine.createSpy();
        callback3 = jasmine.createSpy();
        callback4 = jasmine.createSpy();

        $event.EventSpace.create()
          .destroy()
          .on('event1', callback1, 'foo.bar.baz.quux'.toPath(), '1')
          .on('event1', callback2, 'foo.bar.baz.quux'.toPath(), '2')
          .on('event1', callback3, 'foo.bar'.toPath(), '3')
          .on('event1', callback4, 'foo'.toPath(), '4');

        event
          .setOriginalEvent(Event.create('event1'))
          .setSender({})
          .setTargetPath('foo.bar'.toPath());
      });

      it("should return self", function () {
        result = event.broadcast();
        expect(result).toBe(event);
      });

      it("should invoke callbacks on descendant paths", function () {
        event.broadcast();
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback3).toHaveBeenCalledTimes(1);
      });

      describe("on missing sender", function () {
        it("should throw", function () {
          expect(function () {
            Event.create('event1')
              .setOriginalEvent(Event.create('foo'))
              .setTargetPath('foo.bar'.toPath())
              .broadcast();
          }).toThrow();
        });
      });

      describe("on missing originalEvent", function () {
        it("should throw", function () {
          expect(function () {
            Event.create('event1')
              .setSender({})
              .setTargetPath('foo.bar'.toPath())
              .broadcast();
          }).toThrow();
        });
      });

      describe("on missing targetPath", function () {
        it("should throw", function () {
          expect(function () {
            Event.create('event1')
              .setSender({})
              .setOriginalEvent(Event.create('foo'))
              .broadcast();
          }).toThrow();
        });
      });

      describe("when bubbling is off", function () {
        it("should not invoke callbacks on parent paths", function () {
          event.broadcast();
          expect(callback4).not.toHaveBeenCalled();
        });
      });

      describe("when bubbling is on", function () {
        it("should invoke callbacks on parent paths", function () {
          event
            .setBubbles(true)
            .broadcast();
          expect(callback4).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("setOriginalEvent()", function () {
      var originalEvent;

      beforeEach(function () {
        originalEvent = Event.create('event2');
        result = event.setOriginalEvent(originalEvent);
      });

      it("should return self", function () {
        expect(result).toBe(event);
      });

      it("should set originalEvent", function () {
        expect(event.originalEvent).toBe(originalEvent);
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

    describe("setTargetPath()", function () {
      var targetPath;

      beforeEach(function () {
        targetPath = 'foo.bar.baz'.toPath();
        result = event.setTargetPath(targetPath);
      });

      it("should return self", function () {
        expect(result).toBe(event);
      });

      it("should set targetPath", function () {
        expect(event.targetPath).toBe(targetPath);
      });
    });

    describe("setBubbles()", function () {
      var bubbles;

      beforeEach(function () {
        bubbles = true;
        result = event.setBubbles(bubbles);
      });

      it("should return self", function () {
        expect(result).toBe(event);
      });

      it("should set bubbles", function () {
        expect(event.bubbles).toBe(bubbles);
      });
    });

    describe("stopPropagation()", function () {
      beforeEach(function () {
        result = event
          .setBubbles(true)
          .stopPropagation();
      });

      it("should return self", function () {
        expect(result).toBe(event);
      });

      it("should set bubbles", function () {
        expect(event.bubbles).toBeFalsy();
      });
    });

    describe("preventDefault()", function () {
      beforeEach(function () {
        result = event.preventDefault();
      });

      it("should return self", function () {
        expect(result).toBe(event);
      });

      it("should set bubbles", function () {
        expect(event.defaultPrevented).toBeTruthy();
      });
    });
  });
});
