"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'],
    $entity = window['cake-entity'];

describe("$assert", function () {
  var ValueKey,
      valueKey;

  beforeAll(function () {
    ValueKey = $oop.getClass('test.$entity.ValueKey.ValueKey')
    .blend($entity.EntityKey)
    .blend($entity.ValueKey);
  });

  beforeEach(function () {
    valueKey = ValueKey.create();
    spyOn($assert, 'assert').and.callThrough();
  });

  describe("isValueKey()", function () {
    it("should pass message to assert", function () {
      $assert.isValueKey(valueKey, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-ValueKey", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isValueKey({});
        }).toThrow();
      });
    });
  });

  describe("isValueKeyOptional()", function () {
    it("should pass message to assert", function () {
      $assert.isValueKeyOptional(valueKey, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-chain", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isValueKeyOptional({});
        }).toThrow();
      });
    });
  });
});

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
