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
