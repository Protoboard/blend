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

    describe("getMethod()", function () {
      beforeEach(function () {
        httpRequest = HttpRequest.create({
          endpoint: 'foo/bar'.toHttpEndpoint(),
          parameters: {
            "method:": "GET",
            "header:foo": "bar",
            "baz": "quux"
          }
        });
      });

      it("should return method parameter", function () {
        expect(httpRequest.getMethod()).toBe("GET");
      });
    });

    describe("getHeaderObject()", function () {
      beforeEach(function () {
        httpRequest = HttpRequest.create({
          endpoint: 'foo/bar'.toHttpEndpoint(),
          parameters: {
            "method:": "GET",
            "header:foo": "bar",
            "baz": "quux"
          }
        });
      });

      it("should return header parameters", function () {
        var result = httpRequest.getHeaderObject();
        expect(result).toEqual({
          foo: "bar"
        });
      });
    });

    describe("getUrlPathQuery()", function () {
      beforeEach(function () {
        httpRequest = HttpRequest.create({
          endpoint: ':foo/bar'.toHttpEndpoint(),
          parameters: {
            "method:": "GET",
            "header:foo": "bar",
            "endpoint:foo": "FOO",
            "query:bar": ["baz", "quux"]
          }
        });
      });

      it("should return URL with endpoint & query string", function () {
        var result = httpRequest.getUrlPathQuery();
        expect(result).toBe("FOO/bar?bar=baz&bar=quux");
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
