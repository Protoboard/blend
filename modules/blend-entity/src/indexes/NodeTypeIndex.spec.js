"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("NodeTypeIndex", function () {
    var indexData,
        NodeTypeIndex,
        nodeTypeIndex,
        result;

    beforeEach(function () {
      indexData = $entity.index.data;
      $entity.index.data = {};

      // NodeTypeIndex (re-)initializes index when instantiated
      delete $oop.classByClassId['test.$entity.NodeTypeIndex.NodeTypeIndex'];
      NodeTypeIndex = $oop.createClass('test.$entity.NodeTypeIndex.NodeTypeIndex')
      .blend($entity.NodeTypeIndex)
      .build();
      NodeTypeIndex.__builder.forwards = {list: [], lookup: {}};

      nodeTypeIndex = NodeTypeIndex.create();
    });

    afterEach(function () {
      $entity.index.data = indexData;
    });

    describe(".create()", function () {
      it("should add fieldRef entries", function () {
        var byFieldType = $entity.index.data.__fieldRef.byFieldType;

        expect(byFieldType.branch["__field/valueOptions"]).toBe(1);
        expect(byFieldType.branch["__field/itemIdOptions"]).toBe(1);
        expect(byFieldType.branch["__field/itemValueOptions"]).toBe(1);
        expect(byFieldType.leaf["__document/fields"]).toBe(1);
        expect(byFieldType.leaf["__field/nodeType"]).toBe(1);
        expect(byFieldType.leaf["__field/valueType"]).toBe(1);
        expect(byFieldType.leaf["__field/itemIdType"]).toBe(1);
        expect(byFieldType.leaf["__field/itemValueType"]).toBe(1);
      });

      it("should add fieldName entries", function () {
        var byFieldType = $entity.index.data.__fieldName.byFieldType;

        expect(byFieldType.branch.__field.valueOptions).toBe(1);
        expect(byFieldType.branch.__field.itemIdOptions).toBe(1);
        expect(byFieldType.branch.__field.itemValueOptions).toBe(1);
        expect(byFieldType.leaf.__document.fields).toBe(1);
        expect(byFieldType.leaf.__field.nodeType).toBe(1);
        expect(byFieldType.leaf.__field.valueType).toBe(1);
        expect(byFieldType.leaf.__field.itemIdType).toBe(1);
        expect(byFieldType.leaf.__field.itemValueType).toBe(1);
      });
    });

    describe("#getFieldRefsByFieldType()", function () {
      beforeEach(function () {
        result = $entity.NodeTypeIndex.create()
        .getFieldRefsByFieldType('leaf');
      });

      it("should return field references", function () {
        expect(result.sort()).toContain(
            "__document/fields",
            "__field/nodeType",
            "__field/valueType",
            "__field/itemIdType",
            "__field/itemValueType");
      });
    });

    describe("#getFieldNamesByFieldType()", function () {
      beforeEach(function () {
        result = $entity.NodeTypeIndex.create()
        .getFieldNamesByFieldType('__field', 'leaf');
      });

      it("should return field references", function () {
        expect(result.sort()).toEqual([
          "nodeType",
          "valueType",
          "itemIdType",
          "itemValueType"
        ].sort());
      });
    });
  });
});
