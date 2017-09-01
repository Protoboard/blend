"use strict";

var $oop = window['cake-oop'],
    $event = window['cake-event'];

describe("$event", function () {
  describe("EventSubscriber", function () {
    var Subscriber,
        subscriber,
        result;

    beforeEach(function () {
      $event.EventSpace.__instanceLookup = {};
      Subscriber = $oop.getClass('test.$event.EventSubscriber.Subscriber')
      .mix($event.EventSubscriber)
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
          eventListener,
          eventName,
          callback;

      beforeEach(function () {
        eventSpace = $event.EventSpace.create();
        eventListener = {listeningPath: 'path'.toPath()};
        eventName = 'event1';
        callback = function () {};
        spyOn(eventSpace, 'on');

        result = subscriber.subscribeTo(eventListener, eventName, callback);
      });

      it("should return self", function () {
        expect(result).toBe(subscriber);
      });

      it("should subscribeTo on EventSpace", function () {
        expect(eventSpace.on)
        .toHaveBeenCalledWith(eventName, eventListener.listeningPath, 'foo', callback);
      });
    });

    describe("unsubscribeFrom()", function () {
      var eventSpace,
          eventListener,
          eventName;

      beforeEach(function () {
        eventSpace = $event.EventSpace.create();
        eventListener = {listeningPath: 'path'.toPath()};
        eventName = 'event1';
        spyOn(eventSpace, 'off');

        result = subscriber.unsubscribeFrom(eventListener, eventName);
      });

      it("should return self", function () {
        expect(result).toBe(subscriber);
      });

      it("should subscribeTo on EventSpace", function () {
        expect(eventSpace.off)
        .toHaveBeenCalledWith(eventName, eventListener.listeningPath, 'foo');
      });
    });
  });
});
