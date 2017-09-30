"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("NodeTypeIndex", function () {
    var NodeTypeIndex,
        nodeTypeIndex,
        result;

    beforeEach(function () {
      $entity.index
      .deleteNode('__fieldName.byFieldType'.toPath())
      .deleteNode('__fieldRef.byFieldType'.toPath());

      delete $oop.Class.classByClassId['test.$entity.NodeTypeIndex.NodeTypeIndex'];
      NodeTypeIndex = $oop.getClass('test.$entity.NodeTypeIndex.NodeTypeIndex')
      .mix($entity.NodeTypeIndex);

      nodeTypeIndex = NodeTypeIndex.create();
    });

    describe("create()", function () {
      it("should add fieldRef entries", function () {
        expect($entity.index.data.__fieldRef.byFieldType).toEqual({
          "branch": {
            "__field/options": 1,
            "__item/options": 1
          },
          "leaf": {
            "__document/fields": 1,
            "__field/nodeType": 1,
            "__field/keyType": 1,
            "__field/valueType": 1,
            "__item/keyType": 1,
            "__item/valueType": 1
          }
        });
      });

      it("should add fieldName entries", function () {
        expect($entity.index.data.__fieldName.byFieldType).toEqual({
          "branch": {
            "__field": {
              "options": 1
            },
            "__item": {
              "options": 1
            }
          },
          "leaf": {
            "__document": {
              "fields": 1
            },
            "__field": {
              "nodeType": 1,
              "keyType": 1,
              "valueType": 1
            },
            "__item": {
              "valueType": 1,
              "keyType": 1
            }
          }
        });
      });
    });

    describe("getFieldRefsByFieldType()", function () {
      beforeEach(function () {
        result = $entity.NodeTypeIndex.create()
        .getFieldRefsByFieldType('leaf');
      });

      it("should return field references", function () {
        expect(result.sort()).toEqual([
          "__document/fields",
          "__field/nodeType",
          "__field/keyType",
          "__field/valueType",
          "__item/keyType",
          "__item/valueType"
        ].sort());
      });
    });

    describe("getFieldNamesByFieldType()", function () {
      beforeEach(function () {
        result = $entity.NodeTypeIndex.create()
        .getFieldNamesByFieldType('__field', 'leaf');
      });

      it("should return field references", function () {
        expect(result.sort()).toEqual([
          "nodeType",
          "keyType",
          "valueType"
        ].sort());
      });
    });
  });
});
