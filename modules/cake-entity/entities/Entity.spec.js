"use strict";

var $oop = window['cake-oop'],
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
    });

    describe("appendNode()", function () {
    });

    describe("unsetNode()", function () {
    });
  });
});
