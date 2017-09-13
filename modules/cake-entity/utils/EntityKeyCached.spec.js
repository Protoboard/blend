"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("EntityKeyCached", function () {
    var EntityKeyCached,
        entityKeyCached,
        result;

    beforeEach(function () {
      EntityKeyCached = $oop.getClass('test.$entity.EntityKeyCached.EntityKeyCached')
      .mix($entity.EntityKeyHost)
      .mix($entity.EntityKeyCached);
      entityKeyCached = EntityKeyCached.create({
        entityKey: 'foo/bar'.toDocumentKey()
      });
    });

    describe("create()", function () {
      beforeEach(function () {
        result = EntityKeyCached.create({
          entityKey: 'foo/baz'.toDocumentKey()
        });
      });

      it("should return new instance", function () {
        expect(result).not.toBe(entityKeyCached);
      });

      describe("when entityKey property is absent", function () {
        beforeEach(function () {
          result = EntityKeyCached.create();
        });

        it("should return new instance", function () {
          expect(result).not.toBe(entityKeyCached);
        });
      });

      describe("when passing same arguments", function () {
        beforeEach(function () {
          result = EntityKeyCached.create({
            entityKey: 'foo/bar'.toDocumentKey()
          });
        });

        it("should return cached instance", function () {
          expect(result).toBe(entityKeyCached);
        });
      });
    });
  });
});
