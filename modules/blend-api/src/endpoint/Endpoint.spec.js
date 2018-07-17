"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("Endpoint", function () {
    var Endpoint,
        endpoint;

    beforeAll(function () {
      Endpoint = $oop.createClass('test.$api.Endpoint.Endpoint')
      .blend($api.Endpoint)
      .build();
      Endpoint.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".fromEndpointId()", function () {
      it("should return Endpoint instance", function () {
        endpoint = Endpoint.fromEndpointId('foo');
        expect(Endpoint.mixedBy(endpoint)).toBeTruthy();
      });

      it("should initialize endpointId", function () {
        endpoint = Endpoint.fromEndpointId('foo');
        expect(endpoint.endpointId).toBe('foo');
      });

      it("should pass additional properties to create", function () {
        endpoint = Endpoint.fromEndpointId('foo', {bar: 'baz'});
        expect(endpoint.bar).toBe('baz');
      });
    });

    describe(".create()", function () {
      describe("on missing endpointId", function () {
        it("should throw", function () {
          expect(function () {
            Endpoint.create();
          }).toThrow();
        });
      });

      it("should initialize listeningPath", function () {
        endpoint = Endpoint.create({endpointId: 'foo'});
        expect(endpoint.listeningPath).toBe('endpoint.foo');
      });

      it("should initialize triggerPaths", function () {
        endpoint = Endpoint.create({endpointId: 'foo'});
        expect(endpoint.triggerPaths.list).toContain(
            'endpoint.foo',
            'endpoint');
      });
    });
  });
});
