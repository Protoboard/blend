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
      it("should add field type entries", function () {
        expect($entity.index.data.__fieldType.__field).toEqual({
          "composite": {
            "__field/options": 1
          },
          "primitive": {
            "__field/fieldType": 1,
            "__field/keyType": 1,
            "__field/valueType": 1
          }
        });
        expect($entity.index.data.__fieldType.__item).toEqual({
          "composite": {
            "__item/options": 1
          },
          "primitive": {
            "__item/valueType": 1,
            "__item/keyType": 1
          }
        });
        expect($entity.index.data.__fieldType.__document).toEqual({
          "primitive": {
            "__document/fields": 1
          }
        });
      });
    });

    describe("getFieldRefsByType()", function () {
      beforeEach(function () {
        result = $entity.FieldTypeIndex.create().getFieldRefsByType('__field', 'primitive');
      });

      it("should return field references", function () {
        expect(result).toEqual([
          '__field/fieldType',
          '__field/keyType',
          '__field/valueType'
        ]);
      });
    });
  });
});
