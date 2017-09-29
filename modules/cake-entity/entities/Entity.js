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
.mix($event.EventSender)
.mix($event.EventListener)
.mix($oop.getClass('$entity.EntityKeyHost'))
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
   * `entitiesBefore` and `entitiesAfter`
   * @param {$data.Tree} entitiesBefore
   * @param {$data.Tree} entitiesAfter
   * @param {*} nodeBefore
   * @param {*} nodeAfter
   * @returns {Array.<$entity.EntityChangeEvent>}
   * @todo Are entitiesBefore & entitiesAfter still necessary? Check after
   * having added appendNode.
   */
  spawnEntityChangeEvents: function (entitiesBefore, entitiesAfter, nodeBefore,
      nodeAfter
  ) {
    return [];
  },

  /**
   * Sets specified *primitive* node as new value for the current entity,
   * and triggers change event for the current entity only. Primitive nodes
   * are considered *non-object* nodes.
   * @param {*} node
   * @returns {$entity.Entity}
   */
  setPrimitiveNode: function (node) {
    var nodeBefore = this.getSilentNode(),
        entityPath = this.entityKey.getEntityPath();

    if (node !== nodeBefore) {
      $entity.entities.setNode(entityPath, node);
      this.spawnEvent({
        eventName: $entity.EVENT_ENTITY_CHANGE,
        _nodeBefore: nodeBefore,
        _nodeAfter: node
      })
      .trigger();
    }

    return this;
  },

  /**
   * Sets specified node as new value for the current entity, and
   * triggers change events for all affected child entities.
   * @param {*} node
   * @returns {$entity.Entity}
   */
  setNode: function (node) {
    var nodeBefore = this.getSilentNode(),
        entityPath = this.entityKey.getEntityPath(),
        entitiesBefore = $data.Tree.create().setNode(entityPath, nodeBefore),
        entitiesAfter = $data.Tree.create().setNode(entityPath, node),
        events;

    if (node !== nodeBefore) {
      $entity.entities.setNode(entityPath, node);

      events = this.spawnEntityChangeEvents(entitiesBefore, entitiesAfter,
          nodeBefore, node);
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
// todo Replace w/ forwardMix when available
$entity.Entity.forwardTo(
    $oop.mixClass($entity.Entity, $oop.getClass('$entity.EntityKeyCached')),
    function (properties) {
      var entityKey = properties.entityKey;
      return $utils.StringifyCached.mixedBy(entityKey);
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
