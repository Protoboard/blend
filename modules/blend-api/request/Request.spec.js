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
      var endpoint,
          parameterValues;

      beforeEach(function () {
        endpoint = 'foo/bar'.toHttpEndpoint();
        parameterValues = {};
      });

      it("should return Request instance", function () {
        request = Request.fromEndpoint(endpoint);
        expect(Request.mixedBy(request)).toBeTruthy();
      });

      it("should set endpoint", function () {
        request = Request.fromEndpoint(endpoint);
        expect(request.endpoint).toBe(endpoint);
      });

      it("should set parameterValues", function () {
        request = Request.fromEndpoint(endpoint, parameterValues);
        expect(request.parameterValues).toBe(parameterValues);
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

      it("should initialize parameterValues", function () {
        request = Request.create({
          endpoint: 'foo/bar'.toHttpEndpoint(),
          requestId: '1'
        });
        expect(request.parameterValues).toEqual({});
      });

      it("should initialize listeningPath", function () {
        request = Request.create({
          endpoint: 'foo/bar'.toHttpEndpoint()
        });
        expect(request.listeningPath).toBe('endpoint.foo/bar.{}');
      });

      it("should initialize triggerPaths", function () {
        request = Request.create({
          endpoint: 'foo/bar'.toHttpEndpoint(),
          requestId: '1'
        });
        expect(request.triggerPaths.list).toContain(
            'endpoint.foo/bar.{}', 'endpoint.foo/bar', 'endpoint');
      });
    });
  });

  describe("Endpoint", function () {
    var endpoint,
        parameterValues;

    beforeEach(function () {
      endpoint = 'foo/bar'.toHttpEndpoint();
      parameterValues = {};
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

      it("should set parameterValues", function () {
        request = endpoint.toRequest(parameterValues);
        expect(request.parameterValues).toBe(parameterValues);
      });
    });
  });
});
