"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("EntityKey", function () {
    var EntityKey,
        entityKey,
        result;

    beforeEach(function () {
      EntityKey = $oop.getClass('test.$entity.EntityKey.EntityKey')
      .mix($entity.EntityKey);
    });

    describe("fromEntityPath()", function () {
      var entityPath;

      beforeEach(function () {
        entityKey = {};
        entityPath = 'document.foo.bar'.toPath();
        spyOn(EntityKey, 'create').and.returnValue(entityKey);
        result = EntityKey.fromEntityPath(entityPath);
      });

      it("should create new EntityKey instance", function () {
        expect(EntityKey.create).toHaveBeenCalledWith({
          _entityPath: entityPath
        });
      });

      it("should return the created instance", function () {
        expect(result).toBe(entityKey);
      });
    });
  });
});
