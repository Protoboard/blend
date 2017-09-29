"use strict";

/**
 * Describes an entity that triggers events about added / removed properties
 * and delegates triggering to changed child entities.
 * @class $entity.ShallowEntityChangeEventSpawner
 * @augments $entity.Entity
 */
$entity.ShallowEntityChangeEventSpawner = $oop.getClass('$entity.ShallowEntityChangeEventSpawner')
.expect($oop.getClass('$entity.Entity'))
.define(/** @lends $entity.ShallowEntityChangeEventSpawner# */{
  /**
   * Spawns a single event if there is a change in node value.
   * @param {$data.Tree} entitiesBefore
   * @param {$data.Tree} entitiesAfter
   * @returns {Array.<$entity.EntityChangeEvent>}
   * @todo nodeBefore, nodeAfter to be passed in, not fetched.
   */
  spawnEntityChangeEvents: function spawnEntityChangeEvents(entitiesBefore,
      entitiesAfter
  ) {
    var that = this,
        events = spawnEntityChangeEvents.returned,
        fieldKey = this.entityKey,
        entityPath = fieldKey.getEntityPath(),
        nodeBefore = entitiesBefore.getNode(entityPath),
        nodeAfter = entitiesAfter.getNode(entityPath),
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
    .filter(function (propertyName) {
      return nodeAfter[propertyName] !== nodeBefore[propertyName];
    })
    // todo Delegate to items.
    .forEachItem(function (propertyName) {
      var childEntity = that.getChildEntity(propertyName);
      events.push(childEntity.spawnEvent({
        eventName: $entity.EVENT_ENTITY_CHANGE,
        _nodeBefore: nodeBefore[propertyName],
        _nodeAfter: nodeAfter[propertyName]
      }));
    });

    return events;
  }
});
