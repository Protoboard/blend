"use strict";

var $event = window['blend-event'];

describe("$event", function () {
  var result;

  describe("spreadPathForBubbling()", function () {
    it("should return array", function () {
      result = $event.spreadPathForBubbling('foo.bar.baz'.toPath());
      expect(result instanceof Array).toBeTruthy();
    });

    it("should break down path to subpaths", function () {
      expect($event.spreadPathForBubbling('foo.bar.baz'.toPath())).toEqual([
        'foo.bar'.toPath(),
        'foo'.toPath()
      ]);
    });
  });

  describe("spreadPathForBroadcast()", function () {
    beforeEach(function () {
      $event.EventSpace.create()
      .on('event1', 'foo.bar.baz'.toPath(), 'subscriber1', function () {})
      .on('event1', 'foo.bar.baz'.toPath(), 'subscriber2', function () {})
      .on('event1', 'foo.baz'.toPath(), 'subscriber2', function () {})
      .on('event2', 'foo.bar'.toPath(), 'subscriber3', function () {})
      .on('event1', 'bar.baz'.toPath(), 'subscriber4', function () {})
      .on('event1', 'foo'.toPath(), 'subscriber5', function () {});
    });

    it("should return array", function () {
      result = $event.spreadPathForBroadcast('foo'.toPath(), 'event1');
      expect(result instanceof Array).toBeTruthy();
    });

    it("should retrieve all relative paths", function () {
      expect($event.spreadPathForBroadcast('foo'.toPath(), 'event1')).toEqual([
        'foo.bar.baz'.toPath(),
        'foo.baz'.toPath()
      ]);
    });
  });
});