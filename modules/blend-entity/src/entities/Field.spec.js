"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("Field", function () {
    var Field,
        field,
        result;

    beforeAll(function () {
      Field = $oop.createClass('test.$entity.Field.Field')
      .blend($entity.Field)
      .build();
      Field.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      field = Field.fromEntityKey('foo/bar/baz'.toFieldKey());
    });

    describe("fromComponents()", function () {
      it("should return Field instance", function () {
        field = Field.fromComponents('foo', 'bar', 'baz');
        expect(Field.mixedBy(field)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        field = Field.fromComponents('foo', 'bar', 'baz');
        expect(field.entityKey.equals('foo/bar/baz'.toFieldKey()));
      });

      it("should pass additional properties to create", function () {
        field = Field.fromComponents('foo', 'bar', 'baz', {bar: 'baz'});
        expect(field.bar).toBe('baz');
      });
    });

    describe("fromString()", function () {
      it("should return Field instance", function () {
        field = Field.fromReference('foo/bar/baz');
        expect(Field.mixedBy(field)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        field = Field.fromReference('foo/bar/baz');
        expect(field.entityKey.equals('foo/bar/baz'.toFieldKey()));
      });

      it("should pass additional properties to create", function () {
        field = Field.fromReference('foo/bar/baz', {bar: 'baz'});
        expect(field.bar).toBe('baz');
      });
    });

    describe("create()", function () {
      it("should initialize triggerPaths", function () {
        it("should initialize triggerPaths", function () {
          expect(field.triggerPaths).toContain(
              'entity.document.__field.__field/valueType.options.string'.toTreePath());
        });
      });

      describe("when entityKey is cached", function () {
        var FieldKey,
            fieldKey,
            field,
            result;

        beforeAll(function () {
          FieldKey = $oop.createClass('test.$entity.Field.FieldKey')
          .blend($entity.FieldKey)
          .blend($utils.StringifyCached)
          .build();
        });

        beforeEach(function () {
          fieldKey = FieldKey.fromComponents('foo', 'bar', 'baz');
          field = $entity.Field.fromEntityKey(fieldKey);

          result = $entity.Field.fromEntityKey(fieldKey);
        });

        it("should retrieve cached instance", function () {
          expect(result).toBe(field);
        });
      });

      describe("when nodeType is leaf", function () {
        beforeEach(function () {
          $entity.entities
          .appendNode('document.__field'.toTreePath(), {
            'foo/baz': {
              nodeType: 'leaf'
            }
          });

          result = 'foo/bar/baz'.toField();
        });

        afterEach(function () {
          $entity.entities
          .deleteNode('document.__field.foo/baz'.toTreePath());
        });

        it("should return LeafNoded instance", function () {
          expect($entity.LeafNoded.mixedBy(result))
          .toBeTruthy();
        });
      });
    });
  });

  describe("FieldKey", function () {
    var fieldKey,
        field;

    describe("toField()", function () {
      beforeEach(function () {
        fieldKey = 'foo/bar/baz'.toFieldKey();
      });

      it("should return Field instance", function () {
        field = fieldKey.toField();
        expect($entity.Field.mixedBy(field)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        field = fieldKey.toField();
        expect(field.entityKey).toBe(fieldKey);
      });

      it("should pass additional properties to create", function () {
        field = fieldKey.toField({bar: 'baz'});
        expect(field.bar).toBe('baz');
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
  describe("toField()", function () {
    var field;

    it("should create a Field instance", function () {
      field = 'foo/bar/baz'.toField();
      expect($entity.Field.mixedBy(field)).toBeTruthy();
    });

    it("should set entityKey property", function () {
      field = 'foo/bar/baz'.toField();
      var entityKey = 'foo/bar/baz'.toFieldKey();
      entityKey.getEntityPath();
      expect(field.entityKey).toEqual(entityKey);
    });

    it("should pass additional properties to create", function () {
      field = 'foo/bar/baz'.toField({bar: 'baz'});
      expect(field.bar).toBe('baz');
    });
  });
});

describe("Array", function () {
  describe("toField()", function () {
    var components,
        field;

    beforeEach(function () {
      components = ['foo', 'bar', 'baz'];
    });

    it("should create a Field instance", function () {
      field = components.toField();
      expect($entity.Field.mixedBy(field)).toBeTruthy();
    });

    it("should return created instance", function () {
      field = components.toField();
      var entityKey = 'foo/bar/baz'.toFieldKey();
      entityKey.getEntityPath();
      expect(field.entityKey).toEqual(entityKey);
    });

    it("should pass additional properties to create", function () {
      field = components.toField({bar: 'baz'});
      expect(field.bar).toBe('baz');
    });
  });
});
