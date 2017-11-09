"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("ObjectEndpoint", function () {
    var ObjectEndpoint,
        objectEndpoint;

    beforeAll(function () {
      ObjectEndpoint = $oop.getClass('test.$api.ObjectEndpoint.ObjectEndpoint')
      .blend($api.ObjectEndpoint);
      ObjectEndpoint.__forwards = {list: [], sources: [], lookup: {}};
    });

    beforeEach(function () {
      ObjectEndpoint.__instanceLookup = {};
    });

    it("should be cached by endpointId", function () {
      ObjectEndpoint.create({endpointProperties: {foo: "bar"}});
      ObjectEndpoint.create({endpointProperties: {foo: "baz"}});

      expect(ObjectEndpoint.fromEndpointId('{"foo":"bar"}'))
      .toBe(ObjectEndpoint.fromEndpointId('{"foo":"bar"}'));
      expect(ObjectEndpoint.fromEndpointId('{"foo":"bar"}'))
      .not.toBe(ObjectEndpoint.fromEndpointId('{"foo":"baz"}'));
    });

    describe("fromEndpointProperties()", function () {
      var endpointProperties;

      beforeEach(function () {
        endpointProperties = {foo: "bar"};
      });

      it("should return ObjectEndpoint instance", function () {
        objectEndpoint = ObjectEndpoint.fromEndpointProperties(endpointProperties);
        expect(ObjectEndpoint.mixedBy(objectEndpoint)).toBeTruthy();
      });

      it("should initialize endpointProperties", function () {
        objectEndpoint = ObjectEndpoint.fromEndpointProperties(endpointProperties);
        expect(objectEndpoint.endpointProperties).toBe(endpointProperties);
      });
    });

    describe("create()", function () {
      var endpointProperties;

      beforeEach(function () {
        endpointProperties = {foo: 'bar'};
      });

      describe("on invalid endpointProperties", function () {
        it("should throw", function () {
          expect(function () {
            ObjectEndpoint.create();
          }).toThrow();
          expect(function () {
            ObjectEndpoint.create({endpointProperties: 'foo'});
          }).toThrow();
        });
      });

      it("should initialize endpointProperties", function () {
        objectEndpoint = ObjectEndpoint.create({
          endpointProperties: endpointProperties
        });
        expect(objectEndpoint.endpointProperties).toBe(endpointProperties);
      });

      it("should initialize endpointId", function () {
        objectEndpoint = ObjectEndpoint.create({
          endpointProperties: endpointProperties
        });
        expect(objectEndpoint.endpointId).toBe('{"foo":"bar"}');
      });
    });
  });
});

describe("String", function () {
  describe("toObjectEndpoint()", function () {
    var objectEndpoint;

    beforeEach(function () {
      $api.ObjectEndpoint.__instanceLookup = {};
      $api.ObjectEndpoint.create({endpointProperties: {foo: "bar"}});
    });

    it("should return a ObjectEndpoint instance", function () {
      objectEndpoint = '{"foo":"bar"}'.toObjectEndpoint();
      expect($api.ObjectEndpoint.mixedBy(objectEndpoint)).toBeTruthy();
    });

    it("should set endpointProperties property", function () {
      objectEndpoint = '{"foo":"bar"}'.toObjectEndpoint();
      expect(objectEndpoint.endpointProperties).toEqual({
        foo: 'bar'
      });
    });
  });
});
