"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("Entity", function () {
    var Entity,
        entityKey,
        entity,
        result;

    beforeEach(function () {
      Entity = $oop.getClass('test.$entity.Entity.Entity')
      .mix($entity.Entity);
    });

    describe("fromEntityKey()", function () {
      beforeEach(function () {
        entityKey = 'foo/bar'.toDocumentKey();
        entity = Entity.fromEntityKey(entityKey);
      });

      it("should return an Entity instance", function () {
        expect(Entity.mixedBy(entity)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(entity.entityKey).toBe(entityKey);
      });
    });

    describe("getNode()", function () {
    });

    describe("getNodeWrapped()", function () {
    });

    describe("getSilentNode()", function () {
    });

    describe("getSilentNodeWrapped()", function () {
    });

    describe("touchNode()", function () {
    });

    describe("setNode()", function () {
    });

    describe("appendNode()", function () {
    });

    describe("unsetNode()", function () {
    });
  });
});
