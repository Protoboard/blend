"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("LeafNoded", function () {
    var LeafNodedField,
        leafNodedField,
        result;

    beforeEach(function () {
      LeafNodedField = $oop.getClass('test.$entity.LeafNoded.LeafNoded')
      .mix($entity.Field)
      .mix($entity.LeafNoded);
      leafNodedField = LeafNodedField.fromComponents('foo', 'bar', 'baz');
    });

    describe("create()", function () {
      it("should initialize triggerPaths", function () {
        var nodeTypePath = 'entity.document.__field.__field/nodeType.options.leaf'.toPath();
        expect(leafNodedField.triggerPaths).toContain(nodeTypePath);
      });
    });

    describe("spawnEntityChangeEvents()", function () {
      var nodeBefore,
          nodeAfter;

      describe("when node has changed", function () {
        beforeEach(function () {
          nodeBefore = "Hello";
          nodeAfter = "World";

          result = leafNodedField
          .spawnEntityChangeEvents(nodeBefore, nodeAfter);
        });

        it("should spawn single event", function () {
          expect(result).toEqual([
            'foo/bar/baz'.toField().spawnEvent({
              eventName: $entity.EVENT_ENTITY_CHANGE,
              nodeBefore: "Hello",
              nodeAfter: "World"
            })
          ]);
        });
      });

      describe("when node has not changed", function () {
        beforeEach(function () {
          result = leafNodedField.spawnEntityChangeEvents();
        });

        it("should spawn single event", function () {
          expect(result instanceof Array).toBeTruthy();
          expect(result.length).toBe(0);
        });
      });
    });
  });
});
