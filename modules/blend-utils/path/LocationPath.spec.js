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

    describe("fromString()", function () {
      it("should return HttpEndpoint instance", function () {
        locationPath = LocationPath.fromString('foo/bar');
        expect(LocationPath.mixedBy(locationPath)).toBeTruthy();
      });

      it("should initialize components", function () {
        locationPath = LocationPath.fromString('foo/bar');
        expect(locationPath.components).toEqual(['foo', 'bar']);
      });
    });

    describe("toString()", function () {
      beforeEach(function () {
        locationPath = LocationPath.create({
          components: ['foo/', 'bar', 'baz']
        });
      });

      it("should escape URI component strings", function () {
        var result = locationPath.toString();
        expect(result).toBe('foo%2F/bar/baz');
      });
    });
  });
});

describe("String", function () {
  describe("toPath()", function () {
    var locationPath;

    it("should return a Path instance", function () {
      locationPath = 'foo/bar/baz/quux'.toLocationPath();
      expect($utils.LocationPath.mixedBy(locationPath)).toBeTruthy();
    });

    it("should set components property with unescaped components", function () {
      locationPath = 'foo/bar%2Fbaz/quux'.toLocationPath();
      expect(locationPath.components).toEqual(['foo', 'bar/baz', 'quux']);
    });
  });
});

describe("Array", function () {
  describe("toPath()", function () {
    var locationPath,
        array;

    beforeEach(function () {
      array = [1, 2, 3];
    });

    it("should return a Path instance", function () {
      locationPath = array.toLocationPath();
      expect($utils.LocationPath.mixedBy(locationPath)).toBeTruthy();
    });

    it("should set components property", function () {
      locationPath = array.toLocationPath();
      expect(locationPath.components).toBe(array);
    });
  });
});
