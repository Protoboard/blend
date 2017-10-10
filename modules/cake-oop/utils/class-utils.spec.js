"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  describe("copyProperties()", function () {
    var target, members;

    beforeEach(function () {
      target = {};
      members = {
        foo: "FOO",
        bar: function () {}
      };
      $oop.copyProperties(target, members);
    });

    it("should copy members", function () {
      expect(target.foo).toBe("FOO");
      expect(target.bar).toBe(members.bar);
    });

    describe("when adding to built-in prototype", function () {
      beforeEach(function () {
        members = {
          toFoo: function () {},
          toBar: function () {}
        };
        $oop.copyProperties(String.prototype, members);
      });

      afterEach(function () {
        delete String.prototype.toFoo;
        delete String.prototype.toBar;
      });

      describe("non-conversion methods", function () {
        it("should throw", function () {
          expect(function () {
            $oop.copyProperties(String.prototype, {
              foo: "FOO"
            });
          }).toThrow();
        });
      });

      it("should copy members", function () {
        expect(String.prototype.toFoo).toBe(members.toFoo);
        expect(String.prototype.toBar).toBe(members.toBar);
      });

      it("should make members non-enumerable", function () {
        expect(Object.getOwnPropertyDescriptor(String.prototype, 'toFoo').enumerable)
        .toBeFalsy();
        expect(Object.getOwnPropertyDescriptor(String.prototype, 'toBar').enumerable)
        .toBeFalsy();
      });
    });

    describe("when specifying common property descriptor", function () {
      beforeEach(function () {
        target = {};
        members = {
          foo: "FOO",
          bar: function () {}
        };
        $oop.copyProperties(target, members, {});
      });

      it("should apply descriptor to properties", function () {
        expect(Object.getOwnPropertyDescriptor(target, 'foo')).toEqual({
          value: "FOO",
          writable: false,
          enumerable: false,
          configurable: false
        });
        expect(Object.getOwnPropertyDescriptor(target, 'bar')).toEqual({
          value: members.bar,
          writable: false,
          enumerable: false,
          configurable: false
        });
      });
    });
  });

  describe("createObject()", function () {
    var base, members, propertyDescriptor,
        result;

    beforeEach(function () {
      base = {};
      members = {
        foo: "FOO",
        bar: function () {}
      };
      propertyDescriptor = {};
      spyOn($oop, 'copyProperties').and.callThrough();
      result = $oop.createObject(base, members, propertyDescriptor);
    });

    it("should extend base", function () {
      expect(base.isPrototypeOf(result)).toBeTruthy();
    });

    it("should copy members", function () {
      expect($oop.copyProperties).toHaveBeenCalledWith(
          result,
          members,
          propertyDescriptor);
    });
  });

  describe("getClassId()", function () {
    var Class;

    beforeEach(function () {
      Class = $oop.getClass('test.$oop.class-utils.Class');
    });

    it("should retrieve class ID from Class", function () {
      expect($oop.getClassId(Class)).toBe('test.$oop.class-utils.Class');
    });

    describe("for falsy input", function () {
      it("should return falsy", function () {
        expect($oop.getClassId(undefined)).toBeFalsy();
        expect($oop.getClassId(null)).toBeFalsy();
        expect($oop.getClassId('')).toBeFalsy();
      });
    });
  });
});