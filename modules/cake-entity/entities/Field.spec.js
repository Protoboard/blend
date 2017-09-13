"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-utils'],
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
          'entity.document.__field.foo/baz'.toPath(),
          "entity.document.__field.__field/fieldType.options.primitive".toPath()
        ]);
      });

      describe("when entityKey is cached", function () {
        var FieldKey,
            fieldKey,
            field,
            result;

        beforeEach(function () {
          FieldKey = $oop.getClass('test.$entity.Field.FieldKey')
          .mix($entity.FieldKey)
          .mix($utils.StringifyCached);
          fieldKey = FieldKey.fromComponents('foo', 'bar', 'baz');
          field = $entity.Field.fromEntityKey(fieldKey);

          result = $entity.Field.fromEntityKey(fieldKey);
        });

        it("should retrieve cached instance", function () {
          expect(result).toBe(field);
        });
      });
    });

    describe("getItem()", function () {
      var item;

      beforeEach(function () {
        item = $entity.Item.fromEntityKey('foo/bar/baz/quux'.toItemKey());
        result = field.getItem('quux');
      });

      it("should return an Item instance", function () {
        expect($entity.Item.mixedBy(result)).toBeTruthy();
      });

      it("should set item components", function () {
        expect(result).toEqual(item);
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

describe("String", function () {
  var result;

  describe("toField()", function () {
    var field;

    beforeEach(function () {
      field = $entity.Field.fromString('foo/bar/baz');
      spyOn($entity.Field, 'create').and.returnValue(field);
      result = 'foo/bar/baz'.toField();
    });

    it("should create a Field instance", function () {
      expect($entity.Field.create).toHaveBeenCalledWith({
        entityKey: 'foo/bar/baz'.toFieldKey()
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(field);
    });
  });
});

describe("Array", function () {
  var result;

  describe("toField()", function () {
    var components,
        field;

    beforeEach(function () {
      components = ['foo', 'bar', 'baz'];
      field = $entity.Field.fromComponents('foo', 'bar', 'baz');
      spyOn($entity.Field, 'create').and.returnValue(field);
      result = components.toField();
    });

    it("should create a Field instance", function () {
      expect($entity.Field.create).toHaveBeenCalledWith({
        entityKey: 'foo/bar/baz'.toFieldKey()
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(field);
    });
  });
});
