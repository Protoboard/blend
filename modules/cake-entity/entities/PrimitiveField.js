"use strict";

/**
 * @function $entity.PrimitiveField.create
 * @returns {$entity.PrimitiveField}
 */

/**
 * Describes a primitive field.
 * @class $entity.PrimitiveField
 * @augments $entity.Entity
 * @todo Needs better name (applicable to Fields & Items)
 */
$entity.PrimitiveField = $oop.getClass('$entity.PrimitiveField')
.expect($oop.getClass('$entity.Entity'))
.define(/** @lends $entity.PrimitiveField# */{
  /**
   * Spawns a single event if there is a change in node value.
   * @param {$data.Tree} entitiesBefore
   * @param {$data.Tree} entitiesAfter
   * @returns {Array.<$entity.EntityChangeEvent>}
   * @todo nodeBefore, nodeAfter to be passed in, not fetched.
   */
  spawnEntityChangeEvents: function (entitiesBefore, entitiesAfter) {
    var fieldKey = this.entityKey,
        entityPath = fieldKey.getEntityPath(),
        nodeBefore = entitiesBefore.getNode(entityPath),
        nodeAfter = entitiesAfter.getNode(entityPath);

    if (nodeAfter !== nodeBefore) {
      return [this.spawnEvent({
        eventName: $entity.EVENT_ENTITY_CHANGE,
        entitiesBefore: entitiesBefore,
        entitiesAfter: entitiesAfter
      })];
    } else {
      return [];
    }
  }
});
