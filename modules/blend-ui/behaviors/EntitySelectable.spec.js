"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("EntitySelectable", function () {
    var EntitySelectable,
        entitySelectable;

    beforeAll(function () {
      EntitySelectable = $oop.getClass('test.$ui.EntitySelectable.EntitySelectable')
      .blend($widget.Widget)
      .blend($ui.EntitySelectable);
      EntitySelectable.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromOwnValueEntity()", function () {
      var ownValueEntity,
          selectedStateEntity;

      beforeEach(function () {
        ownValueEntity = 'foo/bar/value'.toField();
        selectedStateEntity = 'foo/bar/selected'.toField();
      });

      it("should return EntitySelectable instance", function () {
        entitySelectable = EntitySelectable.fromOwnValueEntity(ownValueEntity, selectedStateEntity);
        expect(EntitySelectable.mixedBy(entitySelectable)).toBeTruthy();
      });

      it("should initialize ownValueEntity", function () {
        entitySelectable = EntitySelectable.fromOwnValueEntity(ownValueEntity, selectedStateEntity);
        expect(entitySelectable.ownValueEntity).toBe(ownValueEntity);
      });

      it("should initialize selectedStateEntity", function () {
        entitySelectable = EntitySelectable.fromOwnValueEntity(ownValueEntity, selectedStateEntity);
        expect(entitySelectable.selectedStateEntity).toBe(selectedStateEntity);
      });
    });

    describe("create()", function () {
      describe("on invalid ownValueEntity", function () {
        it("should throw", function () {
          expect(function () {
            entitySelectable = EntitySelectable.create({
              ownValueEntity: 'foo/bar'.toDocument()
            });
          }).toThrow();
        });
      });

      describe("on invalid selectedStateEntity", function () {
        it("should throw", function () {
          expect(function () {
            entitySelectable = EntitySelectable.create({
              selectedStateEntity: 'foo/bar'.toDocument()
            });
          }).toThrow();
        });
      });
    });

    describe("setOwnValue()", function () {
      var ownValueEntity;

      beforeEach(function () {
        ownValueEntity = 'baz/1/value'.toField();
        ownValueEntity.deleteNode();
        entitySelectable = EntitySelectable.fromOwnValueEntity(ownValueEntity);
      });

      afterEach(function () {
        ownValueEntity.deleteNode();
      });

      it("should return self", function () {
        var result = entitySelectable.setOwnValue('foo');
        expect(result).toBe(entitySelectable);
      });

      it("should sync entity to ownValue", function () {
        entitySelectable.setOwnValue('foo');
        expect(ownValueEntity.getNode()).toBe('foo');
      });
    });

    describe("select()", function () {
      var selectedStateEntity;

      beforeEach(function () {
        selectedStateEntity = 'baz/1/selected'.toField();
        selectedStateEntity.deleteNode();
        entitySelectable = EntitySelectable.create({
          selectedStateEntity: selectedStateEntity
        });
      });

      afterEach(function () {
        selectedStateEntity.deleteNode();
      });

      it("should return self", function () {
        var result = entitySelectable.select();
        expect(result).toBe(entitySelectable);
      });

      it("should sync entity to 'selected' state", function () {
        entitySelectable.select();
        expect(selectedStateEntity.getNode()).toBe(true);
      });
    });

    describe("deselect()", function () {
      var selectedStateEntity;

      beforeEach(function () {
        selectedStateEntity = 'baz/1/selected'.toField();
        selectedStateEntity.setNode(true);
        entitySelectable = EntitySelectable.create({
          selectedStateEntity: selectedStateEntity
        });
        entitySelectable.onAttach();
      });

      afterEach(function () {
        entitySelectable.destroy();
        selectedStateEntity.deleteNode();
      });

      it("should return self", function () {
        var result = entitySelectable.deselect();
        expect(result).toBe(entitySelectable);
      });

      it("should sync entity to 'selected' state", function () {
        entitySelectable.deselect();
        expect(selectedStateEntity.getNode()).toBe(false);
      });
    });

    describe("setOwnValueEntity()", function () {
      var ownValueEntity;

      beforeEach(function () {
        ownValueEntity = 'baz/1/value'.toField();
        entitySelectable = EntitySelectable.fromOwnValueEntity('foo/1/value'.toField());
        spyOn(entitySelectable, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = entitySelectable.setOwnValueEntity(ownValueEntity);
        expect(result).toBe(entitySelectable);
      });

      it("should invoke setEntityProperty", function () {
        entitySelectable.setOwnValueEntity(ownValueEntity);
        expect(entitySelectable.setEntityProperty)
        .toHaveBeenCalledWith('ownValueEntity', ownValueEntity);
      });
    });

    describe("setSelectedStateEntity()", function () {
      var selectedStateEntity;

      beforeEach(function () {
        selectedStateEntity = 'baz/1/value'.toField();
        entitySelectable = EntitySelectable.fromOwnValueEntity('foo/1/value'.toField());
        spyOn(entitySelectable, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = entitySelectable.setSelectedStateEntity(selectedStateEntity);
        expect(result).toBe(entitySelectable);
      });

      it("should invoke setEntityProperty", function () {
        entitySelectable.setSelectedStateEntity(selectedStateEntity);
        expect(entitySelectable.setEntityProperty)
        .toHaveBeenCalledWith('selectedStateEntity', selectedStateEntity);
      });
    });

    describe("_syncToEntityProperty()", function () {
      var ownValueEntity,
          selectedStateEntity;

      beforeEach(function () {
        ownValueEntity = 'foo/1/value'.toField();
        selectedStateEntity = 'foo/1/selected'.toField();
        ownValueEntity.setNode("Hello");
        selectedStateEntity.setNode(true);
        entitySelectable = EntitySelectable.fromOwnValueEntity(ownValueEntity, selectedStateEntity);
        entitySelectable.onAttach();
      });

      afterEach(function () {
        entitySelectable.destroy();
        ownValueEntity.deleteNode();
      });

      it("should sync ownValue to ownValueEntity", function () {
        entitySelectable._syncToEntityProperty('ownValueEntity');
        expect(entitySelectable.ownValue).toBe("Hello");
      });

      it("should sync 'selected' state to selectedStateEntity", function () {
        entitySelectable._syncToEntityProperty('selectedStateEntity');
        expect(entitySelectable.getStateValue('selected')).toBe(true);
      });
    });
  });
});
