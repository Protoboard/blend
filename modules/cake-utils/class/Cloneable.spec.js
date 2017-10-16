"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-utils'];

describe("$utils", function () {
  describe("Cloneable", function () {
    var Cloneable,
        cloneable;

    beforeAll(function () {
      Cloneable = $oop.getClass('test.$utils.Cloneable.Cloneable')
      .mixOnly($utils.Cloneable)
      .define({
        clone: function clone() {
          return clone.returned;
        }
      });
    });

    beforeEach(function () {
      cloneable = Cloneable.create({foo: 'foo'});
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

      it("should pass original instance to create()", function () {
        expect(Cloneable.create).toHaveBeenCalledWith(cloneable);
      });
    });
  });
});