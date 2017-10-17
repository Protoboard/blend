"use strict";

var $assert = window['blend-assert'],
    $oop = window['blend-oop'],
    $data = window['blend-data'],
    $entity = window['blend-entity'];

describe("$assert", function () {
  var documentKey;

  beforeEach(function () {
    documentKey = $entity.DocumentKey.fromComponents('foo', 'bar');
    spyOn($assert, 'assert').and.callThrough();
  });

  describe("isDocumentKey()", function () {
    it("should pass message to assert", function () {
      $assert.isDocumentKey(documentKey, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-DocumentKey", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isDocumentKey({});
        }).toThrow();
      });
    });
  });

  describe("isDocumentKeyOptional()", function () {
    it("should pass message to assert", function () {
      $assert.isDocumentKeyOptional(documentKey, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-DocumentKey", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isDocumentKeyOptional({});
        }).toThrow();
      });
    });
  });
});

describe("$entity", function () {
  describe("DocumentKey", function () {
    var DocumentKey,
        documentKey,
        result;

    beforeAll(function () {
      DocumentKey = $oop.getClass('test.$entity.DocumentKey.DocumentKey')
      .blend($entity.DocumentKey);
    });

    beforeEach(function () {
      documentKey = DocumentKey.create({
        documentType: 'foo',
        documentId: 'bar'
      });
    });

    describe("fromComponents()", function () {
      beforeEach(function () {
        documentKey = DocumentKey.fromComponents('foo', 'bar');
      });

      it("should return a DocumentKey instance", function () {
        expect(DocumentKey.mixedBy(documentKey)).toBeTruthy();
      });

      it("should set documentType & documentId properties", function () {
        expect(documentKey.documentType).toBe('foo');
        expect(documentKey.documentId).toBe('bar');
      });
    });

    describe("fromString()", function () {
      beforeEach(function () {
        documentKey = DocumentKey.fromString('\\/bar/baz');
      });

      it("should return a DocumentKey instance", function () {
        expect(DocumentKey.mixedBy(documentKey)).toBeTruthy();
      });

      it("should set documentType & documentId properties", function () {
        expect(documentKey.documentType).toBe('/bar');
        expect(documentKey.documentId).toBe('baz');
      });
    });

    describe("create()", function () {
      describe("from _entityPath", function () {
        beforeEach(function () {
          documentKey = DocumentKey.create({
            _entityPath: 'document.foo.bar'.toPath()
          });
        });

        it("should set documentType & documentId properties", function () {
          expect(documentKey.documentType).toBe('foo');
          expect(documentKey.documentId).toBe('bar');
        });
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
        expect(result.equals($entity.DocumentKey.fromString('__document/foo')))
        .toBeTruthy();
      });
    });

    describe("getChildKey()", function () {
      beforeEach(function () {
        result = documentKey.getChildKey('baz');
      });

      it("should return a FieldKey", function () {
        expect($entity.FieldKey.mixedBy(result)).toBeTruthy();
      });

      it("should return field in document", function () {
        expect(result).toEqual('foo/bar/baz'.toFieldKey());
      });
    });

    describe("getEntityPath()", function () {
      beforeEach(function () {
        result = documentKey.getEntityPath();
      });

      it("should return a Path", function () {
        expect($data.Path.mixedBy(result)).toBeTruthy();
      });

      it("should return entity path to the document", function () {
        expect(result.equals('document.foo.bar'.toPath()));
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
      describe("when passing document entity path", function () {
        beforeEach(function () {
          result = $entity.EntityKey.create({
            _entityPath: 'document.foo.bar'.toPath()
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
  var result;

  describe("toDocumentKey()", function () {
    var documentKey;

    beforeEach(function () {
      documentKey = $entity.DocumentKey.fromString('foo/bar');
      spyOn($entity.DocumentKey, 'create').and.returnValue(documentKey);
      result = 'foo/bar'.toDocumentKey();
    });

    it("should create a DocumentKey instance", function () {
      expect($entity.DocumentKey.create).toHaveBeenCalledWith({
        documentType: 'foo',
        documentId: 'bar'
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(documentKey);
    });
  });
});

describe("Array", function () {
  var result;

  describe("toDocumentKey()", function () {
    var components,
        documentKey;

    beforeEach(function () {
      components = ['foo', 'bar'];
      documentKey = 'foo/bar'.toDocumentKey();
      spyOn($entity.DocumentKey, 'create').and.returnValue(documentKey);
      result = components.toDocumentKey();
    });

    it("should create a DocumentKey instance", function () {
      expect($entity.DocumentKey.create).toHaveBeenCalledWith({
        documentType: 'foo',
        documentId: 'bar'
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(documentKey);
    });
  });
});
