"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("Dispatcher", function () {
    var Dispatcher,
        dispatcher;

    beforeAll(function () {
      Dispatcher = $oop.getClass('test.$api.Dispatcher.Dispatcher')
      .blend($api.Dispatcher);
      Dispatcher.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromRequest()", function () {
      var request;

      beforeEach(function () {
        request = 'foo/bar'.toHttpEndpoint().toRequest();
      });

      it("should return a Dispatcher instance", function () {
        dispatcher = Dispatcher.fromRequest(request);
        expect(Dispatcher.mixedBy(dispatcher)).toBeTruthy();
      });

      it("should set request property", function () {
        dispatcher = Dispatcher.fromRequest(request);
        expect(dispatcher.request).toBe(request);
      });
    });

    describe("create()", function () {
      describe("on invalid request", function () {
        it("should throe", function () {
          expect(function () {
            Dispatcher.create();
          }).toThrow();
          expect(function () {
            Dispatcher.create({request: 1});
          }).toThrow();
        });
      });
    });
  });

  describe("Request", function () {
    var request;

    describe("toDispatcher", function () {
      beforeEach(function () {
        request = 'foo/bar'.toHttpEndpoint().toRequest();
      });

      it("should return Dispatcher instance", function () {
        var result = request.toDispatcher();
        expect($api.Dispatcher.mixedBy(result)).toBeTruthy();
      });

      it("should set request property", function () {
        var result = request.toDispatcher();
        expect(result.request).toBe(request);
      });
    });
  });
});
