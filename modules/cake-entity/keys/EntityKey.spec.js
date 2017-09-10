"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'],
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

describe("$data", function () {
  describe("Path", function () {
    var Path,
        path,
        result;

    beforeEach(function () {
      Path = $oop.getClass('test.$entity.EntityKey.Path')
      .mix($data.Path);
      path = Path.fromComponents(['document', 'foo', 'bar']);
    });

    describe("toEntityKey()", function () {
      beforeEach(function () {
        result = path.toEntityKey();
      });

      it("should return EntityKey instance", function () {
        expect($entity.EntityKey.mixedBy(result)).toBeTruthy();
      });
    });
  });
});
