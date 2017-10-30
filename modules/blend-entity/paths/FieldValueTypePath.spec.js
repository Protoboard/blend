"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("FieldValueTypePath", function () {
    var FieldValueTypePath,
        fieldValueTypePath;

    beforeAll(function () {
      FieldValueTypePath = $oop.getClass('test.$entity.FieldValueTypePath.FieldValueTypePath')
      .blend($entity.FieldValueTypePath);
      FieldValueTypePath.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromFieldValueType()", function () {
      it("should return FieldValueTypePath instance", function () {
        fieldValueTypePath = FieldValueTypePath.fromFieldValueType('reference');
        expect(FieldValueTypePath.mixedBy(fieldValueTypePath)).toBeTruthy();
      });

      it("should initialize path components", function () {
        fieldValueTypePath = FieldValueTypePath.fromFieldValueType('reference');
        expect(fieldValueTypePath.components).toEqual([
          'document', '__field', '__field/valueType', 'options', 'reference']);
      });
    });
  });
});

describe("String", function () {
  var result;

  describe("toFieldValueTypePath()", function () {
    var fieldValueTypePath;

    beforeEach(function () {
      fieldValueTypePath = $entity.FieldValueTypePath.fromFieldValueType('reference');
      spyOn($entity.FieldValueTypePath, 'create').and
      .returnValue(fieldValueTypePath);
    });

    it("should create a FieldValueTypePath instance", function () {
      result = 'reference'.toFieldValueTypePath();
      expect($entity.FieldValueTypePath.create).toHaveBeenCalledWith({
        components: ['document', '__field', '__field/valueType', 'options',
          'reference']
      });
    });

    it("should return created instance", function () {
      result = 'reference'.toFieldValueTypePath();
      expect(result).toBe(fieldValueTypePath);
    });
  });
});
