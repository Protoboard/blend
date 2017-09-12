"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-utils'];

describe("$utils", function () {
  describe("CachedStringifiable", function () {
    var CachedStringifiable,
        cachedStringifiable,
        result;

    beforeEach(function () {
      CachedStringifiable = $oop.getClass('test.$utils.CachedStringifiable.CachedStringifiable')
      .implement($utils.Stringifiable)
      .mix($utils.CachedStringifiable)
      .define({
        toString: function () {
          return this.foo;
        }
      });
      cachedStringifiable = CachedStringifiable.create({foo: "foo"});
    });

    describe("create()", function () {
      beforeEach(function () {
        result = CachedStringifiable.create({foo: "bar"});
      });

      it("should return new instance", function () {
        expect(result).not.toBe(cachedStringifiable);
      });

      describe("when passing same arguments", function () {
        beforeEach(function () {
          result = CachedStringifiable.create({foo: "foo"});
        });

        it("should return cached instance", function () {
          expect(result).toBe(cachedStringifiable);
        });
      });
    });
  });
});
