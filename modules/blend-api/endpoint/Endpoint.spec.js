"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("Endpoint", function () {
    var Endpoint,
        endpoint;

    beforeAll(function () {
      Endpoint = $oop.getClass('test.$api.Endpoint.Endpoint')
      .blend($api.Endpoint);
      Endpoint.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromEndpointId()", function () {
      it("should return Endpoint instance", function () {

      });
    });

    describe("create()", function () {
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
