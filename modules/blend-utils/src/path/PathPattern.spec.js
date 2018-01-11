"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'];

describe("$utils", function () {
  describe("PathPattern", function () {
    var PathPattern,
        pathPattern;

    beforeAll(function () {
      PathPattern = $oop.createClass('test.$utils.PathPattern.PathPattern')
      .blend($utils.PathPattern)
      .build();
      PathPattern.__builder.forwards = {list: [], lookup: {}};
    });

    describe("fromComponents()", function () {
      var components;

      beforeEach(function () {
        components = ['foo', 'bar', 'baz'];
      });

      it("should return PathPattern instance", function () {
        pathPattern = PathPattern.fromComponents(components);
        expect(PathPattern.mixedBy(pathPattern)).toBeTruthy();
      });

      it("should set components property", function () {
        pathPattern = PathPattern.fromComponents(components);
        expect(pathPattern.components).toEqual([
          $utils.PathPatternComponent.fromString('foo'),
          $utils.PathPatternComponent.fromString('bar'),
          $utils.PathPatternComponent.fromString('baz')
        ]);
      });

      it("should pass additional properties to create", function () {
        pathPattern = PathPattern.fromComponents(components, {bar: 'baz'});
        expect(pathPattern.bar).toBe('baz');
      });
    });

    describe("create()", function () {
      beforeEach(function () {
        pathPattern = PathPattern.create({
          components: [
            'foo',
            'bar',
            $utils.PathPatternComponent.fromString(':baz')
          ]
        });
      });

      it("should initialize components property", function () {
        expect(pathPattern.components).toEqual([
          $utils.PathPatternComponent.fromString('foo'),
          $utils.PathPatternComponent.fromString('bar'),
          $utils.PathPatternComponent.fromString(':baz')
        ]);
      });

      it("should initialize _paramPositions property", function () {
        expect(pathPattern._paramPositions).toEqual({
          baz: 2
        });
      });
    });

    describe("matches()", function () {
      beforeEach(function () {
        pathPattern = PathPattern.fromComponents(['foo', ':bar', 'baz']);
      });

      describe("for matching Path", function () {
        it("should return true", function () {
          expect(pathPattern.matches($utils.Path.fromComponents([
            'foo', 'ABC', 'baz']))).toBeTruthy();
          expect(pathPattern.matches($utils.Path.fromComponents([
            'foo', 'ABC', 'baz', 'DEF']))).toBeTruthy();
        });
      });

      describe("for non-matching Path", function () {
        it("should return false", function () {
          expect(pathPattern.matches($utils.Path.fromComponents([
            'foo', 'ABC']))).toBeFalsy();
          expect(pathPattern.matches($utils.Path.fromComponents([
            'baz', 'bar', 'foo']))).toBeFalsy();
        });
      });
    });

    describe("extractParameter()", function () {
      beforeEach(function () {
        pathPattern = PathPattern.fromComponents(['foo', ':bar', 'baz']);
      });

      it("should return value of specified parameter", function () {
        var path = $utils.Path.fromComponents(['foo', 'ABC', 'baz']),
            result = pathPattern.extractParameter(path, 'bar');
        expect(result).toBe('ABC');
      });

      describe("on absent parameter", function () {
        it("should return undefined", function () {
          var path = $utils.Path.fromComponents(['foo', 'ABC', 'baz']),
              result = pathPattern.extractParameter(path, 'foo');
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
