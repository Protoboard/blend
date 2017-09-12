"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-entity'];

describe("$utils", function () {
  describe("CachedStringifiable", function () {
    var MetaKey,
        metaKey,
        result;

    beforeEach(function () {
      MetaKey = $oop.getClass('test.$utils.CachedStringifiable.CachedStringifiable')
      .implement($utils.Stringifiable)
      .mix($utils.CachedStringifiable)
      .define({
        toString: function () {
          return this.foo;
        }
      });
      metaKey = MetaKey.create({foo: "foo"});
    });

    describe("create()", function () {
      beforeEach(function () {
        result = MetaKey.create({foo: "bar"});
      });

      it("should return new instance", function () {
        expect(result).not.toBe(metaKey);
      });

      describe("when passing same arguments", function () {
        beforeEach(function () {
          result = MetaKey.create({foo: "foo"});
        });

        it("should return cached instance", function () {
          expect(result).toBe(metaKey);
        });
      });
    });
  });
});
