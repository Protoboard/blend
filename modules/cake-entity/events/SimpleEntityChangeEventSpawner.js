"use strict";

/**
 * Describes an entity that triggers a single event when changed.
 * @class $entity.SimpleEntityChangeEventSpawner
 * @augments $entity.Entity
 */
$entity.SimpleEntityChangeEventSpawner = $oop.getClass('$entity.SimpleEntityChangeEventSpawner')
.expect($oop.getClass('$entity.Entity'))
.define(/** @lends $entity.SimpleEntityChangeEventSpawner# */{
  /**
   * Spawns a single event if there is a change in node value.
   * @param {*} nodeBefore
   * @param {*} nodeAfter
   * @returns {Array.<$entity.EntityChangeEvent>}
   */
  spawnEntityChangeEvents: function spawnEntityChangeEvents(nodeBefore,
      nodeAfter
  ) {
    var events = spawnEntityChangeEvents.returned;

    if (nodeAfter !== nodeBefore) {
      return events.concat([this.spawnEvent({
        eventName: $entity.EVENT_ENTITY_CHANGE,
        nodeBefore: nodeBefore,
        nodeAfter: nodeAfter
      })]);
    } else {
      return events;
    }
  }
});
