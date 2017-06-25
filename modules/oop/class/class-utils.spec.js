"use strict";

var $oop = window['giant-oop'];

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

  describe("getClass()", function () {
    var Class,
        result;

    beforeEach(function () {
      Class = $oop.Class.getClass('Class');
      spyOn($oop.Class, 'getClass').and.returnValue(Class);
      result = $oop.getClass('Class');
    });

    it("should invoke Class.getClass", function () {
      expect($oop.Class.getClass).toHaveBeenCalledWith('Class');
      expect(result).toBe(Class);
    });
  });
});