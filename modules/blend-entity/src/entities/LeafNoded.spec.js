"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("LeafNoded", function () {
    var LeafNodedField,
        leafNodedField,
        result;

    beforeAll(function () {
      LeafNodedField = $oop.createClass('test.$entity.LeafNoded.LeafNoded')
      .blend($entity.Field)
      .blend($entity.LeafNoded)
      .build();
      LeafNodedField.__builder.forwards = {list: [], lookup: {}};
    });

    describe("spawnEntityChangeEvents()", function () {
      var nodeBefore,
          nodeAfter;

      beforeEach(function () {
        leafNodedField = LeafNodedField.fromComponents('foo', 'bar', 'baz');
      });

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

    describe("toString()", function () {
      beforeEach(function () {
        leafNodedField = LeafNodedField.fromComponents('foo', 'bar', 'baz');
        leafNodedField.setNode("Hello");
      });

      afterEach(function () {
        leafNodedField.deleteNode();
      });

      it("should return stringified entity value", function () {
        expect(leafNodedField + '').toBe("Hello");
      });
    });
  });
});
