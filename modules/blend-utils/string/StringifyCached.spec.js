"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'];

describe("$utils", function () {
  describe("StringifyCached", function () {
    var CachedStringifiable,
        cachedStringifiable,
        result;

    beforeAll(function () {
      CachedStringifiable = $oop.getClass('test.$utils.StringifyCached.StringifyCached')
      .implement($utils.Stringifiable)
      .blend($utils.StringifyCached)
      .define({
        toString: function () {
          return this.foo;
        }
      });
    });

    beforeEach(function () {
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
