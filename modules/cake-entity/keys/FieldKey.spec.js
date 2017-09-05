"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'],
    $entity = window['cake-entity'];

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

    describe("create()", function () {
      it("should initialize listeningPath", function () {
        expect(fieldKey.listeningPath)
        .toEqual('entity.document.foo.bar.baz'.toPath());
      });

      it("should initialize triggerPaths", function () {
        expect(fieldKey.triggerPaths)
        .toEqual([
          'entity.document.foo.bar.baz'.toPath(),
          'entity-meta.field.foo/baz'.toPath(),
          'entity-meta.field'.toPath()
        ]);
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

    describe("getMetaKey()", function () {
      beforeEach(function () {
        result = fieldKey.getMetaKey();
      });

      it("should return a MetaKey", function () {
        expect($entity.MetaKey.mixedBy(result)).toBeTruthy();
      });

      it("should return meta key to the field", function () {
        expect(result.equals($entity.MetaKey.fromString('field/foo\\/baz')))
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

      it("should return config key to the document type", function () {
        expect(result.equals('document.foo.bar.baz'.toPath()));
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
