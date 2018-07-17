"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("EntityInputValueHost", function () {
    var EntityInputValueHost,
        entityInputValueHost;

    beforeAll(function () {
      EntityInputValueHost = $oop.createClass('test.$ui.EntityInputValueHost.EntityInputValueHost')
      .blend($widget.Widget)
      .blend($ui.EntityInputValueHost)
      .build();
      EntityInputValueHost.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".fromInputValueEntity()", function () {
      var inputValueEntity;

      beforeEach(function () {
        inputValueEntity = 'foo/bar/baz'.toField();
      });

      it("should return EntityInputValueHost instance", function () {
        entityInputValueHost = EntityInputValueHost.fromInputValueEntity(inputValueEntity);
        expect(EntityInputValueHost.mixedBy(entityInputValueHost)).toBeTruthy();
      });

      it("should initialize inputValueEntity", function () {
        entityInputValueHost = EntityInputValueHost.fromInputValueEntity(inputValueEntity);
        expect(entityInputValueHost.inputValueEntity).toBe(inputValueEntity);
      });
    });

    describe(".create()", function () {
      describe("on invalid inputValueEntity", function () {
        it("should throw", function () {
          expect(function () {
            entityInputValueHost = EntityInputValueHost.create({
              inputValueEntity: 'foo/bar'.toDocument()
            });
          }).toThrow();
        });
      });
    });

    describe("#setInputValue()", function () {
      var inputValueEntity;

      beforeEach(function () {
        inputValueEntity = 'baz/1/quux'.toField();
        inputValueEntity.deleteNode();
        entityInputValueHost = EntityInputValueHost.fromInputValueEntity(inputValueEntity);
      });

      afterEach(function () {
        inputValueEntity.deleteNode();
      });

      it("should return self", function () {
        var result = entityInputValueHost.setInputValue('foo');
        expect(result).toBe(entityInputValueHost);
      });

      it("should sync entity to inputValue", function () {
        entityInputValueHost.setInputValue('foo');
        expect(inputValueEntity.getNode()).toBe('foo');
      });
    });

    describe("#setInputValueEntity()", function () {
      var inputValueEntity;

      beforeEach(function () {
        inputValueEntity = 'baz/1/quux'.toField();
        entityInputValueHost = EntityInputValueHost.fromInputValueEntity('foo/1/bar'.toField());
        spyOn(entityInputValueHost, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = entityInputValueHost.setInputValueEntity(inputValueEntity);
        expect(result).toBe(entityInputValueHost);
      });

      it("should invoke setEntityProperty", function () {
        entityInputValueHost.setInputValueEntity(inputValueEntity);
        expect(entityInputValueHost.setEntityProperty)
        .toHaveBeenCalledWith('inputValueEntity', inputValueEntity);
      });
    });

    describe("#_syncToEntityProperty()", function () {
      var inputValueEntity;

      beforeEach(function () {
        inputValueEntity = 'foo/bar/baz'.toField();
        inputValueEntity.setNode("Hello");
        entityInputValueHost = EntityInputValueHost.fromInputValueEntity(inputValueEntity);
        entityInputValueHost.onAttach();
      });

      afterEach(function () {
        entityInputValueHost.onDetach();
        inputValueEntity.deleteNode();
      });

      it("should sync inputValue to entity", function () {
        entityInputValueHost._syncToEntityProperty('inputValueEntity');
        expect(entityInputValueHost.inputValue).toBe("Hello");
      });
    });
  });
});
