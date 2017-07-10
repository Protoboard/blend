"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  var data;

  beforeEach(function () {
    data = {
      foo: {
        bar: [
          'baz',
          'quux'
        ]
      }
    };
  });

  describe("getNode()", function () {
    it("should retrieve node from object", function () {
      expect($oop.getNode(data, ['foo', 'bar'])).toBe(data.foo.bar);
    });

    describe("for absent path", function () {
      it("should return undefined", function () {
        expect($oop.getNode(data, ['foo', 'bar', 'baz'])).toBeUndefined();
      });
    });

    describe("for empty path", function () {
      it("should return data buffer", function () {
        expect($oop.getNode(data, [])).toBe(data);
      });
    });
  });

  describe("setNode()", function () {
    it("should set node in tree", function () {
      $oop.setNode(data, ['foo', 'bar', '1'], {});
      expect(data).toEqual({
        foo: {
          bar: [
            'baz',
            {}
          ]
        }
      });
    });

    describe("when setting undefined", function () {
      it("should create path", function () {
        $oop.setNode(data, ['bar', 'baz'], undefined);
        expect(data).toEqual({
          foo: {
            bar: [
              'baz',
              'quux'
            ]
          },
          bar: {
            baz: undefined
          }
        });
      });
    });
  });
});