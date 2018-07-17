"use strict";

var $data = window['blend-data'];

describe("$data", function () {
  describe(".isEmptyObject()", function () {
    describe("for empty object", function () {
      it("should return true", function () {
        expect($data.isEmptyObject({})).toBe(true);
      });
    });

    describe("for non-empty object", function () {
      it("should return false", function () {
        expect($data.isEmptyObject({foo: "bar"})).toBe(false);
      });
    });
  });

  describe(".isSingleKeyObject()", function () {
    describe("for empty object", function () {
      it("should return false", function () {
        expect($data.isSingleKeyObject({})).toBe(false);
      });
    });

    describe("for singular object", function () {
      it("should return true", function () {
        expect($data.isSingleKeyObject({foo: "bar"})).toBe(true);
      });
    });

    describe("for object with multiple properties", function () {
      it("should return false", function () {
        expect($data.isSingleKeyObject({foo: "bar", baz: "quux"})).toBe(false);
      });
    });
  });

  describe(".isMultiKeyObject()", function () {
    describe("for empty object", function () {
      it("should return false", function () {
        expect($data.isMultiKeyObject({})).toBe(false);
      });
    });

    describe("for singular object", function () {
      it("should return false", function () {
        expect($data.isMultiKeyObject({foo: "bar"})).toBe(false);
      });
    });

    describe("for object with multiple properties", function () {
      it("should return true", function () {
        expect($data.isMultiKeyObject({foo: "bar", baz: "quux"}))
        .toBe(true);
        expect($data.isMultiKeyObject({
          foo: "bar",
          baz: "quux",
          hello: "world"
        })).toBe(true);
      });
    });
  });

  describe(".shallowCopy()", function () {
    var original,
        copy;

    describe("for undefined", function () {
      it("should return undefined", function () {
        expect($data.shallowCopy(undefined)).toBeUndefined();
      });
    });

    describe("for primitive value", function () {
      it("should return argument", function () {
        expect($data.shallowCopy(1)).toBe(1);
        expect($data.shallowCopy("foo")).toBe("foo");
        expect($data.shallowCopy(null)).toBe(null);
      });
    });

    describe("for arrays", function () {
      beforeEach(function () {
        original = [{}, {}];
        copy = $data.shallowCopy(original);
      });

      it("should return different array", function () {
        expect(copy).not.toBe(original);
      });

      it("should return same content", function () {
        expect(copy).toEqual(original);
      });
    });

    describe("for objects", function () {
      beforeEach(function () {
        original = {foo: {}, bar: {}};
        copy = $data.shallowCopy(original);
      });

      it("should return different object", function () {
        expect(copy).not.toBe(original);
      });

      it("should return same content", function () {
        expect(copy).toEqual(original);
      });
    });
  });

  describe(".deepCopy()", function () {
    var original,
        copy;

    beforeEach(function () {
      original = {
        foo: ['bar', 'baz'],
        quux: {
          hello: {},
          world: {}
        }
      };

      copy = $data.deepCopy(original);
    });

    it("should return identical content", function () {
      expect(copy).toEqual(original);
    });

    it("should return copy of all nodes", function () {
      expect(copy).not.toBe(original);
      expect(copy.foo).not.toBe(original.foo);
      expect(copy.quux).not.toBe(original.quux);
      expect(copy.quux.hello).not.toBe(original.quux.hello);
      expect(copy.quux.world).not.toBe(original.quux.world);
    });

    describe("when depth is specified", function () {
      beforeEach(function () {
        copy = $data.deepCopy(original, 2);
      });

      it("should return identical content", function () {
        expect(copy).toEqual(original);
      });

      it("should not stop at depth", function () {
        expect(copy).not.toBe(original);
        expect(copy.foo).not.toBe(original.foo);
        expect(copy.quux).not.toBe(original.quux);
        expect(copy.quux.hello).toBe(original.quux.hello);
        expect(copy.quux.world).toBe(original.quux.world);
      });
    });
  });
});