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
      .mix($entity.EntityKey)
      .define({
        getAttributeDocumentKey: function () {
          return '__field/foo'.toDocumentKey();
        }
      });
      entityKey = EntityKey.create();
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

    describe("getEntityPath()", function () {
      describe("when created from Path", function () {
        var entityPath;

        beforeEach(function () {
          entityPath = 'foo.bar'.toPath();
          entityKey = EntityKey.fromEntityPath(entityPath);
          result = entityKey.getEntityPath();
        });

        it("should return _entityPath", function () {
          expect(result).toBe(entityPath);
        });
      });
    });

    describe("getAttribute()", function () {
      var attributeKey;

      beforeEach(function () {
        attributeKey = entityKey.getAttributeDocumentKey().getFieldKey('bar');
        $entity.entities.setNode(attributeKey.getEntityPath(), 'BAZ');

        result = entityKey.getAttribute('bar');
      });

      afterEach(function () {
        $entity.entities.deleteNode(attributeKey.getEntityPath());
      });

      it("should retrieve nodeType attribute", function () {
        expect(result).toBe('BAZ');
      });
    });

    describe("getValueType()", function () {
      var attributeKey;

      beforeEach(function () {
        attributeKey = entityKey.getAttributeDocumentKey()
        .getFieldKey('valueType');
        $entity.entities.setNode(attributeKey.getEntityPath(), 'QUUX');

        result = entityKey.getValueType();
      });

      afterEach(function () {
        $entity.entities.deleteNode(attributeKey.getEntityPath());
      });

      it("should return valueType attribute", function () {
        expect(result).toBe('QUUX');
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
