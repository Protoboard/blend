"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-utils'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("CollectionField", function () {
    var CollectionField,
        collectionField,
        result;

    beforeEach(function () {
      CollectionField = $oop.getClass('test.$entity.CollectionField.CollectionField')
      .mix($entity.CollectionField);
      collectionField = CollectionField.fromEntityKey('foo/bar/baz'.toFieldKey());
    });

    describe("spawnEntityChangeEvents()", function () {
      var nodeBefore,
          nodeAfter;

      beforeEach(function () {
        nodeBefore = {
          0: 1,
          1: 1,
          2: 1,
          3: 1
        };
        nodeAfter = {
          2: 2,
          3: 1,
          4: 1,
          5: 1
        };

        result = collectionField
        .spawnEntityChangeEvents(nodeBefore, nodeAfter);
      });

      it("should spawn events", function () {
        expect(result).toEqual([
          CollectionField.fromEntityKey('foo/bar/baz'.toFieldKey())
          .spawnEvent({
            eventName: $entity.EVENT_ENTITY_CHANGE,
            propertiesAdded: ['4', '5'],
            propertiesRemoved: ['0', '1']
          }),
          'foo/bar/baz/2'.toItem().spawnEvent({
            eventName: $entity.EVENT_ENTITY_CHANGE,
            nodeBefore: 1,
            nodeAfter: 2
          })
        ]);
      });
    });
  });

  describe("Field", function () {
    var result;

    describe("create()", function () {
      describe("when entityKey is CollectionFieldKey", function () {
        beforeEach(function () {
          result = $entity.CollectionFieldKey.fromString('foo/bar/baz')
          .toField();
        });

        it("should return CollectionField instance", function () {
          expect($entity.CollectionField.mixedBy(result))
          .toBeTruthy();
        });
      });
    });
  });
});
