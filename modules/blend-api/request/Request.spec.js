"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("Request", function () {
    var Request,
        request;

    beforeAll(function () {
      Request = $oop.getClass('test.$api.Request.Request')
      .blend($api.Request);
      Request.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromEndpoint()", function () {
      var endpoint;

      beforeEach(function () {
        endpoint = 'foo/bar'.toHttpEndpoint();
      });

      it("should return Request instance", function () {
        request = Request.fromEndpoint(endpoint);
        expect(Request.mixedBy(request)).toBeTruthy();
      });

      it("should set endpoint", function () {
        request = Request.fromEndpoint(endpoint);
        expect(request.endpoint).toBe(endpoint);
      });

      it("should set properties", function () {
        request = Request.fromEndpoint(endpoint, {
          foo: 'bar'
        });
        expect(request.foo).toEqual('bar');
      });
    });

    describe("create()", function () {
      describe("on invalid endpoint", function () {
        it("should throw", function () {
          expect(function () {
            Request.create();
          }).toThrow();
          expect(function () {
            Request.create({endpoint: 'foo'});
          }).toThrow();
        });
      });

      it("should initialize triggerPaths", function () {
        request = Request.create({
          endpoint: 'foo/bar'.toHttpEndpoint()
        });
        expect(request.triggerPaths.list).toContain(
            'endpoint.foo/bar', 'endpoint');
      });
    });

    describe("send()", function () {
      var promise;

      beforeEach(function () {
        request = 'foo/bar'.toHttpEndpoint().toRequest();
        promise = {};
        spyOn($api.RequestDispatcher, 'dispatch').and.returnValue(promise);
      });

      it("should invoke Dispatcher#dispatch", function () {
        request.send();
        expect($api.RequestDispatcher.dispatch).toHaveBeenCalled();
      });

      it("should forward promise from dispatch", function () {
        var result = request.send();
        expect(result).toBe(promise);
      });
    });
  });

  describe("Endpoint", function () {
    var endpoint;

    beforeEach(function () {
      endpoint = 'foo/bar'.toHttpEndpoint();
    });

    describe("toRequest()", function () {
      var request;

      it("should return Request instance", function () {
        request = endpoint.toRequest();
        expect($api.Request.mixedBy(request)).toBeTruthy();
      });

      it("should set endpoint", function () {
        request = endpoint.toRequest();
        expect(request.endpoint).toBe(endpoint);
      });

      it("should set properties", function () {
        request = endpoint.toRequest({
          foo: 'bar'
        });
        expect(request.foo).toBe('bar');
      });
    });
  });
});
