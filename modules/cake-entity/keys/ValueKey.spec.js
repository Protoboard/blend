"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'],
    $entity = window['cake-entity'];

describe("$assert", function () {
  var ValueKey,
      valueKey;

  beforeEach(function () {
    ValueKey = $oop.getClass('test.$entity.ValueKey.ValueKey')
    .mix($entity.EntityKey)
    .mix($entity.ValueKey);
    valueKey = ValueKey.create();
    spyOn($assert, 'assert').and.callThrough();
  });

  describe("isValueKey()", function () {
    it("should pass message to assert", function () {
      $assert.isValueKey(valueKey, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-ValueKey", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isValueKey({});
        }).toThrow();
      });
    });
  });

  describe("isValueKeyOptional()", function () {
    it("should pass message to assert", function () {
      $assert.isValueKeyOptional(valueKey, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-chain", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isValueKeyOptional({});
        }).toThrow();
      });
    });
  });
});
