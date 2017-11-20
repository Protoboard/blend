"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("DataText", function () {
    var DataText,
        dataText;

    beforeAll(function () {
      DataText = $oop.getClass('test.$widgets.DataText.DataText')
      .blend($widgets.DataText);
      DataText.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromTextEntity()", function () {
      var textEntity;

      beforeEach(function () {
        textEntity = 'foo/bar/baz'.toField();
      });

      it("should return DataText instance", function () {
        dataText = DataText.fromTextEntity(textEntity);
        expect(DataText.mixedBy(dataText)).toBeTruthy();
      });

      it("should initialize textEntity", function () {
        dataText = DataText.fromTextEntity(textEntity);
        expect(dataText.textEntity).toBe(textEntity);
      });
    });

    describe("create()", function () {
      describe("on invalid textEntity", function () {
        it("should throw", function () {
          expect(function () {
            dataText = DataText.create();
          }).toThrow();
          expect(function () {
            dataText = DataText.create('foo/bar'.toDocument());
          }).toThrow();
        });
      });
    });

    describe("setTextEntity()", function () {
      var textEntity;

      beforeEach(function () {
        textEntity = 'baz/1/quux'.toField();
        dataText = DataText.fromTextEntity('foo/1/bar'.toField());
        spyOn(dataText, 'setEntityProperty');
      });

      it("should return self", function () {
        var result = dataText.setTextEntity(textEntity);
        expect(result).toBe(dataText);
      });

      it("should invoke setEntityProperty", function () {
        dataText.setTextEntity(textEntity);
        expect(dataText.setEntityProperty)
        .toHaveBeenCalledWith('textEntity', textEntity);
      });
    });

    describe("syncToEntityProperty()", function () {
      var textEntity;

      beforeEach(function () {
        textEntity = 'foo/bar/baz'.toField();
        textEntity.setNode("Hello");
        dataText = DataText.fromTextEntity(textEntity);
        dataText.onAttach();
      });

      afterEach(function () {
        dataText.onDetach();
        textEntity.deleteNode();
      });

      it("should sync text entity to textString", function () {
        dataText.syncToEntityProperty('textEntity');
        expect(dataText.textString).toBe("Hello");
      });
    });
  });
});
