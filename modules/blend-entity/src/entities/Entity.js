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
 * @extends $entity.EntityKeyHost
 * @mixes $utils.Equatable
 */
$entity.Entity = $oop.createClass('$entity.Entity')
.blend($event.EventSender)
.blend($event.EventListener)
.blend($entity.EntityKeyHost)
.blend($utils.Equatable)
.define(/** @lends $entity.Entity# */{
  /**
   * @memberOf $entity.Entity
   * @param {$entity.EntityKey} entityKey
   * @param {Object} [properties]
   * @returns {$entity.Entity}
   */
  fromEntityKey: function (entityKey, properties) {
    return this.create({
      entityKey: entityKey
    }, properties);
  },

  /** @ignore */
  init: function () {
    var entityKey = this.entityKey,
        listeningPath = entityKey.getEntityPath()
        .clone().unshift('entity').toString(),
        attributeDocumentKey = entityKey.getAttributeDocumentKey();

    this
    .setListeningPath(listeningPath)
    .addTriggerPath(listeningPath)
    .addTriggerPath('entity')
    .addTriggerPath('entity.' + attributeDocumentKey.getEntityPath());
  },

  /**
   * @param {*} nodeBefore
   * @return {Object}
   * @private
   */
  _getParentNodeBefore: function (nodeBefore) {
    var result = {};
    result[this.entityKey.entityName] = nodeBefore;
    return result;
  },

  /**
   * @param {$entity.Entity} entity
   * @return {boolean}
   */
  equals: function equals(entity) {
    return equals.returned &&
        this.entityKey.equals(entity && entity.entityKey);
  },

  /**
   * Retrieves data node associated with the current entity.
   * @returns {*}
   */
  getNode: function () {
    var entityPath = this.entityKey.getEntityPath(),
        node = $entity.entities.getNode(entityPath);

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
  },

  /**
   * Spawns events for all changes affected by the change specified by
   * `nodeBefore` and `nodeAfter`
   * @param {*} nodeBefore
   * @param {*} nodeAfter
   * @returns {Array.<$entity.EntityChangeEvent>}
   */
  spawnEntityChangeEvents: function (nodeBefore, nodeAfter) {
    return [];
  },

  /**
   * Sets specified node as new value for the current entity, and
   * triggers change events for all affected entities.
   * @param {*} node
   * @returns {$entity.Entity}
   */
  setNode: function (node) {
    var nodeBefore = this.getSilentNode(),
        entityPath,
        events;

    if (node !== nodeBefore) {
      entityPath = this.entityKey.getEntityPath();
      $entity.entities.setNode(entityPath, node);

      events = this.spawnEntityChangeEvents(nodeBefore, node);
      $data.Collection.fromData(events)
      .callOnEachValue('trigger');
    }

    return this;
  },

  /**
   * Deletes current entity node and triggers change events for all affected
   * entities.
   * @returns {$entity.Entity}
   */
  deleteNode: function () {
    var nodeBefore = this.getSilentNode(),
        entityPath,
        parentEntity,
        events;

    if (nodeBefore !== undefined) {
      entityPath = this.entityKey.getEntityPath();
      $entity.entities.deleteNode(entityPath);

      parentEntity = this.getParentEntity();
      if (parentEntity) {
        // deleting a node changes parent, not self
        events = parentEntity
        .spawnEntityChangeEvents(this._getParentNodeBefore(nodeBefore), {});
      } else {
        // falling back to setNode(undefined) equivalent
        events = this.spawnEntityChangeEvents(nodeBefore, undefined);
      }
      $data.Collection.fromData(events)
      .callOnEachValue('trigger');
    }

    return this;
  },

  /**
   * Retrieves the child entity identified by `childId`.
   * @param {string} childId
   * @returns {$entity.Entity}
   */
  getChildEntity: function (childId) {
    var childKey = this.entityKey.getChildKey(childId);
    return childKey && $entity.Entity.fromEntityKey(childKey);
  },

  /**
   * Retrieves the parent entity.
   * @returns {$entity.Entity}
   */
  getParentEntity: function () {
    var parentKey = this.entityKey.parentKey;
    return parentKey && $entity.Entity.fromEntityKey(parentKey);
  }
})
.build();

// caching Entity if key is cached
$entity.Entity
.forwardBlend($entity.EntityKeyCached, function (properties) {
  return $utils.StringifyCached.mixedBy(properties.entityKey);
});

$entity.EntityKey
.delegate(/** @lends $entity.EntityKey# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.Entity}
   */
  toEntity: function (properties) {
    return $entity.Entity.fromEntityKey(this, properties);
  }
});
