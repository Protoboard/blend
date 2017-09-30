"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-utils'],
    $data = window['cake-data'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("BranchNodeEntity", function () {
    var BranchNodeEntity,
        branchNodeEntity,
        result;

    beforeEach(function () {
      BranchNodeEntity = $oop.getClass('test.$entity.BranchNodeEntity.BranchNodeEntity')
      .mix($entity.Entity)
      .mix($entity.BranchNodeEntity);
      branchNodeEntity = BranchNodeEntity.fromEntityKey('foo/bar'.toDocumentKey());
    });
    
    describe("appendNode()", function () {
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

        spyOn(branchNodeEntity, 'spawnEntityChangeEvents').and
        .returnValue(eventsToBeTriggered);
        spyOn($entity.EntityChangeEvent, 'trigger');
        $entity.entities.setNode(documentPath, nodeBefore);

        result = branchNodeEntity.appendNode(nodeToAppend);
      });

      afterEach(function () {
        $entity.entities.deletePath(documentKey.getEntityPath());
      });

      it("should return self", function () {
        expect(result).toBe(branchNodeEntity);
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
