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
        },
        toString: function () {
          return this.entityName;
        }
      })
      .build();
      EntityKey.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      entityKey = EntityKey.create({
        entityName: 'foo'
      });
    });

    describe("#getReference()", function () {
      it("should return string representation", function () {
        var result = entityKey.getReference();
        expect(result).toBe('foo');
      });
    });

    describe("#getChildKey()", function () {
      beforeEach(function () {
        result = entityKey.getChildKey('baz');
      });

      it("should return an EntityKey", function () {
        expect($entity.EntityKey.mixedBy(result)).toBeTruthy();
      });

      it("should return field in document", function () {
        expect(result).toEqual($entity.EntityKey.create({
          parentKey: entityKey,
          entityName: 'baz'
        }));
      });
    });

    describe("#getAttribute()", function () {
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

    describe("#getNodeType()", function () {
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
