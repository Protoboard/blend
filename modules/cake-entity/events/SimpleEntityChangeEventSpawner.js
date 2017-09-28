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
   * @param {$data.Tree} entitiesBefore
   * @param {$data.Tree} entitiesAfter
   * @returns {Array.<$entity.EntityChangeEvent>}
   * @todo nodeBefore, nodeAfter to be passed in, not fetched.
   */
  spawnEntityChangeEvents: function spawnEntityChangeEvents(entitiesBefore,
      entitiesAfter
  ) {
    var events = spawnEntityChangeEvents.returned,
        fieldKey = this.entityKey,
        entityPath = fieldKey.getEntityPath(),
        nodeBefore = entitiesBefore.getNode(entityPath),
        nodeAfter = entitiesAfter.getNode(entityPath);

    if (nodeAfter !== nodeBefore) {
      return events.concat([this.spawnEvent({
        eventName: $entity.EVENT_ENTITY_CHANGE,
        entitiesBefore: entitiesBefore,
        entitiesAfter: entitiesAfter
      })]);
    } else {
      return events;
    }
  }
});
