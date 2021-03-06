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
      EntityKey = $oop.createClass('test.$entity.Entity.EntityKey')
      .blend($entity.EntityKey)
      .define({
        getEntityPath: function () {
          return ['foo', 'bar', this.entityName].toTreePath();
        },
        getAttributeDocumentKey: function () {
          return '__foo/bar'.toDocumentKey();
        }
      })
      .build();
      Entity = $oop.createClass('test.$entity.Entity.Entity')
      .blend($entity.Entity)
      .build();
      Entity.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      entityKey = EntityKey.create({
        entityName: 'baz'
      });
      entity = Entity.fromEntityKey(entityKey);
    });

    describe(".fromEntityKey()", function () {
      it("should return an Entity instance", function () {
        entity = Entity.fromEntityKey(entityKey);
        expect(Entity.mixedBy(entity)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        entity = Entity.fromEntityKey(entityKey);
        expect(entity.entityKey).toBe(entityKey);
      });

      it("should pass additional properties to create", function () {
        entity = Entity.fromEntityKey(entityKey, {bar: 'baz'});
        expect(entity.bar).toBe('baz');
      });
    });

    describe(".create()", function () {
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
            entity;

        beforeAll(function () {
          EntityKey = $oop.createClass('test.$entity.Entity.EntityKey')
          .blend($entity.EntityKey)
          .blend($utils.StringifyCached)
          .define({
            getEntityPath: function () {
              return ['foo', 'bar', this.entityName].toTreePath();
            },
            getAttributeDocumentKey: function () {
              return '__foo/bar'.toDocumentKey();
            },
            toString: function () {
              return this.entityName;
            }
          })
          .build();
        });

        beforeEach(function () {
          entityKey = EntityKey.create({
            entityName: 'baz'
          });
          entity = $entity.Entity.fromEntityKey(entityKey);
        });

        it("should retrieve cached instance", function () {
          var result = $entity.Entity.fromEntityKey(entityKey);
          expect(result).toBe(entity);
        });
      });
    });

    describe("#equals()", function () {
      describe("for equivalent entities", function () {
        it("should return truthy", function () {
          expect(
              'foo/bar/baz/quux'.toItem().equals('foo/bar/baz/quux'.toItem()))
          .toBeTruthy();
          expect('foo/bar/baz'.toField().equals('foo/bar/baz'.toField()))
          .toBeTruthy();
          expect('foo/bar'.toDocument().equals('foo/bar'.toDocument()))
          .toBeTruthy();
        });
      });

      describe("for non-equivalent entities", function () {
        it("should return falsy", function () {
          expect(
              'foo/bar/baz/quux'.toItem().equals('foo/bar/baz/QUUX'.toItem()))
          .toBeFalsy();
          expect('foo/bar/baz'.toField().equals('foo/bar/quux'.toField()))
          .toBeFalsy();
          expect('foo/bar/baz'.toField().equals('foo/bar'.toDocument()))
          .toBeFalsy();
          expect('foo/bar'.toDocument().equals('foo/baz'.toDocument()))
          .toBeFalsy();
          expect('foo/bar'.toDocument().equals(undefined))
          .toBeFalsy();
          expect('foo/bar'.toDocument().equals('foo'))
          .toBeFalsy();
        });
      });
    });

    describe("#getNode()", function () {
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

    describe("#getNodeWrapped()", function () {
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

    describe("#getSilentNode()", function () {
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

    describe("#getSilentNodeWrapped()", function () {
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

    describe("#touchNode()", function () {
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

    describe("#setNode()", function () {
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

    describe("#deleteNode()", function () {
      var eventsToBeTriggered;

      beforeEach(function () {
        entity = 'foo/bar/baz'.toField();
        entity.setNode('foo');
        eventsToBeTriggered = [
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE),
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE),
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE)
        ];
      });

      it("should return self", function () {
        var result = entity.deleteNode();
        expect(result).toBe(entity);
      });

      it("should delete node from container", function () {
        entity.deleteNode();
        expect(entity.getNode()).toBeUndefined();
      });

      describe("when entity has parent", function () {
        beforeEach(function () {
          entity = 'foo/bar/baz/quux'.toItem();
          entity.setNode('foo');
        });

        it("should spawn events", function () {
          spyOn($entity.CollectionField, 'spawnEntityChangeEvents');
          entity.deleteNode();
          expect($entity.CollectionField.spawnEntityChangeEvents)
          .toHaveBeenCalledWith({
            quux: 'foo'
          }, {});
        });

        it("should trigger spawned events on parent", function () {
          spyOn($entity.CollectionField, 'spawnEntityChangeEvents').and
          .returnValue(eventsToBeTriggered);
          spyOn($entity.EntityChangeEvent, 'trigger');
          entity.deleteNode();

          var calls = $entity.EntityChangeEvent.trigger.calls.all();
          expect(calls.length).toBe(eventsToBeTriggered.length);
          expect(calls[0].object).toBe(eventsToBeTriggered[0]);
          expect(calls[1].object).toBe(eventsToBeTriggered[1]);
          expect(calls[2].object).toBe(eventsToBeTriggered[2]);
        });
      });

      describe("when entity has no parent", function () {
        beforeEach(function () {
          entity = 'foo/bar'.toDocument();
          entity.setNode({foo: 'bar'});
        });

        it("should spawn events on self", function () {
          spyOn(entity, 'spawnEntityChangeEvents');
          entity.deleteNode();
          expect(entity.spawnEntityChangeEvents)
          .toHaveBeenCalledWith({
            foo: 'bar'
          }, undefined);
        });

        it("should trigger spawned events on parent", function () {
          spyOn(entity, 'spawnEntityChangeEvents').and
          .returnValue(eventsToBeTriggered);
          spyOn($entity.EntityChangeEvent, 'trigger');
          entity.deleteNode();

          var calls = $entity.EntityChangeEvent.trigger.calls.all();
          expect(calls.length).toBe(eventsToBeTriggered.length);
          expect(calls[0].object).toBe(eventsToBeTriggered[0]);
          expect(calls[1].object).toBe(eventsToBeTriggered[1]);
          expect(calls[2].object).toBe(eventsToBeTriggered[2]);
        });
      });
    });

    describe("#getChildEntity()", function () {
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

    describe("#getParentEntity()", function () {
      var fieldKey;

      beforeEach(function () {
        entity = 'foo/bar/baz/quux'.toItem();
        fieldKey = 'foo/bar/baz'.toCollectionFieldKey();
        fieldKey.getEntityPath();
      });

      it("should return parent entity", function () {
        var result = entity.getParentEntity();
        expect(result.entityKey).toEqual(fieldKey);
      });
    });
  });

  describe("EntityKey", function () {
    var entityKey,
        entity;

    beforeEach(function () {
      entityKey = 'foo/bar'.toDocumentKey();
    });

    describe("#toEntity()", function () {
      it("should return Entity instance", function () {
        entity = entityKey.toEntity();
        expect($entity.Entity.mixedBy(entity)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        entity = entityKey.toEntity();
        expect(entity.entityKey.equals('foo/bar'.toDocumentKey())).toBeTruthy();
      });

      it("should pass additional properties to create", function () {
        entity = entityKey.toEntity({bar: 'baz'});
        expect(entity.bar).toBe('baz');
      });
    });
  });
});
