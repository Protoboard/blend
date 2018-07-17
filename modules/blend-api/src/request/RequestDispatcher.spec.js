"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("RequestDispatcher", function () {
    var RequestDispatcher,
        requestDispatcher;

    beforeAll(function () {
      RequestDispatcher = $oop.createClass('test.$api.RequestDispatcher.RequestDispatcher')
      .blend($api.RequestDispatcher)
      .build();
      RequestDispatcher.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".fromRequest()", function () {
      var request;

      beforeEach(function () {
        request = 'foo/bar'.toHttpEndpoint().toRequest();
      });

      it("should return a RequestDispatcher instance", function () {
        requestDispatcher = RequestDispatcher.fromRequest(request);
        expect(RequestDispatcher.mixedBy(requestDispatcher)).toBeTruthy();
      });

      it("should set request property", function () {
        requestDispatcher = RequestDispatcher.fromRequest(request);
        expect(requestDispatcher.request).toBe(request);
      });

      it("should pass additional properties to create", function () {
        requestDispatcher = RequestDispatcher.fromRequest(request, {bar: 'baz'});
        expect(requestDispatcher.bar).toBe('baz');
      });
    });

    describe(".create()", function () {
      describe("on invalid request", function () {
        it("should throe", function () {
          expect(function () {
            RequestDispatcher.create();
          }).toThrow();
          expect(function () {
            RequestDispatcher.create({request: 1});
          }).toThrow();
        });
      });
    });

    describe("#dispatch()", function () {
      var indexData,
          request,
          promise,
          activeRequestIndex;

      beforeEach(function () {
        indexData = $api.index.data;
        $api.index.data = {};
        request = 'foo/bar'.toHttpEndpoint().toRequest();
        promise = $utils.Deferred.create().promise;
        requestDispatcher = RequestDispatcher.fromRequest(request);
        activeRequestIndex = $api.ActiveRequestIndex.create();
        activeRequestIndex.addPromiseForRequest(request, promise);
      });

      afterEach(function () {
        $api.index.data = indexData;
      });

      it("should return stored promise", function () {
        var result = requestDispatcher.dispatch();
        expect(result).toBe(promise);
      });
    });
  });

  describe("Request", function () {
    var request;

    describe("toRequestDispatcher", function () {
      beforeEach(function () {
        request = 'foo/bar'.toHttpEndpoint().toRequest();
      });

      it("should return RequestDispatcher instance", function () {
        var result = request.toRequestDispatcher();
        expect($api.RequestDispatcher.mixedBy(result)).toBeTruthy();
      });

      it("should set request property", function () {
        var result = request.toRequestDispatcher();
        expect(result.request).toBe(request);
      });

      it("should pass additional properties to create", function () {
        var result = request.toRequestDispatcher({bar: 'baz'});
        expect(result.bar).toBe('baz');
      });
    });
  });
});
