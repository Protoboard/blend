"use strict";

/**
 * Describes an entity that triggers events about added / removed properties
 * and delegates triggering to changed child entities.
 * @class $entity.ShallowEntityChangeEventSpawner
 * @augments $entity.Entity
 * @todo Rename
 */
$entity.ShallowEntityChangeEventSpawner = $oop.getClass('$entity.ShallowEntityChangeEventSpawner')
.expect($oop.getClass('$entity.Entity'))
.define(/** @lends $entity.ShallowEntityChangeEventSpawner# */{
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
        propertyNamesBefore = $data.Collection.fromData(nodeBefore)
        .getKeysWrapped().toStringSet(),
        propertyNamesAfter = $data.Collection.fromData(nodeAfter)
        .getKeysWrapped().toStringSet(),

        // grouping properties by add / remove / change
        propertyNamesAdded = propertyNamesAfter.subtract(propertyNamesBefore),
        propertyNamesRemoved = propertyNamesAfter.subtractFrom(propertyNamesBefore),
        propertyNamesRemain = propertyNamesAfter.intersectWith(propertyNamesBefore);

    // adding single event about add / remove
    events.push(this.spawnEvent({
      eventName: $entity.EVENT_ENTITY_CHANGE,
      propertiesAdded: propertyNamesAdded.asCollection().getKeys(),
      propertiesRemoved: propertyNamesRemoved.asCollection().getKeys()
    }));

    // adding separate events about changed properties
    propertyNamesRemain.toCollection()
    // Here we're assuming that items are always leaf nodes. Which they are
    // ATM, but if this changes in the future, this section must be changed.
    .filter(function (propertyName) {
      return nodeAfter[propertyName] !== nodeBefore[propertyName];
    })
    .forEachItem(function (propertyName) {
      // This deliberately duplicates
      // SimpleEntityChangeEventSpawner#spawnEntityChangeEvents for performance
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
});