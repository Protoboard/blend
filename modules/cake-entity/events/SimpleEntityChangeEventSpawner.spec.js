"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("SimpleEntityChangeEventSpawner", function () {
    var PrimitiveField,
        primitiveField,
        result;

    beforeEach(function () {
      PrimitiveField = $oop.getClass('test.$entity.SimpleEntityChangeEventSpawner.SimpleEntityChangeEventSpawner')
      .mix($entity.Field)
      .mix($entity.SimpleEntityChangeEventSpawner);
      primitiveField = PrimitiveField.fromComponents('foo', 'bar', 'baz');
    });

    describe("spawnEntityChangeEvents()", function () {
      var entitiesBefore,
          entitiesAfter;

      describe("when node has changed", function () {
        beforeEach(function () {
          entitiesBefore = $data.Tree.fromData({
            document: {
              foo: {
                bar: {
                  baz: 'Hello'
                }
              }
            }
          });
          entitiesAfter = $data.Tree.fromData({
            document: {
              foo: {
                bar: {
                  baz: "World"
                }
              }
            }
          });

          result = primitiveField.spawnEntityChangeEvents(entitiesBefore, entitiesAfter);
        });

        it("should spawn single event", function () {
          expect(result instanceof Array).toBeTruthy();
          var event = result[0];
          expect($entity.EntityChangeEvent.mixedBy(event)).toBeTruthy();
          expect(event.entitiesBefore).toBe(entitiesBefore);
          expect(event.entitiesAfter).toBe(entitiesAfter);
        });
      });

      describe("when node has not changed", function () {
        beforeEach(function () {
          entitiesBefore = $data.Tree.fromData({});
          entitiesAfter = $data.Tree.fromData({});

          result = primitiveField.spawnEntityChangeEvents(entitiesBefore, entitiesAfter);
        });

        it("should spawn single event", function () {
          expect(result instanceof Array).toBeTruthy();
          expect(result.length).toBe(0);
        });
      });
    });
  });
});
