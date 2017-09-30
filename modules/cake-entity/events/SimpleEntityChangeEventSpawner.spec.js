"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("SimpleEntityChangeEventSpawner", function () {
    var SimpleEntityChangeEventSpawner,
        simpleEntityChangeEventSpawner,
        result;

    beforeEach(function () {
      SimpleEntityChangeEventSpawner = $oop.getClass('test.$entity.SimpleEntityChangeEventSpawner.SimpleEntityChangeEventSpawner')
      .mix($entity.Field)
      .mix($entity.SimpleEntityChangeEventSpawner);
      simpleEntityChangeEventSpawner = SimpleEntityChangeEventSpawner.fromComponents('foo', 'bar', 'baz');
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

          result = simpleEntityChangeEventSpawner.spawnEntityChangeEvents(
              entitiesBefore.data.document.foo.bar.baz,
              entitiesAfter.data.document.foo.bar.baz);
        });

        it("should spawn single event", function () {
          expect(result).toEqual([
            'foo/bar/baz'.toField().spawnEvent({
              eventName: $entity.EVENT_ENTITY_CHANGE,
              _nodeBefore: "Hello",
              _nodeAfter: "World"
            })
          ]);
        });
      });

      describe("when node has not changed", function () {
        beforeEach(function () {
          result = simpleEntityChangeEventSpawner.spawnEntityChangeEvents();
        });

        it("should spawn single event", function () {
          expect(result instanceof Array).toBeTruthy();
          expect(result.length).toBe(0);
        });
      });
    });
  });
});
