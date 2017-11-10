"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("ObjectRequest", function () {
    var ObjectRequest,
        objectRequest;

    beforeAll(function () {
      ObjectRequest = $oop.getClass('test.$api.ObjectRequest.ObjectRequest')
      .blend($api.ObjectRequest);
      ObjectRequest.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("getRequestObject()", function () {
      var endpoint;

      beforeEach(function () {
        endpoint = $api.ObjectEndpoint.fromEndpointProperties({
          foo: 'bar'
        });
      });

      it("should mix request parameters to endpoint parameters", function () {
        objectRequest = ObjectRequest.fromEndpoint(endpoint, {
          baz: 'quux'
        });
        var result = objectRequest.getRequestObject();
        expect(result).not.toBe(endpoint.endpointProperties);
        expect(result).not.toBe(objectRequest.parameters);
        expect(result).toEqual({
          foo: 'bar',
          baz: 'quux'
        });
      });

      it("should override endpoint properties with request params", function () {
        objectRequest = ObjectRequest.fromEndpoint(endpoint, {
          foo: 'baz'
        });
        var result = objectRequest.getRequestObject();
        expect(result).toEqual({
          foo: 'baz'
        });
      });
    });
  });

  describe("Request", function () {
    var request;

    describe("create()", function () {
      describe("when endpoint is ObjectEndpoint", function () {
        var endpoint;

        beforeEach(function () {
          endpoint = $api.ObjectEndpoint.fromEndpointProperties({});
        });

        it("should return ObjectRequest instance", function () {
          request = $api.Request.fromEndpoint(endpoint);
          expect($api.ObjectRequest.mixedBy(request)).toBeTruthy();
        });

        it("should set endpoint property", function () {
          request = $api.Request.fromEndpoint(endpoint);
          expect(request.endpoint).toBe(endpoint);
        });
      });
    });
  });
});
