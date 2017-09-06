"use strict";

/**
 * @function $entity.Entity.create
 * @param {object} properties
 * @param {$entity.EntityKey} entityKey
 * @returns {$entity.Entity}
 */

/**
 * API wrapped around a data node in the entity store.
 * @class $entity.Entity
 * @extends $event.EventSender
 * @extends $event.EventListener
 */
$entity.Entity = $oop.getClass('$entity.Entity')
.mix($event.EventSender)
.mix($event.EventListener)
.define(/** @lends $entity.Entity# */{
  /**
   * Identifies entity in the entity store.
   * @member {$entity.EntityKey} $entity.Entity#entityKey
   */

  /**
   * @memberOf $entity.Entity
   * @param {$entity.EntityKey} entityKey
   * @returns {$entity.Entity}
   */
  fromEntityKey: function (entityKey) {
    return this.create({
      entityKey: entityKey
    });
  },

  /**
   * Retrieves data node associated with the current entity.
   * @returns {*}
   */
  getNode: function () {
    var entityPath = this.entityKey.getEntityPath(),
        node = $entity.entities.getNode(entityPath);

    // todo Handling invalidated access

    if (node === undefined) {
      this.trigger($entity.EVENT_ENTITY_ABSENT);
    }

    return node;
  },

  /**
   * Retrieves data node associated with the current entity, wrapped in a
   * `DataContainer` instance.
   * @returns {$data.DataContainer}
   */
  getNodeWrapped: function () {
    return $data.DataContainer.create({data: this.getNode()});
  },

  /**
   * Retrieves data node associated with the current entity, without
   * triggering events.
   * @returns {*}
   */
  getSilentNode: function () {
    var entityPath = this.entityKey.getEntityPath();
    return $entity.entities.getNode(entityPath);
  },

  /**
   * Retrieves data node associated with the current entity, without
   * triggering events, wrapped in a `DataContainer` instance.
   * @returns {$data.DataContainer}
   */
  getSilentNodeWrapped: function () {
    return $data.DataContainer.create({data: this.getSilentNode()});
  },

  /**
   * Checks entity node and triggers appropriate events, but doesn't return
   * the value.
   * @returns {$entity.Entity}
   */
  touchNode: function () {
    this.getNode();
    return this;
  }
});

// todo Might need to move these to globals.js
$oop.copyProperties($entity, /** @lends $entity */{
  /**
   * Signals a failed attempt to access the entity in the entity store.
   * (Node was not there.)
   * @constant
   */
  EVENT_ENTITY_ABSENT: 'EVENT_ENTITY_ABSENT'
});
