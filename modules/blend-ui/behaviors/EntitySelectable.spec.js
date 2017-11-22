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
          isSelectedEntity;

      beforeEach(function () {
        ownValueEntity = 'foo/bar/value'.toField();
        isSelectedEntity = 'foo/bar/selected'.toField();
      });

      it("should return EntitySelectable instance", function () {
        entitySelectable = EntitySelectable.fromOwnValueEntity(ownValueEntity, isSelectedEntity);
        expect(EntitySelectable.mixedBy(entitySelectable)).toBeTruthy();
      });

      it("should initialize ownValueEntity", function () {
        entitySelectable = EntitySelectable.fromOwnValueEntity(ownValueEntity, isSelectedEntity);
        expect(entitySelectable.ownValueEntity).toBe(ownValueEntity);
      });

      it("should initialize isSelectedEntity", function () {
        entitySelectable = EntitySelectable.fromOwnValueEntity(ownValueEntity, isSelectedEntity);
        expect(entitySelectable.isSelectedEntity).toBe(isSelectedEntity);
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

      describe("on invalid isSelectedEntity", function () {
        it("should throw", function () {
          expect(function () {
            entitySelectable = EntitySelectable.create({
              isSelectedEntity: 'foo/bar'.toDocument()
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
      var isSelectedEntity;

      beforeEach(function () {
        isSelectedEntity = 'baz/1/selected'.toField();
        isSelectedEntity.deleteNode();
        entitySelectable = EntitySelectable.create({
          isSelectedEntity: isSelectedEntity
        });
      });

      afterEach(function () {
        isSelectedEntity.deleteNode();
      });

      it("should return self", function () {
        var result = entitySelectable.select();
        expect(result).toBe(entitySelectable);
      });

      it("should sync entity to isSelected", function () {
        entitySelectable.select();
        expect(isSelectedEntity.getNode()).toBe(true);
      });
    });

    describe("deselect()", function () {
      var isSelectedEntity;

      beforeEach(function () {
        isSelectedEntity = 'baz/1/selected'.toField();
        isSelectedEntity.setNode(true);
        entitySelectable = EntitySelectable.create({
          isSelectedEntity: isSelectedEntity
        });
        entitySelectable.onAttach();
      });

      afterEach(function () {
        entitySelectable.destroy();
        isSelectedEntity.deleteNode();
      });

      it("should return self", function () {
        var result = entitySelectable.deselect();
        expect(result).toBe(entitySelectable);
      });

      it("should sync entity to isSelected", function () {
        entitySelectable.deselect();
        expect(isSelectedEntity.getNode()).toBe(false);
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

    describe("setIsSelectedEntity()", function () {
      var isSelectedEntity;

      beforeEach(function () {
        isSelectedEntity = 'baz/1/value'.toField();
        entitySelectable = EntitySelectable.fromOwnValueEntity('foo/1/value'.toField());
        spyOn(entitySelectable, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = entitySelectable.setIsSelectedEntity(isSelectedEntity);
        expect(result).toBe(entitySelectable);
      });

      it("should invoke setEntityProperty", function () {
        entitySelectable.setIsSelectedEntity(isSelectedEntity);
        expect(entitySelectable.setEntityProperty)
        .toHaveBeenCalledWith('isSelectedEntity', isSelectedEntity);
      });
    });

    describe("_syncToEntityProperty()", function () {
      var ownValueEntity,
          isSelectedEntity;

      beforeEach(function () {
        ownValueEntity = 'foo/1/value'.toField();
        isSelectedEntity = 'foo/1/selected'.toField();
        ownValueEntity.setNode("Hello");
        isSelectedEntity.setNode(true);
        entitySelectable = EntitySelectable.fromOwnValueEntity(ownValueEntity, isSelectedEntity);
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

      it("should sync isSelected to isSelectedEntity", function () {
        entitySelectable._syncToEntityProperty('isSelectedEntity');
        expect(entitySelectable.isSelected).toBe(true);
      });
    });
  });
});
