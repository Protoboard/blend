"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("EntityText", function () {
    var EntityText,
        entityText;

    beforeAll(function () {
      EntityText = $oop.getClass('test.$ui.EntityText.EntityText')
      .blend($ui.EntityText);
      EntityText.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromTextEntity()", function () {
      var textContentEntity;

      beforeEach(function () {
        textContentEntity = 'foo/bar/baz'.toField();
      });

      it("should return EntityText instance", function () {
        entityText = EntityText.fromTextEntity(textContentEntity);
        expect(EntityText.mixedBy(entityText)).toBeTruthy();
      });

      it("should initialize textContentEntity", function () {
        entityText = EntityText.fromTextEntity(textContentEntity);
        expect(entityText.textContentEntity).toBe(textContentEntity);
      });
    });

    describe("create()", function () {
      describe("on invalid textContentEntity", function () {
        it("should throw", function () {
          expect(function () {
            entityText = EntityText.create({textContentEntity: 'foo/bar'.toDocument()});
          }).toThrow();
        });
      });
    });

    describe("setTextContentEntity()", function () {
      var textContentEntity;

      beforeEach(function () {
        textContentEntity = 'baz/1/quux'.toField();
        entityText = EntityText.fromTextEntity('foo/1/bar'.toField());
        spyOn(entityText, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = entityText.setTextContentEntity(textContentEntity);
        expect(result).toBe(entityText);
      });

      it("should invoke setEntityProperty", function () {
        entityText.setTextContentEntity(textContentEntity);
        expect(entityText.setEntityProperty)
        .toHaveBeenCalledWith('textContentEntity', textContentEntity);
      });
    });

    describe("_syncToEntityProperty()", function () {
      var textContentEntity;

      beforeEach(function () {
        textContentEntity = 'foo/bar/baz'.toField();
        textContentEntity.setNode("Hello");
        entityText = EntityText.fromTextEntity(textContentEntity);
        entityText.onAttach();
      });

      afterEach(function () {
        entityText.onDetach();
        textContentEntity.deleteNode();
      });

      it("should sync text entity to textContent", function () {
        entityText._syncToEntityProperty('textContentEntity');
        expect(entityText.textContent).toBe("Hello");
      });
    });
  });
});
