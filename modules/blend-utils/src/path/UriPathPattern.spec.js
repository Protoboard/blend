"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'];

describe("$utils", function () {
  describe("UriPathPattern", function () {
    var UriPathPattern,
        uriPathPattern;

    beforeAll(function () {
      UriPathPattern = $oop.createClass('test.$utils.UriPathPattern.UriPathPattern')
      .blend($utils.UriPathPattern)
      .build();
      UriPathPattern.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".fromString()", function () {
      it("should return UriPathPattern instance", function () {
        uriPathPattern = UriPathPattern.fromString('foo/bar');
        expect(UriPathPattern.mixedBy(uriPathPattern)).toBeTruthy();
      });

      it("should initialize components", function () {
        uriPathPattern = UriPathPattern.fromString(':foo/bar');
        expect(uriPathPattern.components).toEqual([
          $utils.PathPatternComponent.fromString(':foo'),
          $utils.PathPatternComponent.fromString('bar')
        ]);
      });

      it("should pass additional properties to create", function () {
        uriPathPattern = UriPathPattern.fromString('foo/bar', {bar: 'baz'});
        expect(uriPathPattern.bar).toBe('baz');
      });
    });

    describe("#toString()", function () {
      beforeEach(function () {
        uriPathPattern = UriPathPattern.fromComponents([
          'foo/', 'bar', ':baz'
        ]);
      });

      it("should escape URI component strings", function () {
        var result = uriPathPattern.toString();
        expect(result).toBe('foo\\//bar/:baz');
      });
    });
  });

  describe(".escapeUriPathDelimiter()", function () {
    it("should escape URI_PATH_DELIMITER", function () {
      expect($utils.escapeUriPathDelimiter('foo/bar')).toBe('foo\\/bar');
    });
  });

  describe(".unescapeUriPathDelimiter()", function () {
    it("should unescape URI_PATH_DELIMITER", function () {
      expect($utils.unescapeUriPathDelimiter('foo\\/bar')).toBe('foo/bar');
    });
  });
});
