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
    });
  });
});

describe("String", function () {
  var result;

  describe("toFieldAttributePath()", function () {
    var fieldAttributePath;

    beforeEach(function () {
      fieldAttributePath = $entity.FieldAttributePath.fromAttributeRef('foo/bar');
      spyOn($entity.FieldAttributePath, 'create').and.returnValue(fieldAttributePath);
    });

    it("should create a FieldAttributePath instance", function () {
      result = 'foo/bar'.toFieldAttributePath();
      expect($entity.FieldAttributePath.create).toHaveBeenCalledWith({
        components: ['document', '__field', 'foo/bar']
      });
    });

    it("should return created instance", function () {
      result = 'foo/bar'.toFieldAttributePath();
      expect(result).toBe(fieldAttributePath);
    });
  });
});
