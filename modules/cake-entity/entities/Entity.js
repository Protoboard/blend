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
 */
$entity.Entity = $oop.getClass('$entity.Entity')
.mix($event.EventSender)
.mix($event.EventListener)
.define(/** @lends $entity.Entity# */{
  /**
   * Identifies entity in the entity store.
   * @member {$entity.EntityKey} $entity.Entity#entityKey
   */

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
   * @param {$data.Tree} container
   * @param {$data.Query} leafNodeQuery
   * @returns {$data.Collection}
   * @private
   */
  _extractPathLookup: function (container, leafNodeQuery) {
    return container.queryPathsWrapped(leafNodeQuery)
    .asCollection()
    .mapKeys(String)
    .toCollection();
  },

  /**
   * @param {$data.StringSet} pathStrings
   * @param {$data.Collection} pathLookup
   * @returns {$data.Collection}
   * @private
   */
  _groupPathsByParent: function (pathStrings, pathLookup) {
    return pathStrings.toStringCollection()
    .join(pathLookup)
    .mapValues(function (path) {
      var entityPath = path.clone();
      return {
        value: entityPath.pop(),
        key: entityPath.toString()
      };
    })
    .getValuesWrapped()
    .asPairList()
    .toDictionary()
    .asCollection();
  },

  /**
   * @param {*} node
   * @returns {$entity.Entity}
   * @todo Break down & compact
   * @todo Separate branch for primitive before/after values
   */
  setNode: function (node) {
    var nodeBefore = this.getSilentNode();

    if (node !== nodeBefore) {
      var entityPath = this.entityKey.getEntityPath();
      var entitiesBefore = $data.Tree.create().setNode(entityPath, nodeBefore);
      var entitiesAfter = $data.Tree.create().setNode(entityPath, node);

      // querying affected paths
      var leafNodeQuery = $data.Query.fromComponents(
          entityPath.clone().push('**').components);
      var pathLookupBefore = this._extractPathLookup(entitiesBefore, leafNodeQuery);
      var pathLookupAfter = this._extractPathLookup(entitiesAfter, leafNodeQuery);

      // creating 3 sets: added, removed, changed
      var pathsBefore = pathLookupBefore.getKeysWrapped().toStringSet();
      var pathsAfter = pathLookupAfter.getKeysWrapped().toStringSet();
      var pathsAdded = pathsAfter.subtract(pathsBefore);
      var pathsRemoved = pathsAfter.subtractFrom(pathsBefore);
      var pathsRemain = pathsAfter.intersectWith(pathsBefore);
      var pathsChanged = pathsRemain.filter(function (pathString) {
        var path = pathLookupBefore.getValue(pathString) || pathLookupAfter.getValue(pathString);
        return entitiesBefore.getNode(path) !== entitiesAfter.getNode(path);
      });
      var propertiesRemoved = this._groupPathsByParent(pathsRemoved, pathLookupBefore);
      var propertiesAdded = this._groupPathsByParent(pathsAdded, pathLookupAfter);

      // setting node
      $entity.entities.setNode(entityPath, node);

      // building event property tree for triggering
      // todo Add recurring properties separately
      var eventProperties = $data.Tree.create();
      propertiesAdded.forEachItem(function (propertiesAdded, pathString) {
        eventProperties.appendNode($data.Path.fromComponents([pathString]), {
          eventName: $entity.EVENT_ENTITY_CHANGE,
          entitiesBefore: entitiesBefore,
          entitiesAfter: entitiesAfter,
          propertiesAdded: propertiesAdded
        });
      });
      propertiesRemoved.forEachItem(function (propertiesRemoved, pathString) {
        eventProperties.appendNode($data.Path.fromComponents([pathString]), {
          eventName: $entity.EVENT_ENTITY_CHANGE,
          entitiesBefore: entitiesBefore,
          entitiesAfter: entitiesAfter,
          propertiesRemoved: propertiesRemoved
        });
      });
      pathsChanged.forEachItem(function (pathString) {
        eventProperties.appendNode($data.Path.fromComponents([pathString]), {
          eventName: $entity.EVENT_ENTITY_CHANGE,
          entitiesBefore: entitiesBefore,
          entitiesAfter: entitiesAfter
        });
      });

      // triggering events
      // todo Collect & aggregate promises
      eventProperties.asCollection()
      .forEachItem(function (eventProperties, pathString) {
        $data.Path.fromString(pathString)
        .toEntityKey()
        .toEntity()
        .spawnEvent(eventProperties)
        .trigger();
      });
    }

    return this;
  }
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

// todo Might need to move these to globals.js
$oop.copyProperties($entity, /** @lends $entity */{
  /**
   * Signals a failed attempt to access the entity in the entity store.
   * (Node was not there.)
   * @constant
   */
  EVENT_ENTITY_ABSENT: 'entity.absent',

  /**
   * Signals changing the entity node.
   * @constant
   */
  EVENT_ENTITY_CHANGE: 'entity.change'
});
