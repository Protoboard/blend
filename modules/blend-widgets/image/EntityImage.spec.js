"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("EntityImage", function () {
    var EntityImage,
        entityImage;

    beforeAll(function () {
      EntityImage = $oop.getClass('test.$widgets.EntityImage.EntityImage')
      .blend($widgets.EntityImage);
      EntityImage.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromImageUrlEntity()", function () {
      var imageUrlEntity;

      beforeEach(function () {
        imageUrlEntity = 'foo/bar/baz'.toField();
      });

      it("should return EntityImage instance", function () {
        entityImage = EntityImage.fromImageUrlEntity(imageUrlEntity);
        expect(EntityImage.mixedBy(entityImage)).toBeTruthy();
      });

      it("should initialize imageUrlEntity", function () {
        entityImage = EntityImage.fromImageUrlEntity(imageUrlEntity);
        expect(entityImage.imageUrlEntity).toBe(imageUrlEntity);
      });
    });

    describe("create()", function () {
      describe("on invalid imageUrlEntity", function () {
        it("should throw", function () {
          expect(function () {
            entityImage = EntityImage.create({imageUrlEntity: 'foo/bar'.toDocument()});
          }).toThrow();
        });
      });
    });

    describe("setImageUrlEntity()", function () {
      var imageUrlEntity;

      beforeEach(function () {
        imageUrlEntity = 'baz/1/quux'.toField();
        entityImage = EntityImage.fromImageUrlEntity('foo/1/bar'.toField());
        spyOn(entityImage, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = entityImage.setImageUrlEntity(imageUrlEntity);
        expect(result).toBe(entityImage);
      });

      it("should invoke setEntityProperty", function () {
        entityImage.setImageUrlEntity(imageUrlEntity);
        expect(entityImage.setEntityProperty)
        .toHaveBeenCalledWith('imageUrlEntity', imageUrlEntity);
      });
    });

    describe("_syncToEntityProperty()", function () {
      var imageUrlEntity;

      beforeEach(function () {
        imageUrlEntity = 'foo/bar/baz'.toField();
        imageUrlEntity.setNode("http://foo.com");
        entityImage = EntityImage.fromImageUrlEntity(imageUrlEntity);
        entityImage.onAttach();
      });

      afterEach(function () {
        entityImage.onDetach();
        imageUrlEntity.deleteNode();
      });

      it("should sync text entity to textString", function () {
        entityImage._syncToEntityProperty('imageUrlEntity');
        expect(entityImage.imageUrl).toBe("http://foo.com");
      });
    });
  });
});
