"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("Item", function () {
    var Item,
        item;

    beforeAll(function () {
      Item = $oop.getClass('test.$entity.Item.Item')
      .blend($entity.Item);
    });

    beforeEach(function () {
      item = Item.fromEntityKey('foo/bar/baz/quux'.toItemKey());
    });

    describe("fromComponents()", function () {
      beforeEach(function () {
        item = Item.fromComponents('foo', 'bar', 'baz', 'quux');
      });

      it("should return Item instance", function () {
        expect(Item.mixedBy(item)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(item.entityKey.equals('foo/bar/baz/quux'.toItemKey()));
      });
    });

    describe("fromString()", function () {
      beforeEach(function () {
        item = Item.fromString('foo/bar/baz/quux');
      });

      it("should return Item instance", function () {
        expect(Item.mixedBy(item)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(item.entityKey.equals('foo/bar/baz/quux'.toItemKey()));
      });
    });

    describe("create()", function () {
      it("should initialize listeningPath", function () {
        expect(item.listeningPath)
        .toEqual('entity.document.foo.bar.baz.quux'.toPath());
      });

      it("should initialize triggerPaths", function () {
        expect(item.triggerPaths).toContain(
            "entity.document.__field.__field/itemIdType.options.string".toPath(),
            "entity.document.__field.__field/itemValueType.options.string".toPath());
      });

      describe("when entityKey is cached", function () {
        var ItemKey,
            itemKey,
            item,
            result;

        beforeAll(function () {
          ItemKey = $oop.getClass('test.$entity.Item.ItemKey')
          .blend($entity.ItemKey)
          .blend($utils.StringifyCached);
        });

        beforeEach(function () {
          itemKey = ItemKey.fromComponents('foo', 'bar', 'baz', 'quux');
          item = $entity.Item.fromEntityKey(itemKey);

          result = $entity.Item.fromEntityKey(itemKey);
        });

        it("should retrieve cached instance", function () {
          expect(result).toBe(item);
        });
      });
    });
  });

  describe("ItemKey", function () {
    var itemKey,
        result;

    describe("toItem()", function () {
      beforeEach(function () {
        itemKey = 'foo/bar/baz/quux'.toItemKey();
        result = itemKey.toItem();
      });

      it("should return Item instance", function () {
        expect($entity.Item.mixedBy(result)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(result.entityKey).toBe(itemKey);
      });
    });
  });

  describe("Entity", function () {
    var entity;

    describe("create", function () {
      describe("when passing ItemKey", function () {
        beforeEach(function () {
          entity = $entity.Entity.fromEntityKey('foo/bar/baz/quux'.toItemKey());
        });

        it("should return Item instance", function () {
          expect($entity.Item.mixedBy(entity)).toBeTruthy();
        });
      });
    });
  });
});

describe("String", function () {
  var result;

  describe("toItem()", function () {
    var item;

    beforeEach(function () {
      item = $entity.Item.fromString('foo/bar/baz/quux');
      spyOn($entity.Item, 'create').and.returnValue(item);
      result = 'foo/bar/baz/quux'.toItem();
    });

    it("should create a Item instance", function () {
      expect($entity.Item.create).toHaveBeenCalledWith({
        entityKey: 'foo/bar/baz/quux'.toItemKey()
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(item);
    });
  });
});

describe("Array", function () {
  var result;

  describe("toItem()", function () {
    var components,
        item;

    beforeEach(function () {
      components = ['foo', 'bar', 'baz', 'quux'];
      item = $entity.Item.fromComponents('foo', 'bar', 'baz', 'quux');
      spyOn($entity.Item, 'create').and.returnValue(item);
      result = components.toItem();
    });

    it("should create a Item instance", function () {
      expect($entity.Item.create).toHaveBeenCalledWith({
        entityKey: 'foo/bar/baz/quux'.toItemKey()
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(item);
    });
  });
});
