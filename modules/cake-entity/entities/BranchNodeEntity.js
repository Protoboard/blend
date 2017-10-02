"use strict";

/**
 * Describes an entity that wraps a branch node in the entity container.
 * Expects to be added to $entity.Entity classes.
 * @mixin $entity.BranchNodeEntity
 * @augments $entity.Entity
 * @todo Add spread w/ triggerPath to nodeType
 */
$entity.BranchNodeEntity = $oop.getClass('$entity.BranchNodeEntity')
.expect($oop.getClass('$entity.Entity'))
.define(/** @lends $entity.BranchNodeEntity# */{
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
   * Appends properties of the specified node to those of the current
   * entity, and triggers change events for all affected entities. Second
   * degree children and beyond will be overwritten just like in
   * {@link $entity.Entity#setNode}.
   * @param {Object} node
   * @returns {$entity.BranchNodeEntity}
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
