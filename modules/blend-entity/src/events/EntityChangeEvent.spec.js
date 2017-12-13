"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $event = window['blend-event'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("EntityChangeEvent", function () {
    var EntityChangeEvent,
        entityChangeEvent,
        result;

    beforeAll(function () {
      EntityChangeEvent = $oop.createClass('test.$entity.EntityChangeEvent.EntityChangeEvent')
      .blend($entity.EntityChangeEvent)
      .build();
      EntityChangeEvent.__builder.forwards = {list: [], lookup: {}};
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
