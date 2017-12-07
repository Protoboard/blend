"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("EntityInputable", function () {
    var EntityInputable,
        entityInputable;

    beforeAll(function () {
      EntityInputable = $oop.createClass('test.$ui.EntityInputable.EntityInputable')
      .blend($widget.Widget)
      .blend($ui.EntityInputable)
      .build();
      EntityInputable.__builder.forwards = {list: [], lookup: {}};
    });

    describe("fromInputValueEntity()", function () {
      var inputValueEntity;

      beforeEach(function () {
        inputValueEntity = 'foo/bar/baz'.toField();
      });

      it("should return EntityInputable instance", function () {
        entityInputable = EntityInputable.fromInputValueEntity(inputValueEntity);
        expect(EntityInputable.mixedBy(entityInputable)).toBeTruthy();
      });

      it("should initialize inputValueEntity", function () {
        entityInputable = EntityInputable.fromInputValueEntity(inputValueEntity);
        expect(entityInputable.inputValueEntity).toBe(inputValueEntity);
      });
    });

    describe("create()", function () {
      describe("on invalid inputValueEntity", function () {
        it("should throw", function () {
          expect(function () {
            entityInputable = EntityInputable.create({
              inputValueEntity: 'foo/bar'.toDocument()
            });
          }).toThrow();
        });
      });
    });

    describe("setInputValue()", function () {
      var inputValueEntity;

      beforeEach(function () {
        inputValueEntity = 'baz/1/quux'.toField();
        inputValueEntity.deleteNode();
        entityInputable = EntityInputable.fromInputValueEntity(inputValueEntity);
      });

      afterEach(function () {
        inputValueEntity.deleteNode();
      });

      it("should return self", function () {
        var result = entityInputable.setInputValue('foo');
        expect(result).toBe(entityInputable);
      });

      it("should sync entity to inputValue", function () {
        entityInputable.setInputValue('foo');
        expect(inputValueEntity.getNode()).toBe('foo');
      });
    });

    describe("setInputValueEntity()", function () {
      var inputValueEntity;

      beforeEach(function () {
        inputValueEntity = 'baz/1/quux'.toField();
        entityInputable = EntityInputable.fromInputValueEntity('foo/1/bar'.toField());
        spyOn(entityInputable, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = entityInputable.setInputValueEntity(inputValueEntity);
        expect(result).toBe(entityInputable);
      });

      it("should invoke setEntityProperty", function () {
        entityInputable.setInputValueEntity(inputValueEntity);
        expect(entityInputable.setEntityProperty)
        .toHaveBeenCalledWith('inputValueEntity', inputValueEntity);
      });
    });

    describe("_syncToEntityProperty()", function () {
      var inputValueEntity;

      beforeEach(function () {
        inputValueEntity = 'foo/bar/baz'.toField();
        inputValueEntity.setNode("Hello");
        entityInputable = EntityInputable.fromInputValueEntity(inputValueEntity);
        entityInputable.onAttach();
      });

      afterEach(function () {
        entityInputable.onDetach();
        inputValueEntity.deleteNode();
      });

      it("should sync text entity to inputValue", function () {
        entityInputable._syncToEntityProperty('inputValueEntity');
        expect(entityInputable.inputValue).toBe("Hello");
      });
    });
  });
});
