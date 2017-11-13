"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("HttpRequest", function () {
    var HttpRequest,
        httpRequest;

    beforeAll(function () {
      HttpRequest = $oop.getClass('test.$api.HttpRequest.HttpRequest')
      .blend($api.HttpRequest);
      HttpRequest.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize requestUrl", function () {
        httpRequest = HttpRequest.create({
          endpoint: ':foo/bar'.toHttpEndpoint(),
          httpMethod: "GET",
          requestHeaders: {foo: "bar"},
          endpointParams: {foo: "FOO"},
          queryParams: {bar: ["baz", "quux"]}
        });
        expect(httpRequest.requestUrl).toBe("FOO/bar?bar=baz&bar=quux");
      });

      describe("when there are no query params", function () {
        it("should exclude query string", function () {
          httpRequest = HttpRequest.create({
            endpoint: ':foo/bar'.toHttpEndpoint(),
            httpMethod: "GET",
            requestHeaders: {foo: "bar"},
            endpointParams: {foo: "FOO"}
          });
          expect(httpRequest.requestUrl).toBe("FOO/bar");
        });
      });

      it("should initialize listeningPath", function () {
        httpRequest = HttpRequest.create({
          endpoint: ':foo/bar'.toHttpEndpoint(),
          httpMethod: "GET",
          requestHeaders: {foo: "bar"},
          endpointParams: {foo: "FOO"}
        });
        expect(httpRequest.listeningPath)
        .toBe('endpoint.' +
            '%3Afoo/bar.' +
            '["object",["httpMethod","GET"],' +
            '["requestBody",null],' +
            '["requestHeaders",["object",["foo","bar"]]],["requestUrl","FOO/bar"]]');
      });

      it("should initialize triggerPaths", function () {
        httpRequest = HttpRequest.create({
          endpoint: ':foo/bar'.toHttpEndpoint(),
          httpMethod: "GET",
          requestHeaders: {foo: "bar"},
          endpointParams: {foo: "FOO"}
        });
        expect(httpRequest.triggerPaths.list)
        .toContain('endpoint.' +
            '%3Afoo/bar.' +
            '["object",["httpMethod","GET"],' +
            '["requestBody",null],' +
            '["requestHeaders",["object",["foo","bar"]]],["requestUrl","FOO/bar"]]');
      });
    });

    describe("toString()", function () {
      it("should return stringified properties", function () {
        httpRequest = HttpRequest.create({
          endpoint: ':foo/bar'.toHttpEndpoint(),
          httpMethod: "GET",
          requestHeaders: {foo: "bar"},
          endpointParams: {foo: "FOO"},
          queryParams: {bar: ["baz", "quux"]},
          requestBody: {hello: "world"}
        });
        expect(httpRequest.toString())
        .toBe('["object",["httpMethod","GET"],' +
            '["requestBody",["object",["hello","world"]]],' +
            '["requestHeaders",["object",["foo","bar"]]],' +
            '["requestUrl","FOO/bar?bar=baz&bar=quux"]]');
      });
    });
  });

  describe("Request", function () {
    var request;

    describe("create()", function () {
      describe("when passing HttpEndpoint as endpoint", function () {
        var endpoint;

        beforeEach(function () {
          endpoint = 'foo/bar'.toHttpEndpoint();
        });

        it("should return HttpRequest instance", function () {
          request = $api.Request.fromEndpoint(endpoint);
          expect($api.HttpRequest.mixedBy(request)).toBeTruthy();
        });

        it("should set endpoint property", function () {
          request = $api.Request.fromEndpoint(endpoint);
          expect(request.endpoint).toBe(endpoint);
        });
      });
    });
  });
});
