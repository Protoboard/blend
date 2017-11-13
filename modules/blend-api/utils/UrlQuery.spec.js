"use strict";

var $oop = window['blend-oop'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("UrlQuery", function () {
    var UrlQuery,
        urlQuery;

    beforeAll(function () {
      UrlQuery = $oop.getClass('test.$api.UrlQuery.UrlQuery')
      .blend($api.UrlQuery);
      UrlQuery.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromString()", function () {
      it("should initialize data", function () {
        urlQuery = UrlQuery.fromString('foo=bar&foo=baz&hello=world');
        expect(urlQuery.data).toEqual({
          foo: ['bar', 'baz'],
          hello: ['world']
        });
      });

      it("should decode attributes & values", function () {
        urlQuery = UrlQuery.fromString('foo%3D=bar%26&baz=quux');
        expect(urlQuery.data).toEqual({
          "foo=": ['bar&'],
          baz: ['quux']
        });
      });

      it("should pass additional properties to create", function () {
        urlQuery = UrlQuery.fromString('foo%3D=bar%26&baz=quux', {bar: 'baz'});
        expect(urlQuery.bar).toBe('baz');
      });
    });

    describe("toString()", function () {
      it("should return query string", function () {
        urlQuery = UrlQuery.fromData({
          foo: ['bar', 'baz'],
          hello: ['world']
        });
        expect(urlQuery.toString()).toBe('foo=bar&foo=baz&hello=world');
      });

      it("should encode attributes & values", function () {
        urlQuery = UrlQuery.fromData({
          "foo=": ['bar&'],
          baz: ['quux']
        });
        expect(urlQuery.toString()).toBe('foo%3D=bar%26&baz=quux');
      });
    });
  });
});
