"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'],
    $entity = window['cake-entity'];

describe("$assert", function () {
  var documentKey;

  beforeEach(function () {
    documentKey = $entity.FieldKey.fromComponents('foo', 'bar', 'baz');
    spyOn($assert, 'assert').and.callThrough();
  });

  describe("isFieldKey()", function () {
    it("should pass message to assert", function () {
      $assert.isFieldKey(documentKey, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-FieldKey", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isFieldKey({});
        }).toThrow();
      });
    });
  });

  describe("isFieldKeyOptional()", function () {
    it("should pass message to assert", function () {
      $assert.isFieldKeyOptional(documentKey, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-chain", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isFieldKeyOptional({});
        }).toThrow();
      });
    });
  });
});

describe("$entity", function () {
  describe("FieldKey", function () {
    var FieldKey,
        fieldKey,
        result;

    beforeEach(function () {
      FieldKey = $oop.getClass('test.$entity.FieldKey.FieldKey')
      .mix($entity.FieldKey);
      fieldKey = FieldKey.create({
        documentKey: 'foo/bar'.toDocumentKey(),
        fieldName: 'baz'
      });
    });

    describe("fromComponents()", function () {
      beforeEach(function () {
        fieldKey = FieldKey.fromComponents('foo', 'bar', 'baz');
      });

      it("should return a FieldKey instance", function () {
        expect(FieldKey.mixedBy(fieldKey)).toBeTruthy();
      });

      it("should set documentKey & fieldName properties", function () {
        expect(fieldKey.documentKey).toEqual('foo/bar'.toDocumentKey());
        expect(fieldKey.fieldName).toBe('baz');
      });
    });

    describe("fromString()", function () {
      beforeEach(function () {
        fieldKey = FieldKey.fromString('foo/bar/\\/baz');
      });

      it("should return a FieldKey instance", function () {
        expect(FieldKey.mixedBy(fieldKey)).toBeTruthy();
      });

      it("should set documentKey & fieldName properties", function () {
        expect(fieldKey.documentKey).toEqual('foo/bar'.toDocumentKey());
        expect(fieldKey.fieldName).toBe('/baz');
      });
    });

    describe("create()", function () {
      describe("from _entityPath", function () {
        beforeEach(function () {
          fieldKey = FieldKey.create({
            _entityPath: 'document.foo.bar.baz'.toPath()
          });
        });

        it("should set documentKey & fieldName properties", function () {
          expect(fieldKey.documentKey).toEqual('foo/bar'.toDocumentKey());
          expect(fieldKey.fieldName).toBe('baz');
        });
      });

      describe("when documentType is static", function () {
        beforeEach(function () {
          fieldKey = $entity.FieldKey.create({
            documentKey: '__foo/bar'.toDocumentKey(),
            fieldName: 'baz'
          });
        });

        it("should mix StringifyCached into instance", function () {
          expect($utils.StringifyCached.mixedBy(fieldKey)).toBeTruthy();
        });
      });
    });

    describe("equals()", function () {
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

    describe("getAttributeDocumentKey()", function () {
      beforeEach(function () {
        result = fieldKey.getAttributeDocumentKey();
      });

      it("should return an AttributeDocumentKey", function () {
        expect($entity.AttributeDocumentKey.mixedBy(result)).toBeTruthy();
      });

      it("should return attribute document key to the field", function () {
        expect(result.equals($entity.DocumentKey.fromString('__field/foo\\/baz')))
        .toBeTruthy();
      });
    });

    describe("getEntityPath()", function () {
      beforeEach(function () {
        result = fieldKey.getEntityPath();
      });

      it("should return a Path", function () {
        expect($data.Path.mixedBy(result)).toBeTruthy();
      });

      it("should return entity path to the field", function () {
        expect(result.equals('document.foo.bar.baz'.toPath()));
      });

      it("should set _entityPath property", function () {
        expect(fieldKey._entityPath).toBe(result);
      });
    });

    describe("getItemKey()", function () {
      beforeEach(function () {
        result = fieldKey.getItemKey('quux');
      });

      it("should return an ItemKey", function () {
        expect($entity.ItemKey.mixedBy(result)).toBeTruthy();
      });

      it("should return item in collection", function () {
        expect(result).toEqual('foo/bar/baz/quux'.toItemKey());
      });
    });

    describe("getFieldType()", function () {
      var attributeKey;

      beforeEach(function () {
        attributeKey = $entity.AttributeDocumentKey.fromDocumentIdComponents(
            '__field', ['user', 'name']).getFieldKey('fieldType');
        $entity.entities.setNode(attributeKey.getEntityPath(), 'foo');

        result = 'user/1/name'.toFieldKey().getFieldType();
      });

      afterEach(function () {
        $entity.entities.deleteNode(attributeKey.getEntityPath());
      });

      it("should retrieve fieldType attribute", function () {
        expect(result).toBe('foo');
      });

      describe("when no fieldType is set for field", function () {
        beforeEach(function () {
          $entity.entities.deleteNode(attributeKey.getEntityPath());
          result = 'user/1/name'.toFieldKey().getFieldType();
        });

        it("should return default", function () {
          expect(result).toBe('primitive');
        });
      });
    });

    describe("getFieldTypeKey()", function () {
      beforeEach(function () {
        spyOn(fieldKey, 'getFieldType').and.returnValue('FOO');
        result = fieldKey.getFieldTypeKey();
      });

      it("should return key to fieldType", function () {
        expect(result)
        .toEqual("__field/__field\\/fieldType/options/FOO".toItemKey());
      });
    });

    describe("toString()", function () {
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

    describe("create()", function () {
      describe("when passing field entity path", function () {
        beforeEach(function () {
          result = $entity.EntityKey.create({
            _entityPath: 'document.foo.bar.baz'.toPath()
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
  var result;

  describe("toFieldKey()", function () {
    var fieldKey;

    beforeEach(function () {
      fieldKey = $entity.FieldKey.fromString('foo/bar/baz');
      spyOn($entity.FieldKey, 'create').and.returnValue(fieldKey);
      result = 'foo/bar/baz'.toFieldKey();
    });

    it("should create a FieldKey instance", function () {
      expect($entity.FieldKey.create).toHaveBeenCalledWith({
        documentKey: 'foo/bar'.toDocumentKey(),
        fieldName: 'baz'
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(fieldKey);
    });
  });
});

describe("Array", function () {
  var result;

  describe("toFieldKey()", function () {
    var components,
        fieldKey;

    beforeEach(function () {
      components = ['foo', 'bar', 'baz'];
      fieldKey = $entity.FieldKey.fromComponents('foo', 'bar', 'baz');
      spyOn($entity.FieldKey, 'create').and.returnValue(fieldKey);
      result = components.toFieldKey();
    });

    it("should create a FieldKey instance", function () {
      expect($entity.FieldKey.create).toHaveBeenCalledWith({
        documentKey: 'foo/bar'.toDocumentKey(),
        fieldName: 'baz'
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(fieldKey);
    });
  });
});
