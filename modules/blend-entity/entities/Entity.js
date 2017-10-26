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
 */
$entity.Entity = $oop.getClass('$entity.Entity')
.blend($event.EventSender)
.blend($event.EventListener)
.blend($oop.getClass('$entity.EntityKeyHost'))
.define(/** @lends $entity.Entity# */{
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

  /** @ignore */
  init: function () {
    var entityKey = this.entityKey,
        listeningPath = entityKey.getEntityPath()
        .clone().unshift('entity'),
        attributeDocumentKey = entityKey.getAttributeDocumentKey();

    this.setListeningPath(listeningPath);

    this
    .addTriggerPath(listeningPath)
    .addTriggerPath($data.Path.fromString('entity'))
    .addTriggerPath(
        attributeDocumentKey.getEntityPath().clone().unshift('entity'));
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
        entityPath = this.entityKey.getEntityPath(),
        events;

    if (node !== nodeBefore) {
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
        events;

    if (nodeBefore !== undefined) {
      $entity.entities.deleteNode(this.entityKey.getEntityPath());
      events = this.spawnEntityChangeEvents(nodeBefore, undefined);
      $data.Collection.fromData(events)
      .callOnEachValue('trigger');
    }

    return this;
  },

  /**
   * Retrieves the child entity identified by `childId`.
   * @param {string} childId
   * @returns {$entity.Entity}
   * @todo Farm out to ParentEntity mixin.
   */
  getChildEntity: function (childId) {
    var childKey = this.entityKey.getChildKey(childId);
    return $entity.Entity.fromEntityKey(childKey);
  }
});

// caching Entity if key is cached
$entity.Entity
.forwardBlend($oop.getClass('$entity.EntityKeyCached'), function (properties) {
  return $utils.StringifyCached.mixedBy(properties.entityKey);
});

$oop.getClass('$entity.EntityKey')
.delegate(/** @lends $entity.EntityKey# */{
  /**
   * @returns {$entity.Entity}
   */
  toEntity: function () {
    return $entity.Entity.fromEntityKey(this);
  }
});
