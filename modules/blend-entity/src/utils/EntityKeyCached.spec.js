"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("EntityKeyCached", function () {
    var EntityKeyCached,
        entityKeyCached,
        result;

    beforeAll(function () {
      EntityKeyCached = $oop.createClass('test.$entity.EntityKeyCached.EntityKeyCached')
      .blend($entity.EntityKeyHost)
      .blend($entity.EntityKeyCached)
      .build();
      EntityKeyCached.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
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
