"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("EntityHyperlink", function () {
    var EntityHyperlink,
        dataHyperlink;

    beforeAll(function () {
      EntityHyperlink = $oop.getClass('test.$ui.EntityHyperlink.EntityHyperlink')
      .blend($ui.EntityHyperlink);
      EntityHyperlink.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromTargetUrlEntity()", function () {
      var targetUrlEntity;

      beforeEach(function () {
        targetUrlEntity = 'foo/bar/baz'.toField();
      });

      it("should return EntityHyperlink instance", function () {
        dataHyperlink = EntityHyperlink.fromTargetUrlEntity(targetUrlEntity);
        expect(EntityHyperlink.mixedBy(dataHyperlink)).toBeTruthy();
      });

      it("should initialize targetUrlEntity", function () {
        dataHyperlink = EntityHyperlink.fromTargetUrlEntity(targetUrlEntity);
        expect(dataHyperlink.targetUrlEntity).toBe(targetUrlEntity);
      });
    });

    describe("create()", function () {
      describe("on invalid targetUrlEntity", function () {
        it("should throw", function () {
          expect(function () {
            dataHyperlink = EntityHyperlink.create({
              targetUrlEntity: 'foo/bar'.toDocument()
            });
          }).toThrow();
        });
      });
    });

    describe("setTargetUrlEntity()", function () {
      var targetUrlEntity;

      beforeEach(function () {
        targetUrlEntity = 'baz/1/quux'.toField();
        dataHyperlink = EntityHyperlink.fromTargetUrlEntity('foo/1/bar'.toField());
        spyOn(dataHyperlink, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = dataHyperlink.setTargetUrlEntity(targetUrlEntity);
        expect(result).toBe(dataHyperlink);
      });

      it("should invoke setEntityProperty", function () {
        dataHyperlink.setTargetUrlEntity(targetUrlEntity);
        expect(dataHyperlink.setEntityProperty)
        .toHaveBeenCalledWith('targetUrlEntity', targetUrlEntity);
      });
    });

    describe("_syncToEntityProperty()", function () {
      var targetUrlEntity;

      beforeEach(function () {
        targetUrlEntity = 'foo/bar/baz'.toField();
        targetUrlEntity.setNode("http://foo.com");
        dataHyperlink = EntityHyperlink.fromTargetUrlEntity(targetUrlEntity);
        dataHyperlink.onAttach();
      });

      afterEach(function () {
        dataHyperlink.onDetach();
        targetUrlEntity.deleteNode();
      });

      it("should sync text entity to targetUrlEntity", function () {
        dataHyperlink._syncToEntityProperty('targetUrlEntity');
        expect(dataHyperlink.targetUrl).toBe("http://foo.com");
      });
    });
  });
});
