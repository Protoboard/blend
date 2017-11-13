"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("XhrRequest", function () {
    var XhrRequest,
        xhrRequest;

    beforeAll(function () {
      XhrRequest = $oop.getClass('test.$api.XhrRequest.XhrRequest')
      .blend($api.XhrRequest);
      XhrRequest.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("toString()", function () {
      beforeEach(function () {
        xhrRequest = XhrRequest.create({
          endpoint: 'foo/bar'.toHttpEndpoint(),
          xhrProperties: {
            baz: 'quux'
          }
        });
      });

      it("should create instance", function () {
        var result = xhrRequest.toString();
        expect(result).toContain('["object",["baz","quux"]]');
      });
    });
  });

  describe("Request", function () {
    describe("create()", function () {
      describe("when passing HttpEndpoint in browser", function () {
        it("should return XhrRequest instance", function () {
          var request = 'foo/bar'.toHttpEndpoint().toRequest();
          expect($api.XhrRequest.mixedBy(request)).toBeTruthy();
        });
      });
    });
  });
});
