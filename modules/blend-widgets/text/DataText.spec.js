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

    describe("fromTextKey()", function () {
      var textKey;

      beforeEach(function () {
        textKey = 'foo/bar/baz'.toFieldKey();
      });

      it("should return DataText instance", function () {
        dataText = DataText.fromTextKey(textKey);
        expect(DataText.mixedBy(dataText)).toBeTruthy();
      });

      it("should initialize textKey", function () {
        dataText = DataText.fromTextKey(textKey);
        expect(dataText.textKey).toBe(textKey);
      });
    });

    describe("create()", function () {
      describe("on invalid textKey", function () {
        it("should throw", function () {
          expect(function () {
            dataText = DataText.create();
          }).toThrow();
          expect(function () {
            dataText = DataText.create('foo/bar'.toDocumentKey());
          }).toThrow();
        });
      });
    });

    describe("onAttach()", function () {
      var textKey;

      beforeEach(function () {
        textKey = 'foo/bar/baz'.toFieldKey();
        textKey.toField().setNode("Hello");
        dataText = DataText.fromTextKey(textKey);
      });

      afterEach(function () {
        dataText.onDetach();
        textKey.toField().deleteNode();
      });

      it("should sync text entity to textString", function () {
        dataText.onAttach();
        expect(dataText.textString).toBe("Hello");
      });

      it("should subscribe to textKey", function () {
        dataText.onAttach();
        expect(dataText.subscribes($entity.EVENT_ENTITY_CHANGE, textKey.toField()))
        .toBeTruthy();
      });
    });

    describe("setTextKey()", function () {
      var textKey1,
          textKey2;

      beforeEach(function () {
        textKey1 = 'foo/bar/baz'.toFieldKey();
        textKey2 = 'foo/bar/quux'.toFieldKey();
        textKey1.toField().setNode("Hello");
        textKey2.toField().setNode("World");
        dataText = DataText.fromTextKey(textKey1);
      });

      afterEach(function () {
        textKey1.toField().deleteNode();
        textKey2.toField().deleteNode();
      });

      it("should return self", function () {
        var result = dataText.setTextKey(textKey2);
        expect(result).toBe(dataText);
      });

      it("should set textKey", function () {
        dataText.setTextKey(textKey2);
        expect(dataText.textKey).toBe(textKey2);
      });

      it("should sync text entity to textString", function () {
        dataText.setTextKey(textKey2);
        expect(dataText.textString).toBe("World");
      });

      it("should re-subscribe to new key", function () {
        dataText.setTextKey(textKey2);
        expect(dataText.subscribes($entity.EVENT_ENTITY_CHANGE, textKey1.toField()))
        .toBeFalsy();
        expect(dataText.subscribes($entity.EVENT_ENTITY_CHANGE, textKey2.toField()))
        .toBeTruthy();
      });
    });

    describe("onTextEntityChange()", function () {
      var textKey;

      beforeEach(function () {
        textKey = 'foo/bar/baz'.toFieldKey();
        textKey.toField().setNode("Hello");
        dataText = DataText.fromTextKey(textKey);
        dataText.onAttach();
      });

      afterEach(function () {
        dataText.onDetach();
        textKey.toField().deleteNode();
      });

      it("should sync text entity to textString", function () {
        textKey.toField()
        .spawnEvent({
          eventName: $entity.EVENT_ENTITY_CHANGE
        })
        .trigger();
        expect(dataText.textString).toBe("Hello");
      });
    });
  });
});
