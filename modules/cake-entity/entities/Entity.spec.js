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

    describe("create()", function () {
      describe("when entityKey is cached", function () {
        var EntityKey,
            entityKey,
            entity,
            result;

        beforeEach(function () {
          EntityKey = $oop.getClass('test.$entity.Entity.EntityKey')
          .mix($entity.EntityKey)
          .mix($utils.StringifyCached)
          .define({
            toString: function () {
              return this.foo;
            }
          });
          entityKey = EntityKey.create({foo: 'bar'});
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
          expect(entity.trigger).toHaveBeenCalledWith('entity.absent');
        });
      });
    });

    describe("setPrimitiveNode()", function () {
      var documentKey,
          documentPath,
          triggeredEvent,
          nodeBefore,
          nodeAfter;

      beforeEach(function () {
        documentKey = 'foo/bar'.toDocumentKey();
        documentPath = documentKey.getEntityPath();
        nodeBefore = {};
        nodeAfter = {};

        spyOn($entity.EntityChangeEvent, 'trigger').and.callFake(function () {
          triggeredEvent = this;
          return $utils.Deferred.create().promise;
        });
        $entity.entities.setNode(documentPath, nodeBefore);

        result = entity.setPrimitiveNode(nodeAfter);
      });

      it("should return self", function () {
        expect(result).toBe(entity);
      });

      it("should set node in container", function () {
        expect($entity.entities.getNode(documentPath)).toBe(nodeAfter);
      });

      it("should trigger change event", function () {
        expect(triggeredEvent.eventName).toEqual($entity.EVENT_ENTITY_CHANGE);
        expect(triggeredEvent.sender).toEqual(entity);
        expect(triggeredEvent.getNodeBefore()).toBe(nodeBefore);
        expect(triggeredEvent.getNodeAfter()).toBe(nodeAfter);
      });
    });

    describe("setNode()", function () {
      var documentKey,
          documentPath,
          eventsToBeTriggered,
          triggeredEvents,
          nodeBefore,
          nodeAfter;

      beforeEach(function () {
        documentKey = 'foo/bar'.toDocumentKey();
        documentPath = documentKey.getEntityPath();
        eventsToBeTriggered = [
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE),
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE),
          $event.Event.fromEventName($entity.EVENT_ENTITY_CHANGE)
        ];
        triggeredEvents = [];
        nodeBefore = {};
        nodeAfter = {};

        spyOn(entity, 'spawnEntityChangeEvents').and
        .returnValue(eventsToBeTriggered);
        spyOn($entity.EntityChangeEvent, 'trigger').and.callFake(function () {
          triggeredEvents.push(this);
          return $utils.Deferred.create().promise;
        });
        $entity.entities.setNode(documentPath, nodeBefore);

        result = entity.setNode(nodeAfter);
      });

      it("should return self", function () {
        expect(result).toBe(entity);
      });

      it("should set node in container", function () {
        expect($entity.entities.getNode(documentPath)).toBe(nodeAfter);
      });

      it("should spawn events", function () {
        expect(entity.spawnEntityChangeEvents).toHaveBeenCalledWith(
            $data.Tree.fromData({
              document: {
                foo: {
                  bar: nodeBefore
                }
              }
            }),
            $data.Tree.fromData({
              document: {
                foo: {
                  bar: nodeAfter
                }
              }
            }));
      });

      it("should trigger spawned events", function () {
        expect(triggeredEvents).toEqual(eventsToBeTriggered);
      });
    });

    describe("getChildEntity()", function () {
      var fieldKey;

      beforeEach(function () {
        fieldKey = 'foo/bar/baz'.toFieldKey();
        spyOn(entity.entityKey, 'getChildKey').and.returnValue(fieldKey);
        result = entity.getChildEntity('baz');
      });

      it("should retrieve child key", function () {
        expect(entity.entityKey.getChildKey).toHaveBeenCalledWith('baz');
      });

      it("should return an entity with child key", function () {
        expect($entity.Entity.mixedBy(result)).toBeTruthy();
        expect(result.entityKey).toBe(fieldKey);
      });
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
