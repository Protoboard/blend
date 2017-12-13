"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("EntityInputValuesHost", function () {
    var EntityInputValuesHost,
        entityInputValuesHost,
        inputValuesFieldKey,
        inputValuesField;

    beforeAll(function () {
      EntityInputValuesHost = $oop.createClass('test.$ui.EntityInputValuesHost.EntityInputValuesHost')
      .blend($widget.Widget)
      .blend($ui.EntityInputValuesHost)
      .build();
      EntityInputValuesHost.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      inputValuesFieldKey = $entity.CollectionFieldKey.fromString('foo/bar/inputValues');
      inputValuesField = inputValuesFieldKey.toField();
    });

    describe("fromInputValuesEntity()", function () {
      it("should return EntityInputValuesHost instance", function () {
        entityInputValuesHost = EntityInputValuesHost.fromInputValuesEntity(inputValuesField);
        expect(EntityInputValuesHost.mixedBy(entityInputValuesHost))
        .toBeTruthy();
      });

      it("should initialize inputValuesEntity", function () {
        entityInputValuesHost = EntityInputValuesHost.fromInputValuesEntity(inputValuesField);
        expect(entityInputValuesHost.inputValuesEntity).toBe(inputValuesField);
      });
    });

    describe("create()", function () {
      describe("on invalid inputValuesEntity", function () {
        it("should throw", function () {
          expect(function () {
            entityInputValuesHost = EntityInputValuesHost.create({
              inputValuesEntity: 'foo/bar'.toDocument()
            });
          }).toThrow();
          expect(function () {
            entityInputValuesHost = EntityInputValuesHost.create({
              inputValuesEntity: 'foo/bar/baz'.toField()
            });
          }).toThrow();
        });
      });
    });

    describe("setInputValues()", function () {
      beforeEach(function () {
        inputValuesField.deleteNode();
        entityInputValuesHost = EntityInputValuesHost.fromInputValuesEntity(inputValuesField);
      });

      afterEach(function () {
        inputValuesField.deleteNode();
      });

      it("should return self", function () {
        var result = entityInputValuesHost.setInputValues({foo: 'foo'});
        expect(result).toBe(entityInputValuesHost);
      });

      it("should sync entity to inputValue", function () {
        entityInputValuesHost.setInputValues({foo: 'foo'});
        expect(inputValuesField.getNode()).toEqual({foo: 'foo'});
      });
    });

    describe("setInputValue()", function () {
      beforeEach(function () {
        inputValuesField.deleteNode();
        entityInputValuesHost = EntityInputValuesHost.fromInputValuesEntity(inputValuesField);
      });

      afterEach(function () {
        inputValuesField.deleteNode();
      });

      it("should return self", function () {
        var result = entityInputValuesHost.setInputValue('foo');
        expect(result).toBe(entityInputValuesHost);
      });

      it("should sync entity to inputValues", function () {
        entityInputValuesHost.setInputValue('foo');
        expect(inputValuesField.getNode()).toEqual({foo: 'foo'});
      });
    });

    describe("deleteInputValue()", function () {
      beforeEach(function () {
        inputValuesField.setNode({
          foo: 'foo'
        });
        entityInputValuesHost = EntityInputValuesHost.fromInputValuesEntity(inputValuesField);
      });

      afterEach(function () {
        inputValuesField.deleteNode();
      });

      it("should return self", function () {
        var result = entityInputValuesHost.deleteInputValue('foo');
        expect(result).toBe(entityInputValuesHost);
      });

      it("should sync entity to inputValues", function () {
        entityInputValuesHost.deleteInputValue('foo');
        expect(inputValuesField.getNode()).toEqual({});
      });
    });

    describe("setInputValuesEntity()", function () {
      beforeEach(function () {
        var inputValuesFieldBefore = $entity.CollectionFieldKey.fromString('foo/bar/inputValues')
        .toField();
        entityInputValuesHost = EntityInputValuesHost.fromInputValuesEntity(inputValuesFieldBefore);
        spyOn(entityInputValuesHost, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = entityInputValuesHost.setInputValuesEntity(inputValuesField);
        expect(result).toBe(entityInputValuesHost);
      });

      it("should invoke setEntityProperty", function () {
        entityInputValuesHost.setInputValuesEntity(inputValuesField);
        expect(entityInputValuesHost.setEntityProperty)
        .toHaveBeenCalledWith('inputValuesEntity', inputValuesField);
      });
    });

    describe("_syncToEntityProperty()", function () {
      beforeEach(function () {
        inputValuesField.setNode({foo: 'foo'});
        entityInputValuesHost = EntityInputValuesHost.fromInputValuesEntity(inputValuesField);
        entityInputValuesHost.onAttach();
      });

      afterEach(function () {
        entityInputValuesHost.onDetach();
        inputValuesField.deleteNode();
      });

      it("should sync inputValue to entity", function () {
        entityInputValuesHost._syncToEntityProperty('inputValuesEntity');
        expect(entityInputValuesHost.inputValues).toEqual({foo: 'foo'});
      });
    });
  });
});
