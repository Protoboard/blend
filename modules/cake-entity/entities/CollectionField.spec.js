"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-utils'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("CollectionField", function () {
    var CollectionField,
        collectionFieldKey,
        collectionField,
        result;

    beforeAll(function () {
      CollectionField = $oop.getClass('test.$entity.CollectionField.CollectionField')
      .blend($entity.CollectionField);
    });

    beforeEach(function () {
      collectionFieldKey = $entity.CollectionFieldKey.fromString('foo/bar/baz');
      collectionField = CollectionField.fromEntityKey(collectionFieldKey);
    });

    describe("create()", function () {
      it("should initialize triggerPaths", function () {
        expect(collectionField.triggerPaths).toContain(
            'entity.document.__field.__field/itemIdType.options.string'.toPath(),
            'entity.document.__field.__field/itemValueType.options.string'.toPath());
      });
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
          CollectionField.fromEntityKey(collectionFieldKey)
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
