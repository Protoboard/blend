"use strict";

/**
 * @mixin $entity.LeafNoded
 * @augments $entity.Entity
 * @implements $utils.Stringifiable
 */
$entity.LeafNoded = $oop.getClass('$entity.LeafNoded')
.expect($oop.getClass('$entity.Entity'))
.implement($utils.Stringifiable)
.define(/** @lends $entity.LeafNoded# */{
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
  },

  /**
   * @returns {string}
   */
  toString: function () {
    return $utils.stringify(this.getNode());
  }
});
