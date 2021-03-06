"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $data = window['blend-data'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("BranchNoded", function () {
    var BranchNoded,
        branchNoded,
        result;

    beforeAll(function () {
      BranchNoded = $oop.createClass('test.$entity.BranchNoded.BranchNoded')
      .blend($entity.Entity)
      .blend($entity.BranchNoded)
      .build();
      BranchNoded.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      branchNoded = BranchNoded.fromEntityKey('foo/bar'.toDocumentKey());
    });

    describe("#setNodeAsLeaf()", function () {
      var documentKey,
          documentPath,
          nodeBefore,
          nodeAfter;

      beforeEach(function () {
        documentKey = 'foo/bar'.toDocumentKey();
        documentPath = documentKey.getEntityPath();
        nodeBefore = {};
        nodeAfter = {};

        spyOn($entity.EntityChangeEvent, 'trigger');
        $entity.entities.setNode(documentPath, nodeBefore);

        result = branchNoded.setNodeAsLeaf(nodeAfter);
      });

      it("should return self", function () {
        expect(result).toBe(branchNoded);
      });

      it("should set node in container", function () {
        expect($entity.entities.getNode(documentPath)).toBe(nodeAfter);
      });

      it("should trigger change event", function () {
        var calls = $entity.EntityChangeEvent.trigger.calls.all();

        expect(calls[0].object).toEqual(branchNoded.spawnEvent({
          eventName: $entity.EVENT_ENTITY_CHANGE,
          nodeBefore: nodeBefore,
          nodeAfter: nodeAfter
        }));
      });
    });

    describe("#appendNode()", function () {
      var documentKey,
          documentPath,
          eventsToBeTriggered,
          nodeBefore,
          nodeToAppend;

      beforeEach(function () {
        documentKey = 'foo/bar'.toDocumentKey();
        documentPath = documentKey.getEntityPath();
        eventsToBeTriggered = [
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE),
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE),
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE)
        ];
        nodeBefore = {
          "id": "X999_Y999",
          "from": "user/X12",
          "message": "Looking forward to 2010!",
          "actions": {
            "comment/0": 0,
            "like/0": 1,
            "like/1": 2,
            "like/2": 3
          },
          "type": "status",
          "created_time": "2010-08-02T21:27:44+0000"
        };
        nodeToAppend = {
          "message": "Looking forward to 2011!",
          "actions": {
            "comment/0": 0,
            "like/0": 1,
            "like/3": 2
          },
          "type": "status",
          "updated_time": "2010-08-02T22:00:00+0000"
        };

        spyOn(branchNoded, 'spawnEntityChangeEvents').and
        .returnValue(eventsToBeTriggered);
        spyOn($entity.EntityChangeEvent, 'trigger');
        $entity.entities.setNode(documentPath, nodeBefore);

        result = branchNoded.appendNode(nodeToAppend);
      });

      afterEach(function () {
        $entity.entities.deletePath(documentKey.getEntityPath());
      });

      it("should return self", function () {
        expect(result).toBe(branchNoded);
      });

      it("should append node to existing node in container", function () {
        expect($entity.entities.getNode(documentPath)).toEqual({
          "id": "X999_Y999",
          "from": "user/X12",
          "message": "Looking forward to 2011!",
          "actions": {
            "comment/0": 0,
            "like/0": 1,
            "like/3": 2
          },
          "type": "status",
          "created_time": "2010-08-02T21:27:44+0000",
          "updated_time": "2010-08-02T22:00:00+0000"
        });
      });

      it("should trigger change events", function () {
        var calls = $entity.EntityChangeEvent.trigger.calls.all();

        expect(calls.length).toBe(eventsToBeTriggered.length);
        expect(calls[0].object).toBe(eventsToBeTriggered[0]);
        expect(calls[1].object).toBe(eventsToBeTriggered[1]);
        expect(calls[2].object).toBe(eventsToBeTriggered[2]);
      });
    });
  });
});
