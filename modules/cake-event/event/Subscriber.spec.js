"use strict";

var $oop = window['cake-oop'],
    $event = window['cake-event'];

describe("$event", function () {
  describe("Subscriber", function () {
    var Subscriber,
        subscriber,
        result;

    beforeEach(function () {
      $event.EventSpace.__instanceLookup = {};
      Subscriber = $oop.getClass('test.$event.Subscriber.Subscriber')
      .mix($event.Subscriber)
      .define({
        foo: function () {},
        bar: function () {},
        onFoo: function () {},
        onBar: function () {},
        on: function () {}
      });
      subscriber = Subscriber.create({subscriberId: 'foo'});
    });

    describe("create()", function () {
      beforeEach(function () {
        spyOn(Subscriber, 'elevateMethods');
        subscriber = Subscriber.create({subscriberId: 'foo'});
      });

      describe("on missing subscriberId", function () {
        it("should throw", function () {
          expect(function () {
            Subscriber.create();
          }).toThrow();
        });
      });

      it("should elevate event handlers", function () {
        expect(Subscriber.elevateMethods)
        .toHaveBeenCalledWith('onFoo', 'onBar');
      });
    });

    describe("subscribeTo()", function () {
      var eventSpace,
          evented,
          eventName,
          callback;

      beforeEach(function () {
        eventSpace = $event.EventSpace.create();
        evented = {eventPath: {}};
        eventName = 'event1';
        callback = function () {};
        spyOn(eventSpace, 'on');

        result = subscriber.subscribeTo(evented, eventName, callback);
      });

      it("should return self", function () {
        expect(result).toBe(subscriber);
      });

      it("should subscribe on EventSpace", function () {
        expect(eventSpace.on)
        .toHaveBeenCalledWith(eventName, evented.eventPath, 'foo', callback);
      });
    });

    describe("unsubscribeFrom()", function () {
      var eventSpace,
          evented,
          eventName;

      beforeEach(function () {
        eventSpace = $event.EventSpace.create();
        evented = {eventPath: {}};
        eventName = 'event1';
        spyOn(eventSpace, 'off');

        result = subscriber.unsubscribeFrom(evented, eventName);
      });

      it("should return self", function () {
        expect(result).toBe(subscriber);
      });

      it("should subscribe on EventSpace", function () {
        expect(eventSpace.off)
        .toHaveBeenCalledWith(eventName, evented.eventPath, 'foo');
      });
    });
  });
});
