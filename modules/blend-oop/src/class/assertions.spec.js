"use strict";

var $oop = window['blend-oop'];

describe("$assert", function () {
  beforeEach(function () {
    spyOn($assert, 'assert').and.callThrough();
  });

  describe("hasOnlyConverters()", function () {
    it("should pass message to assert", function () {
      $assert.hasOnlyConverters({}, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing only converters", function () {
      it("should not throw", function () {
        expect(function () {
          $assert.hasOnlyConverters({
            toFoo: function () {
            },
            asBar: function () {
            }
          });
        }).not.toThrow();
      });
    });

    describe("when passing non-converters", function () {
      it("should throw", function () {
        // not function
        expect(function () {
          $assert.hasOnlyConverters({
            toFoo: "FOO"
          });
        }).toThrow();
        // not conversion
        expect(function () {
          $assert.hasOnlyConverters({
            foo: function () {
            }
          });
        }).toThrow();
      });
    });
  });
});