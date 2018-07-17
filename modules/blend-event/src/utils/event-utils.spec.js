"use strict";

var $event = window['blend-event'];

describe("$event", function () {
  var result;

  describe(".spreadPathForBubbling()", function () {
    it("should return array", function () {
      result = $event.spreadPathForBubbling('foo.bar.baz');
      expect(result instanceof Array).toBeTruthy();
    });

    it("should break down path to subpaths", function () {
      expect($event.spreadPathForBubbling('foo.bar.baz')).toEqual([
        'foo.bar',
        'foo'
      ]);
    });
  });

  describe(".spreadPathForBroadcast()", function () {
    var subscriptionData;

    beforeEach(function () {
      subscriptionData = $event.EventSpace.create().subscriptions.data;
      $event.EventSpace.create().subscriptions.data = {};

      $event.EventSpace.create()
      .on('event1', 'foo.bar.baz', 'subscriber1', function () {})
      .on('event1', 'foo.bar.baz', 'subscriber2', function () {})
      .on('event1', 'foo.baz', 'subscriber2', function () {})
      .on('event2', 'foo.bar', 'subscriber3', function () {})
      .on('event1', 'bar.baz', 'subscriber4', function () {})
      .on('event1', 'foo', 'subscriber5', function () {});
    });

    afterEach(function () {
      $event.EventSpace.create().subscriptions.data = subscriptionData;
    });

    it("should return array", function () {
      result = $event.spreadPathForBroadcast('foo', 'event1');
      expect(result instanceof Array).toBeTruthy();
    });

    it("should retrieve all relative paths", function () {
      expect($event.spreadPathForBroadcast('foo', 'event1')).toEqual([
        'foo.bar.baz',
        'foo.baz'
      ]);
    });
  });
});