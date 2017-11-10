"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'];

describe("$utils", function () {
  describe("Path", function () {
    var Path,
        path,
        result;

    beforeAll(function () {
      Path = $oop.getClass('test.$utils.Path.Path')
      .blend($utils.Path);
    });

    beforeEach(function () {
      path = Path.create({components: ['foo', 'bar', 'baz']});
    });

    describe("create()", function () {
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

    describe("fromComponents()", function () {
      var path,
          components;

      beforeEach(function () {
        path = {};
        components = ['foo', 'bar', 'baz'];
        spyOn(Path, 'create').and.returnValue(path);
        result = Path.fromComponents(components);
      });

      it("should pass components to create()", function () {
        expect(Path.create).toHaveBeenCalledWith({components: components});
      });

      it("should return a created instance", function () {
        expect(result).toBe(path);
      });
    });

    describe("clone()", function () {
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

    describe("equals()", function () {
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

//describe("Array", function () {
//  var result;
//
//  describe("toPath()", function () {
//    var array = [1, 2, 3];
//
//    beforeEach(function () {
//      result = array.toPath();
//    });
//
//    it("should return a Path instance", function () {
//      expect($utils.Path.mixedBy(result)).toBeTruthy();
//    });
//
//    it("should set components property", function () {
//      expect(result.components).toBe(array);
//    });
//  });
//});
