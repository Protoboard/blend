"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("ActiveRequestIndex", function () {
    var ActiveRequestIndex,
        activeRequestIndex,
        indexData;

    beforeAll(function () {
      ActiveRequestIndex = $oop.createClass('test.$api.ActiveRequestIndex.ActiveRequestIndex')
      .blend($api.ActiveRequestIndex)
      .build();
      ActiveRequestIndex.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      ActiveRequestIndex.__builder.instances = {};
      indexData = $api.index.data;
      $api.index.data = {};
    });

    afterEach(function () {
      $api.index.data = indexData;
    });

    describe("#addPromiseForRequest()", function () {
      var request,
          promise;

      beforeEach(function () {
        activeRequestIndex = ActiveRequestIndex.create();
        request = 'foo/bar'.toHttpEndpoint().toRequest();
        promise = $utils.Deferred.create().promise;
      });

      it("should return self", function () {
        var result = activeRequestIndex.addPromiseForRequest(request, promise);
        expect(result).toBe(activeRequestIndex);
      });

      it("should store promise in container", function () {
        activeRequestIndex.addPromiseForRequest(request, promise);
        expect($api.index.data).toEqual({
          _request: {
            '[\"object\",[\"httpMethod\",null],[\"requestBody\",null],[\"requestHeaders\",null],[\"requestUrl\",\"foo/bar\"]]undefined': promise
          }
        });
      });
    });

    describe("#removePromiseForRequest()", function () {
      var request,
          promise;

      beforeEach(function () {
        activeRequestIndex = ActiveRequestIndex.create();
        request = 'foo/bar'.toHttpEndpoint().toRequest();
        promise = $utils.Deferred.create().promise;
        activeRequestIndex.addPromiseForRequest(request, promise);
      });

      it("should return self", function () {
        var result = activeRequestIndex.removePromiseForRequest(request);
        expect(result).toBe(activeRequestIndex);
      });

      it("should remove promise from container", function () {
        activeRequestIndex.removePromiseForRequest(request);
        expect($api.index.data).toEqual({
          _request: {}
        });
      });
    });

    describe("#getPromiseForRequest()", function () {
      var request,
          promise;

      beforeEach(function () {
        activeRequestIndex = ActiveRequestIndex.create();
        request = 'foo/bar'.toHttpEndpoint().toRequest();
        promise = $utils.Deferred.create().promise;
        activeRequestIndex.addPromiseForRequest(request, promise);
      });

      describe("when passing registered request", function () {
        it("should fetch corresponding promise", function () {
          var result = activeRequestIndex.getPromiseForRequest(request);
          expect(result).toBe(promise);
        });
      });

      describe("when passing unregistered request", function () {
        var request2;

        beforeEach(function () {
          request2 = 'baz/quux'.toHttpEndpoint().toRequest();
        });

        it("should return undefined", function () {
          var result = activeRequestIndex.getPromiseForRequest(request2);
          expect(result).toBeUndefined();
        });
      });
    });

    describe("#onRequestSend()", function () {
      var request,
          promise,
          event;

      beforeEach(function () {
        request = 'foo/bar'.toHttpEndpoint().toRequest();
        promise = $utils.Deferred.create().promise;
        event = request.spawnEvent({
          eventName: $api.EVENT_REQUEST_SEND,
          request: request,
          promise: promise
        });
      });

      it("should be invoked on EVENT_REQUEST_SEND", function () {
        spyOn($api.ActiveRequestIndex, 'onRequestSend');
        event.trigger();
        expect($api.ActiveRequestIndex.onRequestSend)
        .toHaveBeenCalledWith(event);
      });

      it("should invoke addPromiseForRequest", function () {
        spyOn($api.ActiveRequestIndex, 'addPromiseForRequest');
        event.trigger();
        expect($api.ActiveRequestIndex.addPromiseForRequest)
        .toHaveBeenCalledWith(request, promise);
      });
    });

    describe("#onResponseReceive()", function () {
      var request,
          event;

      beforeEach(function () {
        request = 'foo/bar'.toHttpEndpoint().toRequest();
        event = request.spawnEvent({
          eventName: $api.EVENT_RESPONSE_RECEIVE,
          request: request
        });
      });

      it("should be invoked on EVENT_RESPONSE_RECEIVE", function () {
        spyOn($api.ActiveRequestIndex, 'onResponseReceive');
        event.trigger();
        expect($api.ActiveRequestIndex.onResponseReceive)
        .toHaveBeenCalledWith(event);
      });

      it("should invoke removePromiseForRequest", function () {
        spyOn($api.ActiveRequestIndex, 'removePromiseForRequest');
        event.trigger();
        expect($api.ActiveRequestIndex.removePromiseForRequest)
        .toHaveBeenCalledWith(request);
      });
    });
  });
});
