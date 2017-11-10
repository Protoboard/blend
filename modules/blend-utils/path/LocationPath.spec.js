"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'];

describe("$utils", function () {
  describe("LocationPath", function () {
    var LocationPath,
        locationPath;

    beforeAll(function () {
      LocationPath = $oop.getClass('test.$utils.LocationPath.LocationPath')
      .blend($utils.LocationPath);
      LocationPath.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromUrlPath()", function () {
      it("should return HttpEndpoint instance", function () {
        locationPath = LocationPath.fromUrlPath('foo/bar');
        expect(LocationPath.mixedBy(locationPath)).toBeTruthy();
      });

      it("should initialize components", function () {
        locationPath = LocationPath.fromUrlPath('foo/bar');
        expect(locationPath.components).toEqual(['foo', 'bar']);
      });
    });

    describe("toUrlPath()", function () {
      beforeEach(function () {
        locationPath = LocationPath.create({
          components: ['foo/', 'bar', 'baz']
        });
      });

      it("should escape URI component strings", function () {
        var result = locationPath.toUrlPath();
        expect(result).toBe('foo%2F/bar/baz');
      });
    });
  });
});
