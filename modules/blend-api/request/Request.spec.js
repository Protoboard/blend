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
          parameters;

      beforeEach(function () {
        endpoint = 'foo/bar'.toHttpEndpoint();
        parameters = {};
      });

      it("should return Request instance", function () {
        request = Request.fromEndpoint(endpoint);
        expect(Request.mixedBy(request)).toBeTruthy();
      });

      it("should set endpoint", function () {
        request = Request.fromEndpoint(endpoint);
        expect(request.endpoint).toBe(endpoint);
      });

      it("should set parameters", function () {
        request = Request.fromEndpoint(endpoint, parameters);
        expect(request.parameters).toBe(parameters);
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

      it("should initialize parameters", function () {
        request = Request.create({
          endpoint: 'foo/bar'.toHttpEndpoint()
        });
        expect(request.parameters).toEqual({});
      });

      it("should initialize listeningPath", function () {
        request = Request.create({
          endpoint: 'foo/bar'.toHttpEndpoint()
        });
        expect(request.listeningPath).toBe('endpoint.foo/bar.{}');
      });

      it("should initialize triggerPaths", function () {
        request = Request.create({
          endpoint: 'foo/bar'.toHttpEndpoint()
        });
        expect(request.triggerPaths.list).toContain(
            'endpoint.foo/bar.{}', 'endpoint.foo/bar', 'endpoint');
      });
    });

    describe("toString()", function () {
      it("should serialize Request", function () {
        request = Request.create({
          endpoint: 'foo/bar'.toHttpEndpoint(),
          parameters: {
            baz: "quux"
          }
        });
        expect(request.toString()).toBe('foo/bar{"baz":"quux"}');
      });
    });
  });

  describe("Endpoint", function () {
    var endpoint,
        parameters;

    beforeEach(function () {
      endpoint = 'foo/bar'.toHttpEndpoint();
      parameters = {};
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

      it("should set parameters", function () {
        request = endpoint.toRequest(parameters);
        expect(request.parameters).toBe(parameters);
      });
    });
  });
});
