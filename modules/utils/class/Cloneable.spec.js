"use strict";

var $oop = window['giant-oop'],
    $utils = window['giant-utils'];

describe("$utils", function () {
  describe("Cloneable", function () {
    var Cloneable,
        cloneable;

    beforeEach(function () {
      Cloneable = $oop.getClass('test.$utils.Cloneable.Cloneable')
      .mixOnly($utils.Cloneable)
      .define({
        clone: function clone() {
          return clone.returned;
        }
      });
      cloneable = Cloneable.create('foo');
    });

    describe("create()", function () {
      it("should set _ctrArguments property", function () {
        var args = Array.prototype.slice.call(cloneable._ctrArguments);
        expect(args).toEqual(['foo']);
      });
    });

    describe("clone()", function () {
      var clone;

      beforeEach(function () {
        spyOn(Cloneable, 'create').and.callThrough();
        clone = cloneable.clone();
      });

      it("should return new instance", function () {
        expect(Cloneable.isPrototypeOf(clone)).toBeTruthy();
      });

      it("should pass ctr arguments to create()", function () {
        expect(Cloneable.create).toHaveBeenCalledWith('foo');
      });
    });
  });
});