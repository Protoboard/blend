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
      var entitiesBefore,
          entitiesAfter;

      beforeEach(function () {
        entitiesBefore = $data.Tree.fromData({
          document: {
            foo: {
              bar: {
                baz: {
                  0: 1,
                  1: 1,
                  2: 1,
                  3: 1
                }
              }
            }
          }
        });
        entitiesAfter = $data.Tree.fromData({
          document: {
            foo: {
              bar: {
                baz: {
                  2: 2,
                  3: 1,
                  4: 1,
                  5: 1
                }
              }
            }
          }
        });

        result = shallowEntityChangeEventSpawner.spawnEntityChangeEvents(
            entitiesBefore, entitiesAfter,
            entitiesBefore.data.document.foo.bar.baz,
            entitiesAfter.data.document.foo.bar.baz);
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
            _nodeBefore: 1,
            _nodeAfter: 2
          })
        ]);
      });
    });
  });
});
