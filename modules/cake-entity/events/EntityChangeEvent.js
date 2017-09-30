"use strict";

/**
 * @function $entity.EntityChangeEvent.create
 * @param {Object} properties
 * @param {string} properties.eventName
 * @param {Array.<string>} [properties.propertiesAdded]
 * @param {Array.<string>} [properties.propertiesRemoved]
 * @param {*} [properties.nodeBefore]
 * @param {*} [properties.nodeAfter]
 * @returns {$entity.EntityChangeEvent}
 */

/**
 * Signals an entity change.
 * @class $entity.EntityChangeEvent
 * @extends $event.Event
 * @todo Separate ParentEntityChangeEvent?
 */
$entity.EntityChangeEvent = $oop.getClass('$entity.EntityChangeEvent')
.mix($event.Event)
.define(/** @lends $entity.EntityChangeEvent# */{
  /**
   * Identifies child nodes that were *added* by the change.
   * @member {Array.<string>} $entity.EntityChangeEvent#propertiesAdded
   */

  /**
   * Identifies child nodes that were *removed* by the change.
   * @member {Array.<string>} $entity.EntityChangeEvent#propertiesRemoved
   */

  /**
   * Buffer that reflects the before state of the node associated with the
   * sending entity.
   * @member {*} $entity.EntityChangeEvent#nodeBefore
   */

  /**
   * Buffer that reflects the after state of the node associated with the
   * sending entity.
   * @member {*} $entity.EntityChangeEvent#nodeAfter
   */

  /** @ignore */
  spread: function () {
    this.propertiesAdded = this.propertiesAdded || [];
    this.propertiesRemoved = this.propertiesRemoved || [];
  },

  /** @inheritDoc */
  setSender: function () {
    // changing sender invalidates cached nodes
    delete this.nodeBefore;
    delete this.nodeAfter;
    return this;
  },

  /**
   * @param {Array.<string>} propertiesAdded
   * @returns {$entity.EntityChangeEvent}
   */
  setPropertiesAdded: function (propertiesAdded) {
    this.propertiesAdded = propertiesAdded;
    return this;
  },

  /**
   * @param {Array.<string>} propertiesRemoved
   * @returns {$entity.EntityChangeEvent}
   */
  setPropertiesRemoved: function (propertiesRemoved) {
    this.propertiesRemoved = propertiesRemoved;
    return this;
  },

  /**
   * @param {*} nodeBefore
   * @returns {$entity.EntityChangeEvent}
   */
  setNodeBefore: function (nodeBefore) {
    this.nodeBefore = nodeBefore;
    return this;
  },

  /**
   * @param {*} nodeAfter
   * @returns {$entity.EntityChangeEvent}
   */
  setNodeAfter: function (nodeAfter) {
    this.nodeAfter = nodeAfter;
    return this;
  },

  /**
   * Retrieves the before state of the node associated with the sending
   * entity, wrapped in a `DataContainer` instance.
   * @returns {$data.DataContainer}
   */
  getNodeBeforeWrapped: function () {
    return $data.DataContainer.fromData(this.nodeBefore);
  },

  /**
   * Retrieves the after state of the node associated with the sending
   * entity, wrapped in a `DataContainer` instance.
   * @returns {$data.DataContainer}
   */
  getNodeAfterWrapped: function () {
    return $data.DataContainer.fromData(this.nodeAfter);
  }
});

$oop.getClass('$event.Event')
.forwardTo($entity.EntityChangeEvent, function (properties) {
  return $utils.matchesPrefix(properties.eventName, 'entity.change');
});
