"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("FieldTypeIndex", function () {
    var FieldTypeIndex,
        fieldTypeIndex,
        result;

    beforeEach(function () {
      $entity.index.deleteNode('__fieldType'.toPath());

      delete $oop.Class.classByClassId['test.$entity.FieldTypeIndex.FieldTypeIndex'];
      FieldTypeIndex = $oop.getClass('test.$entity.FieldTypeIndex.FieldTypeIndex')
      .mix($entity.FieldTypeIndex);

      fieldTypeIndex = FieldTypeIndex.create();
    });

    afterEach(function () {
      $entity.index.deleteNode('__fieldType'.toPath());
    });

    describe("create()", function () {
      it("should add fieldRef entries", function () {
        expect($entity.index.data.__fieldRef.byFieldType).toEqual({
          "composite": {
            "__field/options": 1,
            "__item/options": 1
          },
          "primitive": {
            "__document/fields": 1,
            "__field/fieldType": 1,
            "__field/keyType": 1,
            "__field/valueType": 1,
            "__item/valueType": 1,
            "__item/keyType": 1
          }
        });
      });

      it("should add fieldName entries", function () {
        expect($entity.index.data.__fieldName.byFieldType).toEqual({
          "composite": {
            "__field": {
              "options": 1
            },
            "__item": {
              "options": 1
            }
          },
          "primitive": {
            "__document": {
              "fields": 1
            },
            "__field": {
              "fieldType": 1,
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
        result = $entity.FieldTypeIndex.create()
        .getFieldRefsByFieldType('primitive');
      });

      it("should return field references", function () {
        expect(result).toEqual([
          "__document/fields",
          "__field/fieldType",
          "__field/keyType",
          "__field/valueType",
          "__item/valueType",
          "__item/keyType"
        ]);
      });
    });

    describe("getFieldNamesByFieldType()", function () {
      beforeEach(function () {
        result = $entity.FieldTypeIndex.create()
        .getFieldNamesByFieldType('__field', 'primitive');
      });

      it("should return field references", function () {
        expect(result).toEqual([
          "fieldType",
          "keyType",
          "valueType"
        ]);
      });
    });
  });
});
