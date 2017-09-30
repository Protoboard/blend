"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("ShallowEntityChangeEventSpawner", function () {
    var ShallowEntityChangeEventSpawner,
        shallowEntityChangeEventSpawner,
        result;

    beforeEach(function () {
      ShallowEntityChangeEventSpawner = $oop.getClass('test.$entity.ShallowEntityChangeEventSpawner.ShallowEntityChangeEventSpawner')
      .mix($entity.Field)
      .mix($entity.ShallowEntityChangeEventSpawner);
      shallowEntityChangeEventSpawner = ShallowEntityChangeEventSpawner.fromComponents('foo', 'bar', 'baz');
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

        result = shallowEntityChangeEventSpawner
        .spawnEntityChangeEvents(nodeBefore, nodeAfter);
      });

      it("should spawn events", function () {
        expect(result).toEqual([
          'foo/bar/baz'.toField().spawnEvent({
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
});
