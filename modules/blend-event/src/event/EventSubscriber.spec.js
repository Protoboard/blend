"use strict";

var $oop = window['blend-oop'],
    $event = window['blend-event'];

describe("$event", function () {
  describe("EventSubscriber", function () {
    var eventSpaceInstanceLookup,
        Subscriber,
        subscriber,
        Listener,
        listener,
        eventSpace;

    beforeAll(function () {
      Subscriber = $oop.createClass('test.$event.EventSubscriber.Subscriber')
      .blend($event.EventSubscriber)
      .define({
        foo: function () {},
        bar: function () {},
        onFoo: function () {},
        onBar: function () {},
        on: function () {
          return this;
        }
      })
      .build();
      Listener = $oop.createClass('test.$event.EventSubscriber.Listener')
      .blend($event.EventListener)
      .define({
        init: function () {
          this.setListeningPath('path');
        }
      })
      .build();
    });

    beforeEach(function () {
      eventSpaceInstanceLookup = $event.EventSpace.__builder.instances;
      $event.EventSpace.__builder.instances = {};
      eventSpace = $event.EventSpace.create();
    });

    afterEach(function () {
      $event.EventSpace.__builder.instances = eventSpaceInstanceLookup;
    });

    describe(".create()", function () {
      beforeEach(function () {
        spyOn(Subscriber, 'elevateMethods');
      });

      describe("on missing subscriberId", function () {
        it("should throw", function () {
          expect(function () {
            Subscriber.create();
          }).toThrow();
        });
      });

      it("should elevate event handlers", function () {
        subscriber = Subscriber.create({subscriberId: 'foo'});
        expect(Subscriber.elevateMethods)
        .toHaveBeenCalledWith('onFoo', 'onBar');
      });
    });

    describe("#destroy()", function () {
      beforeEach(function () {
        subscriber = Subscriber.create({subscriberId: 'foo'});
        spyOn(subscriber, 'off');
      });

      it("should return self", function () {
        var result = subscriber.destroy();
        expect(result).toBe(subscriber);
      });

      it("should unsubscribe from all paths", function () {
        subscriber.destroy();
        expect(subscriber.off).toHaveBeenCalled();
      });
    });

    describe("#on()", function () {
      var callback;

      beforeEach(function () {
        subscriber = Subscriber.create({subscriberId: 'foo'});
        listener = Listener.create();
        callback = function () {};
        spyOn(eventSpace, 'on');
      });

      it("should return self", function () {
        var result = subscriber.on('event1', listener, callback);
        expect(result).toBe(subscriber);
      });

      it("should subscribe on EventSpace", function () {
        subscriber.on('event1', listener, callback);
        expect(eventSpace.on)
        .toHaveBeenCalledWith('event1', listener.listeningPath, 'foo', callback);
      });
    });

    describe("#off()", function () {
      beforeEach(function () {
        subscriber = Subscriber.create({subscriberId: 'foo'});
        listener = Listener.create();
        spyOn(eventSpace, 'off');
      });

      it("should return self", function () {
        var result = subscriber.off('event1', listener);
        expect(result).toBe(subscriber);
      });

      it("should unsubscribe on EventSpace", function () {
        subscriber.off('event1', listener);
        expect(eventSpace.off)
        .toHaveBeenCalledWith('event1', listener.listeningPath, 'foo');
      });
    });

    describe("#subscribes()", function () {
      var callback;

      beforeEach(function () {
        subscriber = Subscriber.create({subscriberId: 'foo'});
        listener = Listener.create();
        callback = function () {};
      });

      describe("when subscribed", function () {
        beforeEach(function () {
          subscriber.on('event1', listener, callback);
        });

        it("should return truthy", function () {
          var result = subscriber.subscribes('event1', listener);
          expect(result).toBeTruthy();
        });
      });

      describe("when not subscribed", function () {
        it("should return falsy", function () {
          var result = subscriber.subscribes('event1', listener);
          expect(result).toBeFalsy();
        });
      });
    });
  });
});
