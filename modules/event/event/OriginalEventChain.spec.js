"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'],
    $event = window['cake-event'];

describe("$event", function () {
  describe("OriginalEventChain", function () {
    var originalEventChain;

    describe("create()", function () {
      describe("then creating another again", function () {
        it("should return the same instance", function () {
          // todo Revisit once caching propagation is fixed in $oop.Class
          $event.OriginalEventChain.__instanceLookup = {};
          originalEventChain = $event.OriginalEventChain.create();
          expect($event.OriginalEventChain.create()).toBe(originalEventChain);
        });
      });
    });
  });
});
