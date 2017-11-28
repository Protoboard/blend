"use strict";

var $oop = window['blend-oop'],
    $widget = window['blend-widget'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("EntityListItem", function () {
    var EntityListItem,
        entityListItem;

    beforeAll(function () {
      EntityListItem = $oop.getClass('test.$ui.EntityListItem.EntityListItem')
      .blend($widget.Widget)
      .blend($ui.EntityListItem);
      EntityListItem.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      describe("on invalid listItemEntity", function () {
        it("should throw", function () {
          expect(function () {
            entityListItem = EntityListItem.create({
              listItemEntity: 'foo/bar'.toDocument()
            });
          }).toThrow();
        });
      });
    });

    describe("_syncToEntityProperty()", function () {
      var listItemEntity;

      beforeEach(function () {
        listItemEntity = 'foo/bar/baz/quux'.toItem();
        entityListItem = EntityListItem.fromListItemEntity(listItemEntity);
      });

      describe("when itemIdType is 'order'", function () {
        beforeEach(function () {
          spyOn($entity.CollectionFieldKey, 'getItemIdType')
          .and.returnValue('order');
        });

        it("should set node order to item ID", function () {
          entityListItem._syncToEntityProperty('listItemEntity');
          expect(entityListItem.nodeOrder).toBe('quux');
        });
      });

      describe("when itemValueType is 'order'", function () {
        beforeEach(function () {
          spyOn($entity.CollectionFieldKey, 'getItemValueType')
          .and.returnValue('order');
          spyOn($entity.Item, 'getNode')
          .and.returnValue(5);
        });

        it("should set node order to item value", function () {
          entityListItem._syncToEntityProperty('listItemEntity');
          expect(entityListItem.nodeOrder).toBe(5);
        });
      });
    });

    describe("setListItemEntity()", function () {
      var listItemEntity;

      beforeEach(function () {
        listItemEntity = 'foo/bar/baz/quux'.toField();
        entityListItem = EntityListItem.fromListItemEntity('foo/bar/baz/QUUX'.toItem());
        spyOn(entityListItem, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = entityListItem.setListItemEntity(listItemEntity);
        expect(result).toBe(entityListItem);
      });

      it("should invoke setEntityProperty", function () {
        entityListItem.setListItemEntity(listItemEntity);
        expect(entityListItem.setEntityProperty)
        .toHaveBeenCalledWith('listItemEntity', listItemEntity);
      });
    });
  });
});
