"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("EntityText", function () {
    var EntityText,
        entityText;

    beforeAll(function () {
      EntityText = $oop.getClass('test.$widgets.EntityText.EntityText')
      .blend($widgets.EntityText);
      EntityText.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromTextEntity()", function () {
      var textEntity;

      beforeEach(function () {
        textEntity = 'foo/bar/baz'.toField();
      });

      it("should return EntityText instance", function () {
        entityText = EntityText.fromTextEntity(textEntity);
        expect(EntityText.mixedBy(entityText)).toBeTruthy();
      });

      it("should initialize textEntity", function () {
        entityText = EntityText.fromTextEntity(textEntity);
        expect(entityText.textEntity).toBe(textEntity);
      });
    });

    describe("create()", function () {
      describe("on invalid textEntity", function () {
        it("should throw", function () {
          expect(function () {
            entityText = EntityText.create();
          }).toThrow();
          expect(function () {
            entityText = EntityText.create('foo/bar'.toDocument());
          }).toThrow();
        });
      });
    });

    describe("setTextEntity()", function () {
      var textEntity;

      beforeEach(function () {
        textEntity = 'baz/1/quux'.toField();
        entityText = EntityText.fromTextEntity('foo/1/bar'.toField());
        spyOn(entityText, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = entityText.setTextEntity(textEntity);
        expect(result).toBe(entityText);
      });

      it("should invoke setEntityProperty", function () {
        entityText.setTextEntity(textEntity);
        expect(entityText.setEntityProperty)
        .toHaveBeenCalledWith('textEntity', textEntity);
      });
    });

    describe("syncToEntityProperty()", function () {
      var textEntity;

      beforeEach(function () {
        textEntity = 'foo/bar/baz'.toField();
        textEntity.setNode("Hello");
        entityText = EntityText.fromTextEntity(textEntity);
        entityText.onAttach();
      });

      afterEach(function () {
        entityText.onDetach();
        textEntity.deleteNode();
      });

      it("should sync text entity to textString", function () {
        entityText.syncToEntityProperty('textEntity');
        expect(entityText.textString).toBe("Hello");
      });
    });
  });
});
