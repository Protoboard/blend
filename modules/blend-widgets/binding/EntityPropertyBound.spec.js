"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("EntityPropertyBound", function () {
    var EntityPropertyBound,
        entityPropertyBound;

    beforeAll(function () {
      EntityPropertyBound = $oop.getClass('test.$widgets.EntityPropertyBound.EntityPropertyBound')
      .blend($widget.Widget)
      .blend($widgets.EntityPropertyBound);
      EntityPropertyBound.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize entityProperties", function () {
        entityPropertyBound = EntityPropertyBound.create({
          foo: 'foo/bar'.toDocument(),
          baz: 'baz/1/quux'.toField(),
          hello: "world"
        });
        expect($data.StringSet.mixedBy(entityPropertyBound.entityProperties))
        .toBeTruthy();
        expect(entityPropertyBound.entityProperties.data).toEqual({
          foo: 1,
          baz: 1
        });
      });

      it("should initialize entityPropertiesByEntityKeys", function () {
        entityPropertyBound = EntityPropertyBound.create({
          foo: 'foo/bar'.toDocument(),
          baz: 'baz/1/quux'.toField()
        });
        expect($data.Collection.mixedBy(entityPropertyBound.entityPropertiesByEntityKeys))
        .toBeTruthy();
        expect(entityPropertyBound.entityPropertiesByEntityKeys.data).toEqual({
          'foo/bar': 'foo',
          'baz/1/quux': 'baz'
        });
      });
    });

    describe("setEntityProperty()", function () {
      var field1 = 'foo/1/bar'.toField(),
          field2 = 'baz/1/quux'.toField();

      beforeEach(function () {
        entityPropertyBound = EntityPropertyBound.create({field: field1});
        spyOn(entityPropertyBound, 'syncToEntityProperty');
      });

      afterEach(function () {
        entityPropertyBound.destroy();
      });

      it("should return self", function () {
        var result = entityPropertyBound.setEntityProperty('field', field2);
        expect(result).toBe(entityPropertyBound);
      });

      it("should set entity property", function () {
        entityPropertyBound.setEntityProperty('field', field2);
        expect(entityPropertyBound.field).toBe(field2);
      });

      it("should update entityPropertiesByEntityKeys", function () {
        entityPropertyBound.setEntityProperty('field', field2);
        expect(entityPropertyBound.entityPropertiesByEntityKeys.data).toEqual({
          'baz/1/quux': 'field'
        });
      });

      it("should invoke syncToEntityProperty", function () {
        entityPropertyBound.setEntityProperty('field', field2);
        expect(entityPropertyBound.syncToEntityProperty)
        .toHaveBeenCalledWith('field');
      });

      it("should unsubscribe from old property value", function () {
        entityPropertyBound.setEntityProperty('field', field2);
        expect(entityPropertyBound.subscribes($entity.EVENT_ENTITY_CHANGE, field1))
        .toBeFalsy();
      });

      it("should subscribe to new property value", function () {
        entityPropertyBound.setEntityProperty('field', field2);
        expect(entityPropertyBound.subscribes($entity.EVENT_ENTITY_CHANGE, field2))
        .toBeTruthy();
      });
    });

    describe("onAttach()", function () {
      var field1 = 'foo/1/bar'.toField(),
          field2 = 'baz/1/quux'.toField();

      beforeEach(function () {
        entityPropertyBound = EntityPropertyBound.create({
          field1: field1,
          field2: field2
        });
        spyOn(entityPropertyBound, 'syncToEntityProperty');
      });

      afterEach(function () {
        entityPropertyBound.destroy();
      });

      it("should invoke syncToEntityProperty", function () {
        entityPropertyBound.onAttach();
        var allArgs = entityPropertyBound.syncToEntityProperty.calls.allArgs();
        expect(allArgs).toEqual([
          ['field1'],
          ['field2']
        ]);
      });

      it("should subscribe to EVENT_ENTITY_CHANGE", function () {
        entityPropertyBound.onAttach();
        expect(entityPropertyBound.subscribes($entity.EVENT_ENTITY_CHANGE, field1))
        .toBeTruthy();
        expect(entityPropertyBound.subscribes($entity.EVENT_ENTITY_CHANGE, field2))
        .toBeTruthy();
      });
    });

    describe("onEntityChange()", function () {
      var field = 'foo/1/bar'.toField();

      beforeEach(function () {
        'foo/1/bar'.toField().deleteNode();
        entityPropertyBound = EntityPropertyBound.create({field: field});
        entityPropertyBound.onAttach();
        spyOn(entityPropertyBound, 'syncToEntityProperty');
      });

      afterEach(function () {
        entityPropertyBound.destroy();
      });

      it("should be invoked on EVENT_ENTITY_CHANGE", function () {
        'foo/1/bar'.toField().setNode("Hello World!");
        expect(entityPropertyBound.syncToEntityProperty)
        .toHaveBeenCalledWith('field');
      });
    });
  });
});
