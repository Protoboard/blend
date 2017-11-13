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

      it("should pass additional properties to create", function () {
        fieldValueTypePath = FieldValueTypePath.fromFieldValueType('reference', {bar: 'baz'});
        expect(fieldValueTypePath.bar).toBe('baz');
      });
    });
  });
});

describe("String", function () {
  describe("toFieldValueTypePath()", function () {
    var fieldValueTypePath;

    it("should create a FieldValueTypePath instance", function () {
      fieldValueTypePath = 'reference'.toFieldValueTypePath();
      expect($entity.FieldValueTypePath.mixedBy(fieldValueTypePath))
      .toBeTruthy();
    });

    it("should return created instance", function () {
      fieldValueTypePath = 'reference'.toFieldValueTypePath();
      expect(fieldValueTypePath).toBe(fieldValueTypePath);
      expect(fieldValueTypePath.components)
      .toEqual(['document', '__field', '__field/valueType', 'options',
        'reference']);
    });

    it("should pass additional properties to create", function () {
      fieldValueTypePath = 'reference'.toFieldValueTypePath({bar: 'baz'});
      expect(fieldValueTypePath.bar).toBe('baz');
    });
  });
});
