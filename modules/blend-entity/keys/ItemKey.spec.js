"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("ItemKey", function () {
    var ItemKey,
        itemKey,
        result;

    beforeAll(function () {
      ItemKey = $oop.getClass('test.$entity.ItemKey.ItemKey')
      .blend($entity.ItemKey);
    });

    beforeEach(function () {
      itemKey = ItemKey.create({
        fieldKey: 'foo/bar/baz'.toFieldKey(),
        itemId: 'quux'
      });
    });

    describe("fromComponents()", function () {
      it("should return a ItemKey instance", function () {
        itemKey = ItemKey.fromComponents('foo', 'bar', 'baz', 'quux');
        expect(ItemKey.mixedBy(itemKey)).toBeTruthy();
      });

      it("should set fieldKey & itemId properties", function () {
        itemKey = ItemKey.fromComponents('foo', 'bar', 'baz', 'quux');
        expect(itemKey.fieldKey).toEqual('foo/bar/baz'.toFieldKey());
        expect(itemKey.itemId).toBe('quux');
      });

      it("should pass additional properties to create", function () {
        itemKey = ItemKey.fromComponents('foo', 'bar', 'baz', 'quux', {bar: 'baz'});
        expect(itemKey.bar).toBe('baz');
      });
    });

    describe("fromString()", function () {
      it("should return a ItemKey instance", function () {
        itemKey = ItemKey.fromString('foo/bar/baz/\\/quux');
        expect(ItemKey.mixedBy(itemKey)).toBeTruthy();
      });

      it("should set fieldKey & itemId properties", function () {
        itemKey = ItemKey.fromString('foo/bar/baz/\\/quux');
        expect(itemKey.fieldKey).toEqual('foo/bar/baz'.toFieldKey());
        expect(itemKey.itemId).toBe('/quux');
      });

      it("should pass additional properties to create", function () {
        itemKey = ItemKey.fromString('foo/bar/baz/\\/quux', {bar: 'baz'});
        expect(itemKey.bar).toBe('baz');
      });
    });

    describe("create()", function () {
      describe("from _entityPath", function () {
        beforeEach(function () {
          itemKey = ItemKey.create({
            _entityPath: 'document.foo.bar.baz.quux'.toTreePath()
          });
        });

        it("should set fieldKey & itemId properties", function () {
          expect(itemKey.fieldKey).toEqual('foo/bar/baz'.toFieldKey());
          expect(itemKey.itemId).toBe('quux');
        });
      });

      describe("when documentType is static", function () {
        beforeEach(function () {
          itemKey = $entity.ItemKey.create({
            fieldKey: '__foo/bar/baz'.toFieldKey(),
            itemId: 'quux'
          });
        });

        it("should mix StringifyCached into instance", function () {
          expect($utils.StringifyCached.mixedBy(itemKey)).toBeTruthy();
        });
      });
    });

    describe("equals()", function () {
      describe("for matching keys", function () {
        it("should return true", function () {
          expect('foo/bar/baz/quux'.toItemKey()
          .equals('foo/bar/baz/quux'.toItemKey()))
          .toBe(true);
        });
      });

      describe("for non-matching keys", function () {
        it("should return false", function () {
          expect('foo/bar/baz/quux'.toItemKey()
          .equals('bar/baz/quux/foo'.toItemKey()))
          .toBe(false);
        });
      });
    });

    describe("getAttributeDocumentKey()", function () {
      beforeEach(function () {
        result = itemKey.getAttributeDocumentKey();
      });

      it("should return an AttributeDocumentKey", function () {
        expect($entity.AttributeDocumentKey.mixedBy(result)).toBeTruthy();
      });

      it("should return attribute document key to parent field", function () {
        expect(result.equals($entity.DocumentKey.fromString('__field/foo\\/baz')))
        .toBeTruthy();
      });
    });

    describe("getEntityPath()", function () {
      beforeEach(function () {
        result = itemKey.getEntityPath();
      });

      it("should return a Path", function () {
        expect($data.TreePath.mixedBy(result)).toBeTruthy();
      });

      it("should return entity path to the item", function () {
        expect(result.equals('document.foo.bar.baz.quux'.toTreePath()));
      });

      it("should set _entityPath property", function () {
        expect(itemKey._entityPath).toBe(result);
      });
    });

    describe("getIdType()", function () {
      var attributeKey;

      beforeEach(function () {
        attributeKey = $entity.AttributeDocumentKey.fromDocumentIdComponents(
            '__field', ['user', 'friends']).getFieldKey('itemIdType');
        $entity.entities.setNode(attributeKey.getEntityPath(), 'reference');
        result = 'user/1/friends/Joe'.toItemKey().getIdType();
      });

      afterEach(function () {
        $entity.entities.deleteNode(attributeKey.getEntityPath());
      });

      it("should retrieve itemIdType attribute of field", function () {
        expect(result).toBe('reference');
      });
    });

    describe("getValueType()", function () {
      var attributeKey;

      beforeEach(function () {
        attributeKey = $entity.AttributeDocumentKey.fromDocumentIdComponents(
            '__field', ['user', 'friends']).getFieldKey('itemValueType');
        $entity.entities.setNode(attributeKey.getEntityPath(), 'reference');
        result = 'user/1/friends/Joe'.toItemKey().getValueType();
      });

      afterEach(function () {
        $entity.entities.deleteNode(attributeKey.getEntityPath());
      });

      it("should retrieve itemValueType attribute of field", function () {
        expect(result).toBe('reference');
      });
    });

    describe("toString()", function () {
      it("should return string representation", function () {
        expect(itemKey.toString()).toBe('foo/bar/baz/quux');
      });

      it("should escape delimiters in components", function () {
        expect(['foo/', '/bar', 'ba/z', 'qu/ux'].toItemKey().toString())
        .toBe('foo\\//\\/bar/ba\\/z/qu\\/ux');
      });
    });
  });

  describe("EntityKey", function () {
    var result;

    describe("create()", function () {
      describe("when passing field entity path", function () {
        beforeEach(function () {
          result = $entity.EntityKey.create({
            _entityPath: 'document.foo.bar.baz.quux'.toTreePath()
          });
        });

        it("should return ItemKey instance", function () {
          expect($entity.ItemKey.mixedBy(result)).toBeTruthy();
        });
      });
    });
  });
});

describe("String", function () {
  describe("toItemKey()", function () {
    var itemKey;

    it("should create a ItemKey instance", function () {
      itemKey = 'foo/bar/baz/quux'.toItemKey();
      expect($entity.ItemKey.mixedBy(itemKey)).toBeTruthy();
    });

    it("should set ItemKeyProperties", function () {
      itemKey = 'foo/bar/baz/quux'.toItemKey();
      expect(itemKey.fieldKey).toEqual('foo/bar/baz'.toFieldKey());
      expect(itemKey.itemId).toBe('quux');
    });

    it("should pass additional properties to create", function () {
      itemKey = 'foo/bar/baz/quux'.toItemKey({bar: 'baz'});
      expect(itemKey.bar).toBe('baz');
    });
  });
});

describe("Array", function () {
  describe("toItemKey()", function () {
    var components,
        itemKey;

    beforeEach(function () {
      components = ['foo', 'bar', 'baz', 'quux'];
    });

    it("should create a ItemKey instance", function () {
      itemKey = components.toItemKey();
      expect($entity.ItemKey.mixedBy(itemKey)).toBeTruthy();
    });

    it("should return created instance", function () {
      itemKey = components.toItemKey();
      expect(itemKey.fieldKey).toEqual('foo/bar/baz'.toFieldKey());
      expect(itemKey.itemId).toBe('quux');
    });

    it("should pass additional properties to create", function () {
      itemKey = components.toItemKey({bar: 'baz'});
      expect(itemKey.bar).toBe('baz');
    });
  });
});
