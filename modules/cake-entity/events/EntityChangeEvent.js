"use strict";

/**
 * @function $entity.EntityChangeEvent.create
 * @param {Object} properties
 * @param {string} properties.eventName
 * @param {Array.<string>} [properties.propertiesAdded]
 * @param {Array.<string>} [properties.propertiesRemoved]
 * @param {$data.Tree} [properties.entitiesBefore]
 * @param {$data.Tree} [properties.entitiesAfter]
 * @returns {$entity.EntityChangeEvent}
 */

/**
 * Signals an entity change.
 * @class $entity.EntityChangeEvent
 * @extends $event.Event
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
   * Partial or full snapshot of the entity store reflecting its state
   * *before* the change. Might not contain any data outside of the sending
   * `EntityKey`'s scope.
   * @member {$data.Tree} $entity.EntityChangeEvent#entitiesBefore
   */

  /**
   * Partial or full snapshot of the entity store reflecting its state
   * *after* the change. Might not contain any data outside of the sending
   * `EntityKey`'s scope.
   * @member {$data.Tree} $entity.EntityChangeEvent#entitiesAfter
   */

  /**
   * Buffer that reflects the before state of the node associated with the
   * sending entity. Value is assigned on first call to `getNodeBefore()`.
   * @member {*} $entity.EntityChangeEvent#_nodeBefore
   * @private
   */

  /**
   * Buffer that reflects the after state of the node associated with the
   * sending entity. Value is assigned on first call to `getNodeAfter()`.
   * @member {*} $entity.EntityChangeEvent#_nodeAfter
   * @private
   */

  /** @ignore */
  spread: function () {
    this.propertiesAdded = this.propertiesAdded || [];
    this.propertiesRemoved = this.propertiesRemoved || [];
  },

  /** @inheritDoc */
  setSender: function () {
    // changing sender invalidates cached nodes
    delete this._nodeBefore;
    delete this._nodeAfter;
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
   * @param {$data.Tree} entitiesBefore
   * @returns {$entity.EntityChangeEvent}
   */
  setEntitiesBefore: function (entitiesBefore) {
    this.entitiesBefore = entitiesBefore;
    delete this._nodeBefore;
    return this;
  },

  /**
   * @param {$data.Tree} entitiesAfter
   * @returns {$entity.EntityChangeEvent}
   */
  setEntitiesAfter: function (entitiesAfter) {
    this.entitiesAfter = entitiesAfter;
    delete this._nodeAfter;
    return this;
  },

  /**
   * Retrieves the before state of the node associated with the sending entity.
   * @returns {*}
   */
  getNodeBefore: function () {
    var entityPath;

    if (!hOP.call(this, '_nodeBefore')) {
      entityPath = this.sender.entityKey.getEntityPath();
      this._nodeBefore = this.entitiesBefore.getNode(entityPath);
    }

    return this._nodeBefore;
  },

  /**
   * Retrieves the before state of the node associated with the sending
   * entity, wrapped in a `DataContainer` instance.
   * @returns {$data.DataContainer}
   */
  getNodeBeforeWrapped: function () {
    return $data.DataContainer.fromData(this.getNodeBefore());
  },

  /**
   * Retrieves the after state of the node associated with the sending entity.
   * @returns {*}
   */
  getNodeAfter: function () {
    var entityPath;

    if (!hOP.call(this, '_nodeAfter')) {
      entityPath = this.sender.entityKey.getEntityPath();
      this._nodeAfter = this.entitiesAfter.getNode(entityPath);
    }

    return this._nodeAfter;
  },

  /**
   * Retrieves the after state of the node associated with the sending
   * entity, wrapped in a `DataContainer` instance.
   * @returns {$data.DataContainer}
   */
  getNodeAfterWrapped: function () {
    return $data.DataContainer.fromData(this.getNodeAfter());
  }
});

$oop.getClass('$event.Event')
.forwardTo($entity.EntityChangeEvent, function (properties) {
  return $utils.matchesPrefix(properties.eventName, 'entity.change');
});
