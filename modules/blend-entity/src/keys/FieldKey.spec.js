"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("FieldKey", function () {
    var FieldKey,
        fieldKey,
        result;

    beforeAll(function () {
      FieldKey = $oop.createClass('test.$entity.FieldKey.FieldKey')
      .blend($entity.FieldKey)
      .build();
      FieldKey.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      fieldKey = FieldKey.create({
        parentKey: 'foo/bar'.toDocumentKey(),
        entityName: 'baz'
      });
    });

    describe(".fromEntityPath()", function () {
      it("should return a FieldKey instance", function () {
        fieldKey = FieldKey.fromEntityPath('document.foo.bar.baz'.toTreePath());
        expect(FieldKey.mixedBy(fieldKey)).toBeTruthy();
      });

      it("should set parentKey & entityName properties", function () {
        fieldKey = FieldKey.fromEntityPath('document.foo.bar.baz'.toTreePath());
        expect(fieldKey.parentKey).toEqual('foo/bar'.toDocumentKey());
        expect(fieldKey.entityName).toBe('baz');
      });

      it("should pass additional properties to create", function () {
        fieldKey = FieldKey.fromEntityPath('document.foo.bar.baz'.toTreePath(),
            {bar: 'baz'});
        expect(fieldKey.bar).toBe('baz');
      });
    });

    describe(".fromString()", function () {
      it("should return a FieldKey instance", function () {
        fieldKey = FieldKey.fromReference('foo/bar/\\/baz');
        expect(FieldKey.mixedBy(fieldKey)).toBeTruthy();
      });

      it("should set parentKey & entityName properties", function () {
        fieldKey = FieldKey.fromReference('foo/bar/\\/baz');
        expect(fieldKey.parentKey).toEqual('foo/bar'.toDocumentKey());
        expect(fieldKey.entityName).toBe('/baz');
      });

      it("should pass additional properties to create", function () {
        fieldKey = FieldKey.fromReference('foo/bar/\\/baz', {bar: 'baz'});
        expect(fieldKey.bar).toBe('baz');
      });
    });

    describe(".fromComponents()", function () {
      it("should return a FieldKey instance", function () {
        fieldKey = FieldKey.fromComponents('foo', 'bar', 'baz');
        expect(FieldKey.mixedBy(fieldKey)).toBeTruthy();
      });

      it("should set parentKey & entityName properties", function () {
        fieldKey = FieldKey.fromComponents('foo', 'bar', 'baz');
        expect(fieldKey.parentKey).toEqual('foo/bar'.toDocumentKey());
        expect(fieldKey.entityName).toBe('baz');
      });

      it("should pass additional properties to create", function () {
        fieldKey = FieldKey.fromComponents('foo', 'bar', 'baz', {bar: 'baz'});
        expect(fieldKey.bar).toBe('baz');
      });
    });

    describe(".create()", function () {
      describe("when documentType is static", function () {
        beforeEach(function () {
          fieldKey = $entity.FieldKey.create({
            parentKey: '__foo/bar'.toDocumentKey(),
            entityName: 'baz'
          });
        });

        it("should mix StringifyCached into instance", function () {
          expect($utils.StringifyCached.mixedBy(fieldKey)).toBeTruthy();
        });
      });
    });

    describe("#equals()", function () {
      describe("for matching keys", function () {
        it("should return true", function () {
          expect('foo/bar/baz'.toFieldKey().equals('foo/bar/baz'.toFieldKey()))
          .toBe(true);
        });
      });

      describe("for non-matching keys", function () {
        it("should return false", function () {
          expect('foo/bar/baz'.toFieldKey().equals('bar/baz'.toDocumentKey()))
          .toBe(false);
          expect('foo/bar/baz'.toFieldKey().equals('bar/baz/foo'.toFieldKey()))
          .toBe(false);
        });
      });
    });

    describe("#getAttributeDocumentKey()", function () {
      beforeEach(function () {
        result = fieldKey.getAttributeDocumentKey();
      });

      it("should return an AttributeDocumentKey", function () {
        expect($entity.AttributeDocumentKey.mixedBy(result)).toBeTruthy();
      });

      it("should return attribute document key to the field", function () {
        expect(result.equals($entity.DocumentKey.fromReference('__field/foo\\/baz')))
        .toBeTruthy();
      });
    });

    describe("#getEntityPath()", function () {
      beforeEach(function () {
        result = fieldKey.getEntityPath();
      });

      it("should return a Path", function () {
        expect($data.TreePath.mixedBy(result)).toBeTruthy();
      });

      it("should return entity path to the field", function () {
        expect(result.equals('document.foo.bar.baz'.toTreePath()));
      });

      it("should set _entityPath property", function () {
        expect(fieldKey._entityPath).toBe(result);
      });
    });

    describe("#getItemKey()", function () {
      var itemKey;

      beforeEach(function () {
        itemKey = {};
        spyOn(fieldKey, 'getChildKey').and.returnValue(itemKey);
        result = fieldKey.getItemKey('baz');
      });

      it("should invoke getChildKey()", function () {
        expect(fieldKey.getChildKey).toHaveBeenCalledWith('baz');
      });

      it("should return child key", function () {
        expect(result).toBe(itemKey);
      });
    });

    describe("#toString()", function () {
      it("should return string representation", function () {
        expect(fieldKey.toString()).toBe('foo/bar/baz');
      });

      it("should escape delimiters in components", function () {
        expect(['foo/', '/bar', 'ba/z'].toFieldKey().toString())
        .toBe('foo\\//\\/bar/ba\\/z');
      });
    });
  });

  describe("EntityKey", function () {
    var result;

    describe(".create()", function () {
      describe("when passing DocumentKey for parentKey", function () {
        beforeEach(function () {
          result = $entity.EntityKey.create({
            parentKey: 'foo/bar'.toDocumentKey(),
            entityName: 'baz'
          });
        });

        it("should return FieldKey instance", function () {
          expect($entity.FieldKey.mixedBy(result)).toBeTruthy();
        });
      });
    });
  });
});

describe("String", function () {
  describe("#toFieldKey()", function () {
    var fieldKey;

    it("should create a FieldKey instance", function () {
      fieldKey = 'foo/bar/baz'.toFieldKey();
      expect($entity.FieldKey.mixedBy(fieldKey)).toBeTruthy();
    });

    it("should set FieldKey properties", function () {
      fieldKey = 'foo/bar/baz'.toFieldKey();
      expect(fieldKey.parentKey).toEqual('foo/bar'.toDocumentKey());
      expect(fieldKey.entityName).toBe('baz');
    });

    it("should pass additional properties to create", function () {
      fieldKey = 'foo/bar/baz'.toFieldKey({bar: 'baz'});
      expect(fieldKey.bar).toBe('baz');
    });
  });
});

describe("Array", function () {
  describe("#toFieldKey()", function () {
    var components,
        fieldKey;

    beforeEach(function () {
      components = ['foo', 'bar', 'baz'];
    });

    it("should create a FieldKey instance", function () {
      fieldKey = components.toFieldKey();
      expect($entity.FieldKey.mixedBy(fieldKey)).toBeTruthy();
    });

    it("should set FieldKey properties", function () {
      fieldKey = components.toFieldKey();
      expect(fieldKey.parentKey).toEqual('foo/bar'.toDocumentKey());
      expect(fieldKey.entityName).toBe('baz');
    });

    it("should pass additional properties to create", function () {
      fieldKey = components.toFieldKey({bar: 'baz'});
      expect(fieldKey.bar).toBe('baz');
    });
  });
});
