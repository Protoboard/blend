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
      EntityKey = $oop.createClass('test.$entity.EntityKey.EntityKey')
      .blend($entity.EntityKey)
      .define({
        getAttributeDocumentKey: function () {
          return '__field/foo'.toDocumentKey();
        }
      })
      .build();
      EntityKey.__builder.forwards = {list: [], lookup: {}};
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
  describe("TreePath", function () {
    var TreePath,
        treePath,
        entityKey;

    beforeAll(function () {
      TreePath = $oop.createClass('test.$entity.EntityKey.TreePath')
      .blend($data.TreePath)
      .build();
      TreePath.__builder.forwards = {list: [], lookup: {}};
    });

    describe("toEntityKey()", function () {
      beforeEach(function () {
        treePath = TreePath.fromComponents(['document', 'foo', 'bar']);
      });

      it("should return EntityKey instance", function () {
        entityKey = treePath.toEntityKey();
        expect($entity.EntityKey.mixedBy(entityKey)).toBeTruthy();
      });

      it("should pass additional properties to create", function () {
        entityKey = treePath.toEntityKey({bar: 'baz'});
        expect(entityKey.bar).toBe('baz');
      });
    });
  });
});
