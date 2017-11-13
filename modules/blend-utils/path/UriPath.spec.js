"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'];

describe("$utils", function () {
  describe("UriPath", function () {
    var UriPath,
        uriPath;

    beforeAll(function () {
      UriPath = $oop.getClass('test.$utils.UriPath.UriPath')
      .blend($utils.UriPath);
      UriPath.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromString()", function () {
      it("should return HttpEndpoint instance", function () {
        uriPath = UriPath.fromString('foo/bar');
        expect(UriPath.mixedBy(uriPath)).toBeTruthy();
      });

      it("should initialize components", function () {
        uriPath = UriPath.fromString('foo/bar');
        expect(uriPath.components).toEqual(['foo', 'bar']);
      });

      it("should pass additional properties to create", function () {
        uriPath = UriPath.fromString('foo/bar', {bar: 'baz'});
        expect(uriPath.bar).toBe('baz');
      });
    });

    describe("toString()", function () {
      beforeEach(function () {
        uriPath = UriPath.create({
          components: ['foo/', 'bar', 'baz']
        });
      });

      it("should escape URI component strings", function () {
        var result = uriPath.toString();
        expect(result).toBe('foo%2F/bar/baz');
      });
    });
  });
});

describe("String", function () {
  describe("toPath()", function () {
    var uriPath;

    it("should return a Path instance", function () {
      uriPath = 'foo/bar/baz/quux'.toUriPath();
      expect($utils.UriPath.mixedBy(uriPath)).toBeTruthy();
    });

    it("should set components property with unescaped components", function () {
      uriPath = 'foo/bar%2Fbaz/quux'.toUriPath();
      expect(uriPath.components).toEqual(['foo', 'bar/baz', 'quux']);
    });
  });
});

describe("Array", function () {
  describe("toPath()", function () {
    var uriPath,
        array;

    beforeEach(function () {
      array = [1, 2, 3];
    });

    it("should return a Path instance", function () {
      uriPath = array.toUriPath();
      expect($utils.UriPath.mixedBy(uriPath)).toBeTruthy();
    });

    it("should set components property", function () {
      uriPath = array.toUriPath();
      expect(uriPath.components).toBe(array);
    });
  });
});
