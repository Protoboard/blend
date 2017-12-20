"use strict";

var $assert = window['blend-assert'],
    $oop = window['blend-oop'],
    $data = window['blend-data'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("DocumentKey", function () {
    var DocumentKey,
        documentKey,
        result;

    beforeAll(function () {
      DocumentKey = $oop.createClass('test.$entity.DocumentKey.DocumentKey')
      .blend($entity.DocumentKey)
      .build();
      DocumentKey.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      documentKey = DocumentKey.create({
        documentType: 'foo',
        entityName: 'bar'
      });
    });

    describe("fromEntityPath()", function () {
      it("should return a DocumentKey instance", function () {
        documentKey = DocumentKey.fromEntityPath('document.bar.baz'.toTreePath());
        expect(DocumentKey.mixedBy(documentKey)).toBeTruthy();
      });

      it("should set documentType & entityName properties", function () {
        documentKey = DocumentKey.fromEntityPath('document.bar.baz'.toTreePath());
        expect(documentKey.documentType).toBe('bar');
        expect(documentKey.entityName).toBe('baz');
      });

      it("should pass additional properties to create", function () {
        documentKey = DocumentKey.fromEntityPath('document.bar.baz'.toTreePath(),
            {bar: 'baz'});
        expect(documentKey.bar).toBe('baz');
      });
    });

    describe("fromString()", function () {
      it("should return a DocumentKey instance", function () {
        documentKey = DocumentKey.fromReference('\\/bar/baz');
        expect(DocumentKey.mixedBy(documentKey)).toBeTruthy();
      });

      it("should set documentType & entityName properties", function () {
        documentKey = DocumentKey.fromReference('\\/bar/baz');
        expect(documentKey.documentType).toBe('/bar');
        expect(documentKey.entityName).toBe('baz');
      });

      it("should pass additional properties to create", function () {
        documentKey = DocumentKey.fromReference('\\/bar/baz', {bar: 'baz'});
        expect(documentKey.bar).toBe('baz');
      });
    });

    describe("fromComponents()", function () {
      it("should return a DocumentKey instance", function () {
        documentKey = DocumentKey.fromComponents('foo', 'bar');
        expect(DocumentKey.mixedBy(documentKey)).toBeTruthy();
      });

      it("should set documentType & entityName properties", function () {
        documentKey = DocumentKey.fromComponents('foo', 'bar');
        expect(documentKey.documentType).toBe('foo');
        expect(documentKey.entityName).toBe('bar');
      });

      it("should pass additional properties to create", function () {
        documentKey = DocumentKey.fromComponents('foo', 'bar', {bar: 'baz'});
        expect(documentKey.bar).toBe('baz');
      });
    });

    describe("equals()", function () {
      describe("for matching keys", function () {
        it("should return true", function () {
          expect('foo/bar'.toDocumentKey().equals('foo/bar'.toDocumentKey()))
          .toBe(true);
          expect('bar/baz'.toDocumentKey().equals('bar/baz'.toDocumentKey()))
          .toBe(true);
        });
      });

      describe("for non-matching keys", function () {
        it("should return false", function () {
          expect('foo/bar'.toDocumentKey().equals('bar/baz'.toDocumentKey()))
          .toBe(false);
          expect('bar/baz'.toDocumentKey().equals('baz/foo'.toDocumentKey()))
          .toBe(false);
        });
      });
    });

    describe("getAttributeDocumentKey()", function () {
      beforeEach(function () {
        result = documentKey.getAttributeDocumentKey();
      });

      it("should return an AttributeDocumentKey", function () {
        expect($entity.AttributeDocumentKey.mixedBy(result)).toBeTruthy();
      });

      it("should return attribute document key to the document type", function () {
        expect(result.equals($entity.DocumentKey.fromReference('__document/foo')))
        .toBeTruthy();
      });
    });

    describe("getEntityPath()", function () {
      beforeEach(function () {
        result = documentKey.getEntityPath();
      });

      it("should return a Path", function () {
        expect($data.TreePath.mixedBy(result)).toBeTruthy();
      });

      it("should return entity path to the document", function () {
        expect(result.equals('document.foo.bar'.toTreePath()));
      });

      it("should set _entityPath property", function () {
        expect(documentKey._entityPath).toBe(result);
      });
    });

    describe("getNodeType()", function () {
      var attributeKey;

      describe("when no nodeType is set", function () {
        beforeEach(function () {
          attributeKey = documentKey.getAttributeDocumentKey()
          .getFieldKey('nodeType');
          $entity.entities.deleteNode(attributeKey.getEntityPath());
          result = documentKey.getNodeType();
        });

        it("should return default", function () {
          expect(result).toBe('branch');
        });
      });
    });

    describe("getFieldNames()", function () {
      var attributeKey;

      beforeEach(function () {
        attributeKey = documentKey.getAttributeDocumentKey()
        .getFieldKey('fields');
        $entity.entities.setNode(attributeKey.getEntityPath(), [1, 2, 3, 4]);

        result = documentKey.getFieldNames();
      });

      afterEach(function () {
        $entity.entities.deleteNode(attributeKey.getEntityPath());
      });

      it("should retrieve nodeType attribute", function () {
        expect(result).toEqual([1, 2, 3, 4]);
      });
    });

    describe("getFieldKey()", function () {
      var fieldKey;

      beforeEach(function () {
        fieldKey = {};
        spyOn(documentKey, 'getChildKey').and.returnValue(fieldKey);
        result = documentKey.getFieldKey('baz');
      });

      it("should invoke getChildKey()", function () {
        expect(documentKey.getChildKey).toHaveBeenCalledWith('baz');
      });

      it("should return child key", function () {
        expect(result).toBe(fieldKey);
      });
    });

    describe("toString()", function () {
      it("should return string representation", function () {
        expect(documentKey.toString()).toBe('foo/bar');
      });

      it("should escape delimiters in components", function () {
        expect(['foo/', '/bar'].toDocumentKey().toString())
        .toBe('foo\\//\\/bar');
      });
    });
  });

  describe("EntityKey", function () {
    var result;

    describe("create()", function () {
      describe("when passing entity w/o parentKey but w/ documentType", function () {
        beforeEach(function () {
          result = $entity.EntityKey.create({
            documentType: 'foo',
            entityName: 'bar'
          });
        });

        it("should return DocumentKey instance", function () {
          expect($entity.DocumentKey.mixedBy(result)).toBeTruthy();
        });
      });
    });
  });
});

describe("String", function () {
  describe("toDocumentKey()", function () {
    var documentKey;

    it("should create a DocumentKey instance", function () {
      documentKey = 'foo/bar'.toDocumentKey();
      expect($entity.DocumentKey.mixedBy(documentKey)).toBeTruthy();
    });

    it("should set DocumentKey properties", function () {
      documentKey = 'foo/bar'.toDocumentKey();
      expect(documentKey.documentType).toBe('foo');
      expect(documentKey.entityName).toBe('bar');
    });

    it("should pass additional properties to create", function () {
      documentKey = 'foo/bar'.toDocumentKey({bar: 'baz'});
      expect(documentKey.bar).toBe('baz');
    });
  });
});

describe("Array", function () {
  describe("toDocumentKey()", function () {
    var components,
        documentKey;

    beforeEach(function () {
      components = ['foo', 'bar'];
    });

    it("should create a DocumentKey instance", function () {
      documentKey = components.toDocumentKey();
      expect($entity.DocumentKey.mixedBy(documentKey)).toBeTruthy();
    });

    it("should return created instance", function () {
      documentKey = components.toDocumentKey();
      expect(documentKey.documentType).toBe('foo');
      expect(documentKey.entityName).toBe('bar');
    });

    it("should pass additional properties to create", function () {
      documentKey = components.toDocumentKey({bar: 'baz'});
      expect(documentKey.bar).toBe('baz');
    });
  });
});
