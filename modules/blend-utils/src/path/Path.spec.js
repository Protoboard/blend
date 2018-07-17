"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'];

describe("$utils", function () {
  describe("Path", function () {
    var Path,
        path,
        result;

    beforeAll(function () {
      Path = $oop.createClass('test.$utils.Path.Path')
      .blend($utils.Path)
      .build();
    });

    beforeEach(function () {
      path = Path.create({components: ['foo', 'bar', 'baz']});
    });

    describe(".fromComponents()", function () {
      var components;

      beforeEach(function () {
        components = ['foo', 'bar', 'baz'];
      });

      it("should pass components to create()", function () {
        path = Path.fromComponents(components);
        expect(Path.mixedBy(path)).toBeTruthy();
      });

      it("should set components property", function () {
        path = Path.fromComponents(components);
        expect(path.components).toBe(components);
      });
    });

    describe(".create()", function () {
      it("should set components property", function () {
        expect(path.components).toEqual(['foo', 'bar', 'baz']);
      });

      describe("on invalid arguments", function () {
        it("should throw", function () {
          expect(function () {
            Path.create();
          }).toThrow();
          expect(function () {
            Path.create({components: 'foo'});
          }).toThrow();
        });
      });
    });

    describe("#clone()", function () {
      beforeEach(function () {
        result = path.clone();
      });

      it("should return Path instance", function () {
        expect(Path.mixedBy(result)).toBeTruthy();
      });

      it("should initialize components on clone", function () {
        expect(result.components).toEqual(path.components);
        expect(result.components).not.toBe(path.components);
      });
    });

    describe("#equals()", function () {
      var path2;

      describe("for equivalent Path", function () {
        it("should return true", function () {
          path2 = Path.create({components: ['foo', 'bar', 'baz']});
          expect(path.equals(path2)).toBeTruthy();
        });
      });

      describe("for non-equivalent Path", function () {
        it("should return false", function () {
          path2 = Path.create({components: ['baz', 'bar', 'foo']});
          expect(path.equals(path2)).toBeFalsy();
        });
      });

      describe("for undefined Path", function () {
        it("should return false", function () {
          expect(path.equals(undefined)).toBeFalsy();
        });
      });
    });
  });
});
