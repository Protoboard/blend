"use strict";

var $utils = window['blend-utils'];

describe("$utils", function () {
  describe(".stringify()", function () {
    describe("of string literal", function () {
      it("should return string literal", function () {
        expect($utils.stringify('foo')).toBe('foo');
      });
    });

    describe("of null", function () {
      it("should return empty string", function () {
        expect($utils.stringify(null)).toBe('');
      });
    });

    describe("of undefined", function () {
      it("should return empty string", function () {
        expect($utils.stringify()).toBe('');
      });
    });

    describe("of integer", function () {
      it("should return string with number", function () {
        expect($utils.stringify(4)).toBe('4');
      });
    });

    describe("of float", function () {
      it("should return string with number", function () {
        expect($utils.stringify(4.667)).toBe('4.667');
      });
    });

    describe("of boolean", function () {
      it("should return string with boolean", function () {
        expect($utils.stringify(true)).toBe('true');
      });
    });

    describe("of object", function () {
      var object = {};

      beforeEach(function () {
        spyOn(object, 'toString').and.returnValue("FOO");
      });

      it("should invoke toString on object", function () {
        expect($utils.stringify(object)).toBe("FOO");
        expect(object.toString).toHaveBeenCalled();
      });
    });
  });

  describe(".escape()", function () {
    it("should escape separator", function () {
      expect($utils.escape('foo.bar', '.'))
      .toEqual('foo\\.bar');
    });
    it("should escape escape-character", function () {
      expect($utils.escape('foo\\bar', '.'))
      .toEqual('foo\\\\bar');
    });
  });

  describe(".unescape()", function () {
    it("should un-escape escaped separator", function () {
      expect($utils.unescape('foo\\.bar', '.'))
      .toEqual('foo.bar');
    });
    it("should un-escape escaped escape character", function () {
      expect($utils.unescape('foo\\\\bar', '.'))
      .toEqual('foo\\bar');
    });
  });

  describe(".safeSplit()", function () {
    it("should split path along separators", function () {
      expect($utils.safeSplit('foo.bar.baz', '.'))
      .toEqual(['foo', 'bar', 'baz']);
    });
    it("should handle leading separator", function () {
      expect($utils.safeSplit('.foo.bar.baz', '.'))
      .toEqual(['', 'foo', 'bar', 'baz']);
    });
    it("should handle trailing separator", function () {
      expect($utils.safeSplit('foo.bar.baz.', '.'))
      .toEqual(['foo', 'bar', 'baz', '']);
    });
    it("should leave escaped separators intact", function () {
      expect($utils.safeSplit('foo\\.bar.baz\\.quux', '.'))
      .toEqual(['foo\\.bar', 'baz\\.quux']);
    });
  });

  describe(".jsonToSafeJson()", function () {
    it("return nested array", function () {
      var result = $utils.jsonToSafeJson({
        foo: {
          bar: "baz"
        }
      });
      expect(result).toEqual([
        'object',
        ['foo',
          ['object',
            ['bar', 'baz']
          ]
        ]
      ]);
    });

    it("should store properties in alphabetical order", function () {
      var result = $utils.jsonToSafeJson({
        foo: 'bar',
        baz: 'quux'
      });
      expect(result).toEqual([
        'object',
        ['baz', 'quux'],
        ['foo', 'bar']
      ]);
    });

    it("should distinguish arrays and objects", function () {
      var result = $utils.jsonToSafeJson([{
        foo: 'bar'
      }, {
        baz: 'quux'
      }]);
      expect(result).toEqual([
        'array',
        [
          'object',
          ['foo', 'bar']
        ],
        [
          'object',
          ['baz', 'quux']
        ]
      ]);
    });

    describe("when passing primitive", function () {
      it("should return input", function () {
        expect($utils.jsonToSafeJson(1)).toBe(1);
        expect($utils.jsonToSafeJson("foo")).toBe("foo");
        expect($utils.jsonToSafeJson(true)).toBe(true);
        expect($utils.jsonToSafeJson(null)).toBe(null);
      });
    });
  });

  describe(".safeJsonToJson()", function () {
    it("should restore original JSON", function () {
      var result = $utils.safeJsonToJson([
        'array',
        [
          'object',
          ['foo', 'bar']
        ],
        [
          'object',
          ['baz', 'quux']
        ]
      ]);
      expect(result).toEqual([{
        foo: 'bar'
      }, {
        baz: 'quux'
      }]);
    });

    describe("when passing primitive", function () {
      it("should return input", function () {
        expect($utils.safeJsonToJson(1)).toBe(1);
        expect($utils.safeJsonToJson("foo")).toBe("foo");
        expect($utils.safeJsonToJson(true)).toBe(true);
        expect($utils.safeJsonToJson(null)).toBe(null);
      });
    });
  });

  describe(".matchesPrefix()", function () {
    describe("on matching string", function () {
      it("should return truthy", function () {
        expect($utils.matchesPrefix('Hello World', 'He')).toBeTruthy();
      });
    });
    describe("on non-matching string", function () {
      it("should return falsy", function () {
        expect($utils.matchesPrefix('Hello World', 'hel')).toBeFalsy();
      });
    });
  });
});