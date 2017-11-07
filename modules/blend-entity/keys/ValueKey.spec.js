"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("ValueKey", function () {
    var ValueKey,
        valueKey,
        result;

    beforeAll(function () {
      ValueKey = $oop.getClass('test.$entity.ValueKey.ValueKey')
      .blend($entity.EntityKey)
      .blend($entity.ValueKey)
      .define({
        getAttributeDocumentKey: function () {
          return 'foo/bar'.toDocumentKey();
        }
      });
    });

    beforeEach(function () {
      valueKey = ValueKey.create({
        _entityPath: 'baz'.toPath()
      });
    });

    describe("getNodeType()", function () {
      var attributeKey;

      describe("when no nodeType is set", function () {
        beforeEach(function () {
          attributeKey = valueKey.getAttributeDocumentKey()
          .getFieldKey('nodeType');
          $entity.entities.deleteNode(attributeKey.getEntityPath());
          result = valueKey.getNodeType();
        });

        it("should return default", function () {
          expect(result).toBe('leaf');
        });
      });
    });

    describe("getValueType()", function () {
      var attributeKey;

      beforeEach(function () {
        attributeKey = valueKey.getAttributeDocumentKey()
        .getFieldKey('valueType');
        $entity.entities.setNode(attributeKey.getEntityPath(), 'A');
        result = valueKey.getValueType();
      });

      afterEach(function () {
        $entity.entities.deleteNode(attributeKey.getEntityPath());
      });

      it("should retrieve valueType attribute", function () {
        expect(result).toEqual('A');
      });
    });

    describe("getValueOptions()", function () {
      var attributeKey;

      beforeEach(function () {
        attributeKey = valueKey.getAttributeDocumentKey()
        .getFieldKey('valueOptions');
        $entity.entities.setNode(attributeKey.getEntityPath(), [0, 1]);
        result = valueKey.getValueOptions();
      });

      afterEach(function () {
        $entity.entities.deleteNode(attributeKey.getEntityPath());
      });

      it("should retrieve valueOptions attribute", function () {
        expect(result).toEqual([0, 1]);
      });
    });
  });
});
