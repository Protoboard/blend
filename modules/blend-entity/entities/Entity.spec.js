"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $data = window['blend-data'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("Entity", function () {
    var EntityKey,
        Entity,
        entityKey,
        entity,
        result;

    beforeAll(function () {
      EntityKey = $oop.getClass('test.$entity.Entity.EntityKey')
      .blend($entity.EntityKey)
      .define({
        getAttributeDocumentKey: function () {
          return '__foo/bar'.toDocumentKey();
        },
        getChildKey: function (childId) {
          return EntityKey.fromEntityPath(['foo', childId].toTreePath());
        }
      });
      Entity = $oop.getClass('test.$entity.Entity.Entity')
      .blend($entity.Entity);
    });

    beforeEach(function () {
      entityKey = EntityKey.fromEntityPath('foo.bar.baz'.toTreePath());
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

    describe("create()", function () {
      it("should set listeningPath", function () {
        expect(entity.listeningPath).toEqual('entity.foo.bar.baz');
      });

      it("should initialize triggerPaths", function () {
        expect(entity.triggerPaths.list).toContain(
            'entity.foo.bar.baz',
            'entity',
            'entity.document.__foo.bar');
      });

      describe("when entityKey is cached", function () {
        var EntityKey,
            entityKey,
            entity,
            result;

        beforeAll(function () {
          EntityKey = $oop.getClass('test.$entity.Entity.EntityKey')
          .blend($entity.EntityKey)
          .blend($utils.StringifyCached)
          .define({
            getAttributeDocumentKey: function () {
              return 'FOO/BAR'.toDocumentKey();
            },
            toString: function () {
              return this._entityPath + '';
            }
          });
        });

        beforeEach(function () {
          entityKey = EntityKey.create({
            _entityPath: 'foo'.toTreePath()
          });
          entity = $entity.Entity.fromEntityKey(entityKey);

          result = $entity.Entity.fromEntityKey(entityKey);
        });

        it("should retrieve cached instance", function () {
          expect(result).toBe(entity);
        });
      });
    });

    describe("getNode()", function () {
      var node;

      beforeEach(function () {
        node = {};
        $entity.entities.setNode('foo.bar.baz'.toTreePath(), node);
        result = entity.getNode();
      });

      afterEach(function () {
        $entity.entities.deletePath('foo.bar.baz'.toTreePath());
      });

      it("should return entity node", function () {
        expect(result).toBe(node);
      });

      describe("when entity node is absent", function () {
        beforeEach(function () {
          spyOn(entity, 'trigger');
          $entity.entities.deleteNode('foo.bar.baz'.toTreePath());
          result = entity.getNode();
        });

        it("should return undefined", function () {
          expect(result).toBeUndefined();
        });

        it("should trigger event", function () {
          expect(entity.trigger).toHaveBeenCalledWith('entity.absent');
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
        $entity.entities.setNode('foo.bar.baz'.toTreePath(), node);
        result = entity.getSilentNode();
      });

      afterEach(function () {
        $entity.entities.deletePath('foo.bar.baz'.toTreePath());
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
        $entity.entities.setNode('foo.bar.baz'.toTreePath(), node);
        result = entity.touchNode();
      });

      afterEach(function () {
        $entity.entities.deletePath('foo.bar.baz'.toTreePath());
      });

      it("should return self", function () {
        expect(result).toBe(entity);
      });

      describe("when entity node is absent", function () {
        beforeEach(function () {
          spyOn(entity, 'trigger');
          $entity.entities.deleteNode('foo.bar.baz'.toTreePath());
          result = entity.getNode();
        });

        it("should trigger event", function () {
          expect(entity.trigger).toHaveBeenCalledWith('entity.absent');
        });
      });
    });

    describe("setNode()", function () {
      var entityPath,
          eventsToBeTriggered,
          nodeBefore,
          nodeAfter;

      beforeEach(function () {
        entityPath = entityKey.getEntityPath();
        eventsToBeTriggered = [
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE),
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE),
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE)
        ];
        nodeBefore = {};
        nodeAfter = {};

        spyOn(entity, 'spawnEntityChangeEvents').and
        .returnValue(eventsToBeTriggered);
        spyOn($entity.EntityChangeEvent, 'trigger');
        $entity.entities.setNode(entityPath, nodeBefore);

        result = entity.setNode(nodeAfter);
      });

      it("should return self", function () {
        expect(result).toBe(entity);
      });

      it("should set node in container", function () {
        expect($entity.entities.getNode(entityPath)).toBe(nodeAfter);
      });

      it("should spawn events", function () {
        expect(entity.spawnEntityChangeEvents)
        .toHaveBeenCalledWith(nodeBefore, nodeAfter);
      });

      it("should trigger spawned events", function () {
        var calls = $entity.EntityChangeEvent.trigger.calls.all();

        expect(calls.length).toBe(eventsToBeTriggered.length);
        expect(calls[0].object).toBe(eventsToBeTriggered[0]);
        expect(calls[1].object).toBe(eventsToBeTriggered[1]);
        expect(calls[2].object).toBe(eventsToBeTriggered[2]);
      });
    });

    describe("deleteNode()", function () {
      var entityPath,
          eventsToBeTriggered,
          nodeBefore,
          nodeAfter;

      beforeEach(function () {
        entityPath = entityKey.getEntityPath();
        eventsToBeTriggered = [
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE),
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE),
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE)
        ];
        nodeBefore = {};
        nodeAfter = undefined;

        spyOn(entity, 'spawnEntityChangeEvents').and
        .returnValue(eventsToBeTriggered);
        spyOn($entity.EntityChangeEvent, 'trigger');
        $entity.entities.setNode(entityPath, nodeBefore);

        result = entity.deleteNode();
      });

      it("should return self", function () {
        expect(result).toBe(entity);
      });

      it("should delete node from container", function () {
        expect($entity.entities.getNode(entityPath)).toBeUndefined();
      });

      it("should spawn events", function () {
        expect(entity.spawnEntityChangeEvents)
        .toHaveBeenCalledWith(nodeBefore, nodeAfter);
      });

      it("should trigger spawned events", function () {
        var calls = $entity.EntityChangeEvent.trigger.calls.all();

        expect(calls.length).toBe(eventsToBeTriggered.length);
        expect(calls[0].object).toBe(eventsToBeTriggered[0]);
        expect(calls[1].object).toBe(eventsToBeTriggered[1]);
        expect(calls[2].object).toBe(eventsToBeTriggered[2]);
      });
    });

    describe("getChildEntity()", function () {
      var childKey;

      beforeEach(function () {
        childKey = 'foo/bar/baz'.toFieldKey();
        spyOn(entity.entityKey, 'getChildKey').and.returnValue(childKey);
        result = entity.getChildEntity('baz');
      });

      it("should retrieve child key", function () {
        expect(entity.entityKey.getChildKey).toHaveBeenCalledWith('baz');
      });

      it("should return an entity with child key", function () {
        expect($entity.Entity.mixedBy(result)).toBeTruthy();
        expect(result.entityKey).toBe(childKey);
      });
    });
  });

  describe("EntityKey", function () {
    var EntityKey,
        entityKey,
        result;

    beforeAll(function () {
      EntityKey = $oop.getClass('test.$entity.Entity.EntityKey')
      .blend($entity.EntityKey);
    });

    beforeEach(function () {
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
