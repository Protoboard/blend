"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("EntityPropertyBound", function () {
    var EntityPropertyBound,
        entityPropertyBound;

    beforeAll(function () {
      EntityPropertyBound = $oop.getClass('test.$ui.EntityPropertyBound.EntityPropertyBound')
      .blend($widget.Widget)
      .blend($ui.EntityPropertyBound);
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
      var field = 'foo/1/bar'.toField();

      beforeEach(function () {
        entityPropertyBound = EntityPropertyBound.create();
        spyOn(entityPropertyBound, '_syncToEntityProperty');
      });

      afterEach(function () {
        entityPropertyBound.destroy();
      });

      it("should return self", function () {
        var result = entityPropertyBound.setEntityProperty('field', field);
        expect(result).toBe(entityPropertyBound);
      });

      it("should add property to entityProperties", function () {
        entityPropertyBound.setEntityProperty('field', field);
        expect(entityPropertyBound.entityProperties.data).toEqual({
          'field': 1
        });
      });

      it("should set entity property", function () {
        entityPropertyBound.setEntityProperty('field', field);
        expect(entityPropertyBound.field).toBe(field);
      });

      it("should set entityPropertiesByEntityKeys", function () {
        entityPropertyBound.setEntityProperty('field', field);
        expect(entityPropertyBound.entityPropertiesByEntityKeys.data).toEqual({
          'foo/1/bar': 'field'
        });
      });

      it("should invoke _syncToEntityProperty", function () {
        entityPropertyBound.setEntityProperty('field', field);
        expect(entityPropertyBound._syncToEntityProperty)
        .toHaveBeenCalledWith('field');
      });

      describe("when widget is attached", function () {
        beforeEach(function () {
          spyOn(entityPropertyBound, 'isAttached').and.returnValue(true);
        });

        it("should subscribe to new property value", function () {
          entityPropertyBound.setEntityProperty('field', field);
          expect(entityPropertyBound.subscribes($entity.EVENT_ENTITY_CHANGE, field))
          .toBeTruthy();
        });
      });

      describe("when entity property has previous value", function () {
        var field2;

        beforeEach(function () {
          field2 = 'baz/1/quux'.toField();
          entityPropertyBound.setEntityProperty('field', field2);
        });

        it("should update entityPropertiesByEntityKeys", function () {
          entityPropertyBound.setEntityProperty('field', field);
          expect(entityPropertyBound.entityPropertiesByEntityKeys.data)
          .toEqual({
            'foo/1/bar': 'field'
          });
        });

        describe("when widget is attached", function () {
          beforeEach(function () {
            spyOn(entityPropertyBound, 'isAttached').and.returnValue(true);
          });

          it("should unsubscribe from old property value", function () {
            entityPropertyBound.setEntityProperty('field', field);
            expect(entityPropertyBound.subscribes($entity.EVENT_ENTITY_CHANGE, field2))
            .toBeFalsy();
          });
        });
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
        spyOn(entityPropertyBound, '_syncToEntityProperty');
      });

      afterEach(function () {
        entityPropertyBound.destroy();
      });

      it("should invoke _syncToEntityProperty", function () {
        entityPropertyBound.onAttach();
        var allArgs = entityPropertyBound._syncToEntityProperty.calls.allArgs();
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
        spyOn(entityPropertyBound, '_syncToEntityProperty');
      });

      afterEach(function () {
        entityPropertyBound.destroy();
      });

      it("should be invoked on EVENT_ENTITY_CHANGE", function () {
        'foo/1/bar'.toField().setNode("Hello World!");
        expect(entityPropertyBound._syncToEntityProperty)
        .toHaveBeenCalledWith('field');
      });
    });
  });
});
