"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("HttpEndpoint", function () {
    var HttpEndpoint,
        httpEndpoint;

    beforeAll(function () {
      HttpEndpoint = $oop.createClass('test.$api.HttpEndpoint.HttpEndpoint')
      .blend($api.HttpEndpoint)
      .build();
      HttpEndpoint.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      HttpEndpoint.__builder.instances = {};
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

    describe("create()", function () {
      it("should initialize endpointId", function () {
        httpEndpoint = HttpEndpoint.fromComponents(['foo', 'bar']);
        expect(httpEndpoint.endpointId).toBe('foo/bar');
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
        $api.HttpEndpoint.__builder.instances = {};
        path = 'foo.bar.baz'.toTreePath();
      });

      it("should return a HttpEndpoint instance", function () {
        httpEndpoint = path.toHttpEndpoint();
        expect($api.HttpEndpoint.mixedBy(httpEndpoint)).toBeTruthy();
      });

      it("should set components", function () {
        httpEndpoint = path.toHttpEndpoint();
        expect(httpEndpoint.components).toBe(path.components);
      });

      it("should pass additional properties to create", function () {
        httpEndpoint = path.toHttpEndpoint({bar: 'baz'});
        expect(httpEndpoint.bar).toBe('baz');
      });
    });
  });
});

describe("String", function () {
  describe("toHttpEndpoint()", function () {
    var httpEndpoint;

    beforeEach(function () {
      $api.HttpEndpoint.__builder.instances = {};
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

    it("should pass additional properties to create", function () {
      httpEndpoint = 'foo/bar/baz'.toHttpEndpoint({bar: 'baz'});
      expect(httpEndpoint.bar).toBe('baz');
    });
  });
});

describe("Array", function () {
  describe("toHttpEndpoint()", function () {
    var httpEndpoint,
        array = ['1', '2', '3'];

    beforeEach(function () {
      $api.HttpEndpoint.__builder.instances = {};
    });

    it("should return a HttpEndpoint instance", function () {
      httpEndpoint = array.toHttpEndpoint();
      expect($api.HttpEndpoint.mixedBy(httpEndpoint)).toBeTruthy();
    });

    it("should set components property", function () {
      httpEndpoint = array.toHttpEndpoint();
      expect(httpEndpoint.components).toBe(array);
    });

    it("should pass additional properties to create", function () {
      httpEndpoint = array.toHttpEndpoint({bar: 'baz'});
      expect(httpEndpoint.bar).toBe('baz');
    });
  });
});
