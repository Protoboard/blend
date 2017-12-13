"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("ApiEvent", function () {
    describe("create()", function () {
      describe("when environment is browser & has xhr property", function () {
        it("should return XhrEvent instance", function () {
          var result = $api.ApiEvent.create({
            eventName: 'api.foo',
            xhr: new XMLHttpRequest()
          });
          expect($api.XhrEvent.mixedBy(result)).toBeTruthy();
        });
      });
    });
  });
});
