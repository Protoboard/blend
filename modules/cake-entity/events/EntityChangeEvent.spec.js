"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'],
    $event = window['cake-event'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("EntityChangeEvent", function () {
    var EntityChangeEvent,
        entityChangeEvent,
        result;

    beforeAll(function () {
      EntityChangeEvent = $oop.getClass('test.$entity.EntityChangeEvent.EntityChangeEvent')
      .mix($entity.EntityChangeEvent);
    });

    beforeEach(function () {
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
        entityChangeEvent.nodeBefore = {};
        entityChangeEvent.nodeAfter = {};
        result = entityChangeEvent.setSender(sender);
      });

      it("should return self", function () {
        expect(result).toBe(entityChangeEvent);
      });

      it("should invalidate dependant properties", function () {
        expect(entityChangeEvent.hasOwnProperty('nodeBefore')).toBeFalsy();
        expect(entityChangeEvent.hasOwnProperty('nodeAfter')).toBeFalsy();
      });
    });

    describe("getNodeBeforeWrapped()", function () {
      beforeEach(function () {
        result = entityChangeEvent.getNodeBeforeWrapped();
      });

      it("should return DataContainer instance", function () {
        expect($data.DataContainer.mixedBy(result)).toBeTruthy();
      });

      it("should set data buffer to nodeBefore", function () {
        expect(result.data).toBe(entityChangeEvent.nodeBefore);
      });
    });

    describe("getNodeAfterWrapped()", function () {
      beforeEach(function () {
        result = entityChangeEvent.getNodeAfterWrapped();
      });

      it("should return DataContainer instance", function () {
        expect($data.DataContainer.mixedBy(result)).toBeTruthy();
      });

      it("should set data buffer to nodeAfter", function () {
        expect(result.data).toBe(entityChangeEvent.nodeAfter);
      });
    });
  });
});

describe("$event", function () {
  describe("Event", function () {
    var result;

    describe("create()", function () {
      describe("when event name is EVENT_ENTITY_CHANGE", function () {
        beforeEach(function () {
          result = $event.Event.fromEventName('entity.change.foo.bar');
        });

        it("should return an EntityChangeEvent instance", function () {
          expect($entity.EntityChangeEvent.mixedBy(result)).toBeTruthy();
        });
      });
    });
  });
});
