"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("FunctionEndpoint", function () {
    var FunctionEndpoint,
        functionEndpoint;

    beforeAll(function () {
      FunctionEndpoint = $oop.getClass('test.$api.FunctionEndpoint.FunctionEndpoint')
      .blend($api.FunctionEndpoint);
      FunctionEndpoint.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      describe("on missing callback", function () {
        it("should throw", function () {
          expect(function () {
            FunctionEndpoint.create();
          }).toThrow();
        });
      });

      it("should initialize endpointId", function () {
        functionEndpoint = FunctionEndpoint.create({callback: function () {}});
        expect(functionEndpoint.endpointId)
        .toBe(String(functionEndpoint.instanceId));
      });
    });
  });
});

describe("Function", function () {
  describe("toFunctionEndpoint()", function () {
    var functionEndpoint,
        callback;

    beforeEach(function () {
      callback = function () {};
    });

    it("should return a FunctionEndpoint instance", function () {
      functionEndpoint = callback.toFunctionEndpoint();
      expect($api.FunctionEndpoint.mixedBy(functionEndpoint)).toBeTruthy();
    });

    it("should set callback property", function () {
      functionEndpoint = callback.toFunctionEndpoint();
      expect(functionEndpoint.callback).toBe(callback);
    });
  });
});
