"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("FieldAttributePath", function () {
    var FieldAttributePath,
        fieldAttributePath;

    beforeAll(function () {
      FieldAttributePath = $oop.getClass('test.$entity.FieldAttributePath.FieldAttributePath')
      .blend($entity.FieldAttributePath);
      FieldAttributePath.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromAttributeRef()", function () {
      it("should return FieldAttributePath instance", function () {
        fieldAttributePath = FieldAttributePath.fromAttributeRef('foo/bar');
        expect(FieldAttributePath.mixedBy(fieldAttributePath)).toBeTruthy();
      });

      it("should initialize path components", function () {
        fieldAttributePath = FieldAttributePath.fromAttributeRef('foo/bar');
        expect(fieldAttributePath.components).toEqual([
          'document', '__field', 'foo/bar']);
      });

      it("should pass additional properties to create", function () {
        fieldAttributePath = FieldAttributePath.fromAttributeRef('foo/bar', {bar: 'baz'});
        expect(fieldAttributePath.bar).toBe('baz');
      });
    });
  });
});

describe("String", function () {
  describe("toFieldAttributePath()", function () {
    var fieldAttributePath;

    it("should create a FieldAttributePath instance", function () {
      fieldAttributePath = 'foo/bar'.toFieldAttributePath();
      expect($entity.FieldAttributePath.mixedBy(fieldAttributePath))
      .toBeTruthy();
    });

    it("should set components", function () {
      fieldAttributePath = 'foo/bar'.toFieldAttributePath();
      expect(fieldAttributePath.components)
      .toEqual(['document', '__field', 'foo/bar']);
    });

    it("should pass additional properties to create", function () {
      fieldAttributePath = 'foo/bar'.toFieldAttributePath({bar: 'baz'});
      expect(fieldAttributePath.bar).toBe('baz');
    });
  });
});
