"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("EntityHyperlink", function () {
    var EntityHyperlink,
        entityHyperlink;

    beforeAll(function () {
      EntityHyperlink = $oop.createClass('test.$ui.EntityHyperlink.EntityHyperlink')
      .blend($ui.EntityHyperlink)
      .build();
      EntityHyperlink.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".fromTargetUrlEntity()", function () {
      var targetUrlEntity;

      beforeEach(function () {
        targetUrlEntity = 'foo/bar/baz'.toField();
      });

      it("should return EntityHyperlink instance", function () {
        entityHyperlink = EntityHyperlink.fromTargetUrlEntity(targetUrlEntity);
        expect(EntityHyperlink.mixedBy(entityHyperlink)).toBeTruthy();
      });

      it("should initialize targetUrlEntity", function () {
        entityHyperlink = EntityHyperlink.fromTargetUrlEntity(targetUrlEntity);
        expect(entityHyperlink.targetUrlEntity).toBe(targetUrlEntity);
      });
    });

    describe(".create()", function () {
      describe("on invalid targetUrlEntity", function () {
        it("should throw", function () {
          expect(function () {
            entityHyperlink = EntityHyperlink.create({
              targetUrlEntity: 'foo/bar'.toDocument()
            });
          }).toThrow();
        });
      });
    });

    describe("#setTargetUrlEntity()", function () {
      var targetUrlEntity;

      beforeEach(function () {
        targetUrlEntity = 'baz/1/quux'.toField();
        entityHyperlink = EntityHyperlink.fromTargetUrlEntity('foo/1/bar'.toField());
        spyOn(entityHyperlink, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = entityHyperlink.setTargetUrlEntity(targetUrlEntity);
        expect(result).toBe(entityHyperlink);
      });

      it("should invoke setEntityProperty", function () {
        entityHyperlink.setTargetUrlEntity(targetUrlEntity);
        expect(entityHyperlink.setEntityProperty)
        .toHaveBeenCalledWith('targetUrlEntity', targetUrlEntity);
      });
    });

    describe("#_syncToEntityProperty()", function () {
      var targetUrlEntity;

      beforeEach(function () {
        targetUrlEntity = 'foo/bar/baz'.toField();
        targetUrlEntity.setNode("http://foo.com");
        entityHyperlink = EntityHyperlink.fromTargetUrlEntity(targetUrlEntity);
        entityHyperlink.onAttach();
      });

      afterEach(function () {
        entityHyperlink.onDetach();
        targetUrlEntity.deleteNode();
      });

      it("should sync text entity to targetUrlEntity", function () {
        entityHyperlink._syncToEntityProperty('targetUrlEntity');
        expect(entityHyperlink.targetUrl).toBe("http://foo.com");
      });
    });
  });
});
