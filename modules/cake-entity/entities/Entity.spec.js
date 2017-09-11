"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-utils'],
    $data = window['cake-data'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("Entity", function () {
    var Entity,
        entityKey,
        entity,
        result;

    beforeEach(function () {
      Entity = $oop.getClass('test.$entity.Entity.Entity')
      .mix($entity.Entity);
      entityKey = 'foo/bar'.toDocumentKey();
      entity = Entity.fromEntityKey(entityKey);
    });

    describe("fromEntityKey()", function () {
      it("should return an Entity instance", function () {
        expect(Entity.mixedBy(entity)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(entity.entityKey).toBe(entityKey);
      });
    });

    describe("getNode()", function () {
      var node;

      beforeEach(function () {
        node = {};
        $entity.entities.setNode('document.foo.bar'.toPath(), node);
        result = entity.getNode();
      });

      afterEach(function () {
        $entity.entities.deletePath('document.foo.bar'.toPath());
      });

      it("should return entity node", function () {
        expect(result).toBe(node);
      });

      describe("when entity node is absent", function () {
        beforeEach(function () {
          spyOn(entity, 'trigger');
          $entity.entities.deleteNode('document.foo.bar'.toPath());
          result = entity.getNode();
        });

        it("should return undefined", function () {
          expect(result).toBeUndefined();
        });

        it("should trigger event", function () {
          expect(entity.trigger).toHaveBeenCalledWith('EVENT_ENTITY_ABSENT');
        });
      });
    });

    describe("getNodeWrapped()", function () {
      var node;

      beforeEach(function () {
        node = {};
        spyOn(entity, 'getNode').and.returnValue(node);
        result = entity.getNodeWrapped();
      });

      it("should return a DataContainer instance", function () {
        expect($data.DataContainer.mixedBy(result)).toBeTruthy();
      });

      it("should wrap node in DataContainer", function () {
        expect(result.data).toBe(node);
      });
    });

    describe("getSilentNode()", function () {
      var node;

      beforeEach(function () {
        node = {};
        $entity.entities.setNode('document.foo.bar'.toPath(), node);
        result = entity.getSilentNode();
      });

      afterEach(function () {
        $entity.entities.deletePath('document.foo.bar'.toPath());
      });

      it("should return entity node", function () {
        expect(result).toBe(node);
      });
    });

    describe("getSilentNodeWrapped()", function () {
      var node;

      beforeEach(function () {
        node = {};
        spyOn(entity, 'getSilentNode').and.returnValue(node);
        result = entity.getSilentNodeWrapped();
      });

      it("should return a DataContainer instance", function () {
        expect($data.DataContainer.mixedBy(result)).toBeTruthy();
      });

      it("should wrap node in DataContainer", function () {
        expect(result.data).toBe(node);
      });
    });

    describe("touchNode()", function () {
      var node;

      beforeEach(function () {
        node = {};
        $entity.entities.setNode('document.foo.bar'.toPath(), node);
        result = entity.touchNode();
      });

      afterEach(function () {
        $entity.entities.deletePath('document.foo.bar'.toPath());
      });

      it("should return self", function () {
        expect(result).toBe(entity);
      });

      describe("when entity node is absent", function () {
        beforeEach(function () {
          spyOn(entity, 'trigger');
          $entity.entities.deleteNode('document.foo.bar'.toPath());
          result = entity.getNode();
        });

        it("should trigger event", function () {
          expect(entity.trigger).toHaveBeenCalledWith('EVENT_ENTITY_ABSENT');
        });
      });
    });

    describe("setNode()", function () {
      var documentKey,
          documentPath,
          triggeredEvents,
          nodeBefore,
          nodeAfter;

      beforeEach(function () {
        documentKey = 'foo/bar'.toDocumentKey();
        documentPath = documentKey.getEntityPath();
        triggeredEvents = [];
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
        nodeAfter = {
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
        };

        spyOn($entity.EntityChangeEvent, 'trigger').and.callFake(function () {
          triggeredEvents.push(this);
          return $utils.Deferred.create().promise;
        });
        $entity.entities.setNode(documentKey.getEntityPath(), nodeBefore);

        result = entity.setNode(nodeAfter);
      });

      afterEach(function () {
        $entity.entities.deletePath(documentKey.getEntityPath());
      });

      it("should set node in container", function () {
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
        var document = documentKey.toDocument(),
            entitiesBefore = $data.Tree.create()
            .setNode(documentPath, nodeBefore),
            entitiesAfter = $data.Tree.create()
            .setNode(documentPath, nodeAfter);

        // can't test equality on Event instances b/c elevated `unlink`
        expect(triggeredEvents[0].eventName)
        .toEqual($entity.EVENT_ENTITY_CHANGE);
        expect(triggeredEvents[0].sender).toEqual(document.getField('actions'));
        expect(triggeredEvents[0].entitiesBefore).toEqual(entitiesBefore);
        expect(triggeredEvents[0].entitiesAfter).toEqual(entitiesAfter);
        expect(triggeredEvents[0].propertiesAdded).toEqual(["like/3"]);
        expect(triggeredEvents[0].propertiesRemoved)
        .toEqual(["like/1", "like/2"]);

        expect(triggeredEvents[1].eventName)
        .toEqual($entity.EVENT_ENTITY_CHANGE);
        expect(triggeredEvents[1].sender).toEqual(document);
        expect(triggeredEvents[1].entitiesBefore).toEqual(entitiesBefore);
        expect(triggeredEvents[1].entitiesAfter).toEqual(entitiesAfter);
        expect(triggeredEvents[1].propertiesAdded).toEqual(["updated_time"]);

        expect(triggeredEvents[2].eventName)
        .toEqual($entity.EVENT_ENTITY_CHANGE);
        expect(triggeredEvents[2].sender).toEqual(document.getField('message'));
        expect(triggeredEvents[2].entitiesBefore).toEqual(entitiesBefore);
        expect(triggeredEvents[2].entitiesAfter).toEqual(entitiesAfter);
      });
    });

    describe("appendNode()", function () {
    });

    describe("unsetNode()", function () {
    });
  });

  describe("EntityKey", function () {
    var EntityKey,
        entityKey,
        result;

    beforeEach(function () {
      EntityKey = $oop.getClass('test.$entity.Entity.EntityKey')
      .mix($entity.EntityKey);
      entityKey = 'foo/bar'.toDocumentKey();
    });

    describe("toEntity()", function () {
      beforeEach(function () {
        result = entityKey.toEntity();
      });

      it("should return Entity instance", function () {
        expect($entity.Entity.mixedBy(result)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(result.entityKey.equals('foo/bar'.toDocumentKey())).toBeTruthy();
      });
    });
  });
});
