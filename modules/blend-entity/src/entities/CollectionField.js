"use strict";

/**
 * @function $entity.CollectionField.create
 * @returns {$entity.CollectionField}
 */

/**
 * @class $entity.CollectionField
 * @extends $entity.Field
 * @extends $entity.BranchNoded
 */
$entity.CollectionField = $oop.createClass('$entity.CollectionField')
.blend($entity.Field)
.blend($entity.BranchNoded)
.define(/** @lends $entity.CollectionField# */{
  /** @ignore */
  init: function () {
    var collectionFieldKey = this.entityKey,
        itemIdType = collectionFieldKey.getItemIdType() || 'string',
        // same as $entity.ItemIdTypePath.fromItemIdType() but skipping a few
        // steps
        itemIdTypePath = 'entity.document.__field.__field/itemIdType.options.' +
            $data.escapeTreePathComponent(itemIdType),
        itemValueType = collectionFieldKey.getItemValueType() || 'string',
        // same as $entity.ItemValueTypePath.fromItemValueType() but skipping a
        // few steps
        itemValueTypePath = 'entity.document.__field.__field/itemValueType.options.' +
            $data.escapeTreePathComponent(itemValueType);

    this
    .addTriggerPath(itemIdTypePath)
    .addTriggerPath(itemValueTypePath);
  },

  /**
   * Spawns a single event if there is a change in node value.
   * @param {*} nodeBefore
   * @param {*} nodeAfter
   * @returns {Array.<$entity.EntityChangeEvent>}
   */
  spawnEntityChangeEvents: function spawnEntityChangeEvents(nodeBefore,
      nodeAfter
  ) {
    var that = this,
        events = spawnEntityChangeEvents.returned,
        itemIdsBefore = $data.Collection.fromData(nodeBefore)
        .getKeysWrapped().toStringSet(),
        itemIdsAfter = $data.Collection.fromData(nodeAfter)
        .getKeysWrapped().toStringSet(),

        // grouping properties by add / remove / change
        itemIdsAdded = itemIdsAfter.subtract(itemIdsBefore),
        itemIdsRemoved = itemIdsAfter.subtractFrom(itemIdsBefore),
        itemIdsRemain = itemIdsAfter.intersectWith(itemIdsBefore);

    // adding single event about add / remove
    if (itemIdsAdded.getItemCount() !== 0 || itemIdsRemoved.getItemCount() !== 0) {
      events.push(this.spawnEvent({
        eventName: $entity.EVENT_ENTITY_CHANGE,
        propertiesAdded: itemIdsAdded.asCollection().getKeys(),
        propertiesRemoved: itemIdsRemoved.asCollection().getKeys()
      }));
    }

    // adding separate events about changed properties
    itemIdsRemain.toCollection()
    // Here we're assuming that items are always leaf nodes. Which they are
    // ATM, but if this changes in the future, this section must be changed.
    .filter(function (propertyName) {
      return nodeAfter[propertyName] !== nodeBefore[propertyName];
    })
    .forEachItem(function (propertyName) {
      // This deliberately duplicates
      // LeafNoded#spawnEntityChangeEvents for performance
      // reasons.
      var childEntity = that.getChildEntity(propertyName);
      events.push(childEntity.spawnEvent({
        eventName: $entity.EVENT_ENTITY_CHANGE,
        nodeBefore: nodeBefore[propertyName],
        nodeAfter: nodeAfter[propertyName]
      }));
    });

    return events;
  }
})
.build();

$entity.Field
.forwardBlend($entity.CollectionField, function (properties) {
  return $entity.CollectionFieldKey.mixedBy(properties.entityKey);
});