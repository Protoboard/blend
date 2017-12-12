"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("EntityInputValueHost", function () {
    var EntityInputValueHost,
        entityInputable;

    beforeAll(function () {
      EntityInputValueHost = $oop.createClass('test.$ui.EntityInputValueHost.EntityInputValueHost')
      .blend($widget.Widget)
      .blend($ui.EntityInputValueHost)
      .build();
      EntityInputValueHost.__builder.forwards = {list: [], lookup: {}};
    });

    describe("fromInputValueEntity()", function () {
      var inputValueEntity;

      beforeEach(function () {
        inputValueEntity = 'foo/bar/baz'.toField();
      });

      it("should return EntityInputValueHost instance", function () {
        entityInputable = EntityInputValueHost.fromInputValueEntity(inputValueEntity);
        expect(EntityInputValueHost.mixedBy(entityInputable)).toBeTruthy();
      });

      it("should initialize inputValueEntity", function () {
        entityInputable = EntityInputValueHost.fromInputValueEntity(inputValueEntity);
        expect(entityInputable.inputValueEntity).toBe(inputValueEntity);
      });
    });

    describe("create()", function () {
      describe("on invalid inputValueEntity", function () {
        it("should throw", function () {
          expect(function () {
            entityInputable = EntityInputValueHost.create({
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
        entityInputable = EntityInputValueHost.fromInputValueEntity(inputValueEntity);
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
        entityInputable = EntityInputValueHost.fromInputValueEntity('foo/1/bar'.toField());
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
        entityInputable = EntityInputValueHost.fromInputValueEntity(inputValueEntity);
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
