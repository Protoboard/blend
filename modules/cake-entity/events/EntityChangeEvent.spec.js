"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("EntityChangeEvent", function () {
    var EntityChangeEvent,
        entityChangeEvent,
        result;

    beforeEach(function () {
      EntityChangeEvent = $oop.getClass('test.$entity.EntityChangeEvent.EntityChangeEvent')
      .mix($entity.EntityChangeEvent);
      entityChangeEvent = EntityChangeEvent.fromEventName('event1');
    });

    describe("create()", function () {
      it("should initialize propertiesAdded property", function () {
        expect(entityChangeEvent.propertiesAdded).toEqual([]);
      });

      it("should initialize propertiesRemoved property", function () {
        expect(entityChangeEvent.propertiesRemoved).toEqual([]);
      });
    });

    describe("setSender()", function () {
      var sender;

      beforeEach(function () {
        sender = {};
        entityChangeEvent._nodeBefore = {};
        entityChangeEvent._nodeAfter = {};
        result = entityChangeEvent.setSender(sender);
      });

      it("should return self", function () {
        expect(result).toBe(entityChangeEvent);
      });

      it("should invalidate dependant properties", function () {
        expect(entityChangeEvent.hasOwnProperty('_nodeBefore')).toBeFalsy();
        expect(entityChangeEvent.hasOwnProperty('_nodeAfter')).toBeFalsy();
      });
    });

    describe("setPropertiesAdded()", function () {
      var propertiesAdded;

      beforeEach(function () {
        propertiesAdded = ['foo', 'bar'];
        result = entityChangeEvent.setPropertiesAdded(propertiesAdded);
      });

      it("should return self", function () {
        expect(result).toBe(entityChangeEvent);
      });

      it("should set propertiesAdded property", function () {
        expect(entityChangeEvent.propertiesAdded).toBe(propertiesAdded);
      });
    });

    describe("setPropertiesRemoved()", function () {
      var propertiesRemoved;

      beforeEach(function () {
        propertiesRemoved = ['foo', 'bar'];
        result = entityChangeEvent.setPropertiesRemoved(propertiesRemoved);
      });

      it("should return self", function () {
        expect(result).toBe(entityChangeEvent);
      });

      it("should set propertiesRemoved property", function () {
        expect(entityChangeEvent.propertiesRemoved).toBe(propertiesRemoved);
      });
    });

    describe("setEntitiesBefore()", function () {
      var entitiesBefore;

      beforeEach(function () {
        entitiesBefore = $data.Tree.create();
        entityChangeEvent._nodeBefore = {};
        result = entityChangeEvent.setEntitiesBefore(entitiesBefore);
      });

      it("should return self", function () {
        expect(result).toBe(entityChangeEvent);
      });

      it("should set entitiesBefore property", function () {
        expect(entityChangeEvent.entitiesBefore).toBe(entitiesBefore);
      });

      it("should invalidate _nodeBefore", function () {
        expect(entityChangeEvent.hasOwnProperty('_nodeBefore')).toBeFalsy();
      });
    });

    describe("setEntitiesAfter()", function () {
      var entitiesAfter;

      beforeEach(function () {
        entitiesAfter = $data.Tree.create();
        entityChangeEvent._nodeAfter = {};
        result = entityChangeEvent.setEntitiesAfter(entitiesAfter);
      });

      it("should return self", function () {
        expect(result).toBe(entityChangeEvent);
      });

      it("should set entitiesAfter property", function () {
        expect(entityChangeEvent.entitiesAfter).toBe(entitiesAfter);
      });

      it("should invalidate _nodeAfter", function () {
        expect(entityChangeEvent.hasOwnProperty('_nodeAfter')).toBeFalsy();
      });
    });

    describe("getNodeBefore()", function () {
      var entitiesBefore;

      beforeEach(function () {
        entitiesBefore = $data.Tree.fromData({
          document: {
            foo: {
              bar: "baz"
            }
          }
        });

        spyOn(entitiesBefore, 'getNode').and.callThrough();

        entityChangeEvent
        .setSender('foo/bar'.toDocumentKey())
        .setEntitiesBefore(entitiesBefore);

        result = entityChangeEvent.getNodeBefore();
      });

      it("should fetch node from entitiesBefore", function () {
        expect(entitiesBefore.getNode)
        .toHaveBeenCalledWith('document.foo.bar'.toPath());
      });

      it("should set _nodeBefore", function () {
        expect(entityChangeEvent._nodeBefore).toBe("baz");
      });

      it("should return _nodeBefore", function () {
        expect(result).toBe("baz");
      });

      describe("when _nodeBefore already set", function () {
        beforeEach(function () {
          entityChangeEvent.getNodeBefore();
        });

        it("should not fetch node again", function () {
          expect(entitiesBefore.getNode)
          .toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("getNodeBeforeWrapped()", function () {
      var nodeBefore;

      beforeEach(function () {
        nodeBefore = {};
        spyOn(entityChangeEvent, 'getNodeBefore').and.returnValue(nodeBefore);
        result = entityChangeEvent.getNodeBeforeWrapped();
      });

      it("should invoke getNodeBefore()", function () {
        expect(entityChangeEvent.getNodeBefore).toHaveBeenCalled();
      });

      it("should return DataContainer instance", function () {
        expect($data.DataContainer.mixedBy(result)).toBeTruthy();
      });

      it("should set data buffer to result of getNodeBefore()", function () {
        expect(result.data).toBe(nodeBefore);
      });
    });

    describe("getNodeAfter()", function () {
      var entitiesAfter;

      beforeEach(function () {
        entitiesAfter = $data.Tree.fromData({
          document: {
            foo: {
              bar: "baz"
            }
          }
        });

        spyOn(entitiesAfter, 'getNode').and.callThrough();

        entityChangeEvent
        .setSender('foo/bar'.toDocumentKey())
        .setEntitiesAfter(entitiesAfter);

        result = entityChangeEvent.getNodeAfter();
      });

      it("should fetch node from entitiesAfter", function () {
        expect(entitiesAfter.getNode)
        .toHaveBeenCalledWith('document.foo.bar'.toPath());
      });

      it("should set _nodeAfter", function () {
        expect(entityChangeEvent._nodeAfter).toBe("baz");
      });

      it("should return _nodeAfter", function () {
        expect(result).toBe("baz");
      });

      describe("when _nodeAfter already set", function () {
        beforeEach(function () {
          entityChangeEvent.getNodeAfter();
        });

        it("should not fetch node again", function () {
          expect(entitiesAfter.getNode)
          .toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("getNodeAfterWrapped()", function () {
      var nodeAfter;

      beforeEach(function () {
        nodeAfter = {};
        spyOn(entityChangeEvent, 'getNodeAfter').and.returnValue(nodeAfter);
        result = entityChangeEvent.getNodeAfterWrapped();
      });

      it("should invoke getNodeAfter()", function () {
        expect(entityChangeEvent.getNodeAfter).toHaveBeenCalled();
      });

      it("should return DataContainer instance", function () {
        expect($data.DataContainer.mixedBy(result)).toBeTruthy();
      });

      it("should set data buffer to result of getNodeAfter()", function () {
        expect(result.data).toBe(nodeAfter);
      });
    });
  });
});
