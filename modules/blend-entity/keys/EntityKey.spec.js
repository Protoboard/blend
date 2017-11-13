"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("EntityKey", function () {
    var EntityKey,
        entityKey,
        result;

    beforeAll(function () {
      EntityKey = $oop.getClass('test.$entity.EntityKey.EntityKey')
      .blend($entity.EntityKey)
      .define({
        getAttributeDocumentKey: function () {
          return '__field/foo'.toDocumentKey();
        }
      });
      EntityKey.__forwards = {list: [], sources: [], lookup: {}};
    });

    beforeEach(function () {
      entityKey = EntityKey.create();
    });

    describe("fromEntityPath()", function () {
      var entityPath;

      beforeEach(function () {
        entityPath = 'document.foo.bar'.toTreePath();
      });

      it("should create new EntityKey instance", function () {
        entityKey = EntityKey.fromEntityPath(entityPath);
        expect(EntityKey.mixedBy(entityKey)).toBeTruthy();
      });

      it("should set _entityPath", function () {
        entityKey = EntityKey.fromEntityPath(entityPath);
        expect(entityKey._entityPath).toBe(entityPath);
      });

      it("should pass additional properties to create", function () {
        entityKey = EntityKey.fromEntityPath(entityPath, {bar: 'baz'});
        expect(entityKey.bar).toBe('baz');
      });
    });

    describe("getEntityPath()", function () {
      describe("when created from Path", function () {
        var entityPath;

        beforeEach(function () {
          entityPath = 'foo.bar'.toTreePath();
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

      it("should retrieve attribute", function () {
        expect(result).toBe('BAZ');
      });
    });

    describe("getNodeType()", function () {
      var attributeKey;

      beforeEach(function () {
        attributeKey = entityKey.getAttributeDocumentKey()
        .getFieldKey('nodeType');
        $entity.entities.setNode(attributeKey.getEntityPath(), 'QUUX');

        result = entityKey.getNodeType();
      });

      afterEach(function () {
        $entity.entities.deleteNode(attributeKey.getEntityPath());
      });

      it("should retrieve nodeType attribute", function () {
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

    beforeAll(function () {
      Path = $oop.getClass('test.$entity.EntityKey.Path')
      .blend($data.TreePath);
    });

    beforeEach(function () {
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
