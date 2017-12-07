"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $widget = window['blend-widget'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("EntityList", function () {
    var EntityListItem,
        entityListItem,
        EntityList,
        entityList,
        listEntityKey,
        listEntity;

    beforeAll(function () {
      EntityListItem = $oop.createClass('test.$ui.EntityList.EntityListItem')
      .blend($widget.Widget)
      .blend($ui.EntityListItem)
      .build();
      EntityListItem.__builder.forwards = {list: [], lookup: {}};

      EntityList = $oop.createClass('test.$ui.EntityList.EntityList')
      .blend($widget.Widget)
      .blend($ui.EntityList)
      .define({
        ListItemClass: EntityListItem
      })
      .build();
      EntityList.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      listEntityKey = $entity.CollectionFieldKey.fromString('foo/1/list');
      listEntity = listEntityKey.toField();
    });

    describe("fromListEntity()", function () {
      it("should return EntityList instance", function () {
        entityList = EntityList.fromListEntity(listEntity);
        expect(EntityList.mixedBy(entityList)).toBeTruthy();
      });

      it("should initialize listEntity", function () {
        entityList = EntityList.fromListEntity(listEntity);
        expect(entityList.listEntity).toBe(listEntity);
      });
    });

    describe("create()", function () {
      describe("on invalid listEntity", function () {
        it("should throw", function () {
          expect(function () {
            EntityList.create({listEntity: 'foo/bar'.toDocument()});
          }).toThrow();
        });
      });

      it("should initialize itemWidgetByItemId", function () {
        entityList = EntityList.create();
        expect($data.Collection.mixedBy(entityList.itemWidgetByItemId))
        .toBeTruthy();
      });
    });

    describe("_syncToEntityProperty()", function () {
      beforeEach(function () {
        listEntity.setNode({
          foo: 1,
          bar: 2,
          baz: 3
        });
        entityList = EntityList.fromListEntity(listEntity);
      });

      afterEach(function () {
        listEntity.deleteNode();
      });

      it("should sync child widgets to entity contents", function () {
        entityList._syncToEntityProperty('listEntity');

        var childNodeData = entityList.childNodes.data;
        expect(childNodeData.length).toBe(3);
        expect(childNodeData[0].listItemEntity)
        .toEqual('foo/1/list/foo'.toItem());
        expect(childNodeData[0].parentNode).toBe(entityList);
        expect(childNodeData[1].listItemEntity)
        .toEqual('foo/1/list/bar'.toItem());
        expect(childNodeData[1].parentNode).toBe(entityList);
        expect(childNodeData[2].listItemEntity)
        .toEqual('foo/1/list/baz'.toItem());
        expect(childNodeData[2].parentNode).toBe(entityList);
      });

      describe("when entityList is already populated", function () {
        beforeEach(function () {
          entityList._syncToEntityProperty('listEntity');
          listEntity.setNode({
            hello: 1,
            world: 2
          });
        });

        it("should replace child widgets", function () {
          entityList._syncToEntityProperty('listEntity');

          var childNodeData = entityList.childNodes.data;
          expect(childNodeData.length).toBe(2);
          expect(childNodeData[0].listItemEntity)
          .toEqual('foo/1/list/hello'.toItem());
          expect(childNodeData[0].parentNode).toBe(entityList);
          expect(childNodeData[1].listItemEntity)
          .toEqual('foo/1/list/world'.toItem());
          expect(childNodeData[1].parentNode).toBe(entityList);
        });
      });
    });

    describe("addChildNode()", function () {
      beforeEach(function () {
        entityList = EntityList.fromListEntity(listEntity);
        entityListItem = EntityListItem.create({
          nodeName: 'A',
          listItemEntity: 'foo/1/list/quux'.toItem()
        });
      });

      it("should return self", function () {
        var result = entityList.addChildNode(entityListItem);
        expect(result).toBe(entityList);
      });

      it("should add association to itemWidgetByItemId", function () {
        entityList.addChildNode(entityListItem);
        expect(entityList.itemWidgetByItemId.data).toEqual({
          quux: entityListItem
        });
      });

      describe("when passing widget by existing nodeName", function () {
        beforeEach(function () {
          entityList.addChildNode(EntityListItem.create({
            nodeName: 'A',
            listItemEntity: 'foo/1/list/QUUX'.toItem()
          }));
        });

        it("should remove old association from itemWidgetByItemId", function () {
          entityList.addChildNode(entityListItem);
          expect(entityList.itemWidgetByItemId.data).toEqual({
            quux: entityListItem
          });
        });
      });
    });

    describe("removeChildNode()", function () {
      beforeEach(function () {
        entityList = EntityList.fromListEntity(listEntity);
        entityListItem = EntityListItem.create({
          nodeName: 'A',
          listItemEntity: 'foo/1/list/quux'.toItem()
        });
        entityList.addChildNode(entityListItem);
      });

      it("should return self", function () {
        var result = entityList.addChildNode(entityListItem);
        expect(result).toBe(entityList);
      });

      it("should remove association from itemWidgetByItemId", function () {
        entityList.removeChildNode('A');
        expect(entityList.itemWidgetByItemId.data).toEqual({});
      });
    });

    describe("getItemWidgetByItemId()", function () {
      beforeEach(function () {
        entityList = EntityList.fromListEntity(listEntity);
        entityListItem = EntityListItem.create({
          nodeName: 'A',
          listItemEntity: 'foo/1/list/quux'.toItem()
        });
        entityList.addChildNode(entityListItem);
      });

      describe("when passing existing itemId", function () {
        it("should return matching item widget", function () {
          var result = entityList.getItemWidgetByItemId('quux');
          expect(result).toBe(entityListItem);
        });
      });

      describe("when passing absent itemId", function () {
        it("should return matching item widget", function () {
          var result = entityList.getItemWidgetByItemId('QUUX');
          expect(result).toBeUndefined();
        });
      });
    });

    describe("setListEntity()", function () {
      beforeEach(function () {
        entityList = EntityList.create();
        spyOn(entityList, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = entityList.setListEntity(listEntity);
        expect(result).toBe(entityList);
      });

      it("should sync widget contents to listEntity", function () {
        entityList.setListEntity(listEntity);
        expect(entityList.setEntityProperty)
        .toHaveBeenCalledWith('listEntity', listEntity);
      });
    });

    describe("onEntityChange()", function () {
      beforeEach(function () {
        listEntity.setNode({
          foo: 1,
          bar: 2,
          baz: 3
        });
        entityList = EntityList.fromListEntity(listEntity);
        entityList.onAttach();
      });

      afterEach(function () {
        listEntity.deleteNode();
      });

      it("should sync child widgets to entity content changes", function () {
        listEntity.setNode({
          foo: 1,
          baz: 3,
          quux: 4
        });

        var childNodeData = entityList.childNodes.data;
        expect(childNodeData.length).toBe(3);
        expect(childNodeData[0].listItemEntity)
        .toEqual('foo/1/list/foo'.toItem());
        expect(childNodeData[0].parentNode).toBe(entityList);
        expect(childNodeData[1].listItemEntity)
        .toEqual('foo/1/list/baz'.toItem());
        expect(childNodeData[1].parentNode).toBe(entityList);
        expect(childNodeData[2].listItemEntity)
        .toEqual('foo/1/list/quux'.toItem());
        expect(childNodeData[2].parentNode).toBe(entityList);
      });
    });
  });
});
