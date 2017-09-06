"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("Field", function () {
    var Field,
        field,
        result;

    beforeEach(function () {
      Field = $oop.getClass('test.$entity.Field.Field')
      .mix($entity.Field);
      field = Field.fromEntityKey('foo/bar/baz'.toFieldKey());
    });
    
    describe("fromComponents()", function () {
      beforeEach(function () {
        field = Field.fromComponents('foo', 'bar', 'baz');
      });

      it("should return Field instance", function () {
        expect(Field.mixedBy(field)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(field.entityKey.equals('foo/bar/baz'.toFieldKey()));
      });
    });

    describe("fromString()", function () {
      beforeEach(function () {
        field = Field.fromString('foo/bar/baz');
      });

      it("should return Field instance", function () {
        expect(Field.mixedBy(field)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(field.entityKey.equals('foo/bar/baz'.toFieldKey()));
      });
    });

    describe("create()", function () {
      it("should initialize listeningPath", function () {
        expect(field.listeningPath)
        .toEqual('entity.document.foo.bar.baz'.toPath());
      });

      it("should initialize triggerPaths", function () {
        expect(field.triggerPaths)
        .toEqual([
          'entity.document.foo.bar.baz'.toPath(),
          'entity.document.__field.foo\/baz'.toPath()
        ]);
      });
    });
  });


  describe("FieldKey", function () {
    var fieldKey,
        result;

    describe("toField()", function () {
      beforeEach(function () {
        fieldKey = 'foo/bar/baz'.toFieldKey();
        result = fieldKey.toField();
      });

      it("should return Field instance", function () {
        expect($entity.Field.mixedBy(result)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(result.entityKey).toBe(fieldKey);
      });
    });
  });

  describe("Entity", function () {
    var entity;

    describe("create", function () {
      describe("when passing FieldKey", function () {
        beforeEach(function () {
          entity = $entity.Entity.fromEntityKey('foo/bar/baz'.toFieldKey());
        });

        it("should return Field instance", function () {
          expect($entity.Field.mixedBy(entity)).toBeTruthy();
        });
      });
    });
  });
});
