"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("HttpEndpoint", function () {
    var HttpEndpoint,
        httpEndpoint;

    beforeAll(function () {
      HttpEndpoint = $oop.getClass('test.$api.HttpEndpoint.HttpEndpoint')
      .blend($api.HttpEndpoint);
      HttpEndpoint.__forwards = {list: [], sources: [], lookup: {}};
    });

    beforeEach(function () {
      HttpEndpoint.__instanceLookup = {};
    });

    it("should be cached by endpointId", function () {
      HttpEndpoint.fromComponents(['foo', 'bar']);
      HttpEndpoint.fromComponents(['foo', 'baz']);

      expect(HttpEndpoint.fromEndpointId('foo/bar'))
      .toBe(HttpEndpoint.fromEndpointId('foo/bar'));
      expect(HttpEndpoint.fromEndpointId('foo/bar'))
      .not.toBe(HttpEndpoint.fromEndpointId('foo/baz'));
    });

    it("should be cached by components", function () {
      expect(HttpEndpoint.fromComponents(['foo', 'bar']))
      .toBe(HttpEndpoint.fromComponents(['foo', 'bar']));
      expect(HttpEndpoint.fromComponents(['foo', 'bar']))
      .not.toBe(HttpEndpoint.fromComponents(['foo', 'baz']));
    });

    describe("fromUrlPath()", function () {
      it("should return HttpEndpoint instance", function () {
        httpEndpoint = HttpEndpoint.fromUrlPath('foo/bar');
        expect(HttpEndpoint.mixedBy(httpEndpoint)).toBeTruthy();
      });

      it("should initialize components", function () {
        httpEndpoint = HttpEndpoint.fromUrlPath('foo/bar');
        expect(httpEndpoint.components).toEqual(['foo', 'bar']);
      });
    });

    describe("create()", function () {
      it("should initialize endpointId", function () {
        httpEndpoint = HttpEndpoint.fromComponents(['foo', 'bar']);
        expect(httpEndpoint.endpointId).toBe('foo/bar');
      });
    });

    describe("toUrlPath()", function () {
      beforeEach(function () {
        httpEndpoint = HttpEndpoint.create({
          components: ['foo/', 'bar', 'baz']
        });
      });

      it("should escape URI component strings", function () {
        var result = httpEndpoint.toUrlPath();
        expect(result).toBe('foo%2F/bar/baz');
      });
    });
  });
});

describe("$data", function () {
  describe("Path", function () {
    describe("toHttpEndpoint()", function () {
      var path,
          httpEndpoint;

      beforeEach(function () {
        $api.HttpEndpoint.__instanceLookup = {};
        path = 'foo.bar.baz'.toPath();
      });

      it("should return a HttpEndpoint instance", function () {
        httpEndpoint = path.toHttpEndpoint();
        expect($api.HttpEndpoint.mixedBy(httpEndpoint)).toBeTruthy();
      });

      it("should set components", function () {
        httpEndpoint = path.toHttpEndpoint();
        expect(httpEndpoint.components).toBe(path.components);
      });
    });
  });
});

describe("String", function () {
  describe("toHttpEndpoint()", function () {
    var httpEndpoint;

    beforeEach(function () {
      $api.HttpEndpoint.__instanceLookup = {};
    });

    it("should return a HttpEndpoint instance", function () {
      httpEndpoint = 'foo/bar/baz'.toHttpEndpoint();
      expect($api.HttpEndpoint.mixedBy(httpEndpoint)).toBeTruthy();
    });

    it("should set components property", function () {
      httpEndpoint = 'foo/bar/baz'.toHttpEndpoint();
      expect(httpEndpoint.components).toEqual([
        'foo', 'bar', 'baz'
      ]);
    });
  });
});

describe("Array", function () {
  describe("toHttpEndpoint()", function () {
    var httpEndpoint,
        array = ['1', '2', '3'];

    beforeEach(function () {
      $api.HttpEndpoint.__instanceLookup = {};
    });

    it("should return a HttpEndpoint instance", function () {
      httpEndpoint = array.toHttpEndpoint();
      expect($api.HttpEndpoint.mixedBy(httpEndpoint)).toBeTruthy();
    });

    it("should set components property", function () {
      httpEndpoint = array.toHttpEndpoint();
      expect(httpEndpoint.components).toBe(array);
    });
  });
});
