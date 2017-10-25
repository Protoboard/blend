"use strict";

/**
 * Describes an entity that wraps a branch node in the entity container.
 * Expects to be added to $entity.Entity classes.
 * @mixin $entity.BranchNoded
 * @augments $entity.Entity
 */
$entity.BranchNoded = $oop.getClass('$entity.BranchNoded')
.expect($oop.getClass('$entity.Entity'))
.define(/** @lends $entity.BranchNoded# */{
  /** @ignore */
  init: function () {
    var entityKey = this.entityKey,
        attributeDocumentKey = entityKey.getAttributeDocumentKey(),
        entityType = attributeDocumentKey.documentType,
        nodeTypeKey = $entity.DocumentKey.fromComponents(entityType, 'nodeType'),
        nodeTypePath = $data.Path.fromComponents([
          'entity', 'document', '__field', nodeTypeKey.toString(), 'options',
          'branch']);

    // todo Not 100% certain this is justified
    this.triggerPaths.push(nodeTypePath);
  },

  /**
   * Extracts a node of affected properties reflecting the entity's current
   * state.
   * @param {Object} nodeAfter
   * @returns {Object}
   * @private
   */
  _extractNodeBeforeForAppend: function (nodeAfter) {
    var nodeBefore = this.getSilentNode();

    return $data.Collection.fromData(nodeAfter)
    .mapValues(function (value, key) {
      return key;
    })
    .toStringCollection()
    .join($data.Collection.fromData(nodeBefore))
        .data;
  },

  /**
   * Sets specified *leaf* node as new value for the current entity,
   * and triggers change event for the current entity only.
   * @param {*} node
   * @returns {$entity.BranchNoded}
   */
  setNodeAsLeaf: function (node) {
    var nodeBefore = this.getSilentNode(),
        entityPath = this.entityKey.getEntityPath();

    if (node !== nodeBefore) {
      $entity.entities.setNode(entityPath, node);
      this.spawnEvent({
        eventName: $entity.EVENT_ENTITY_CHANGE,
        nodeBefore: nodeBefore,
        nodeAfter: node
      })
      .trigger();
    }

    return this;
  },

  /**
   * Appends properties of the specified node to those of the current
   * entity, and triggers change events for all affected entities. Second
   * degree children and beyond will be overwritten just like in
   * {@link $entity.Entity#setNode}.
   * @param {Object} node
   * @returns {$entity.BranchNoded}
   * @todo Add removal counterpart
   */
  appendNode: function (node) {
    var entityPath = this.entityKey.getEntityPath(),
        nodeBefore = this._extractNodeBeforeForAppend(node),
        events;

    $entity.entities.appendNode(entityPath, node);
    events = this.spawnEntityChangeEvents(nodeBefore, node);
    $data.Collection.fromData(events)
    .callOnEachValue('trigger');

    return this;
  }
});
