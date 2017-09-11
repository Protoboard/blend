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
  _groupPropertiesByParent: function (pathStrings, pathLookup) {
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
   * Arranges paths into "added", "removed", and "changed" groups.
   * @param {$data.Collection} pathLookupBefore
   * @param {$data.Collection} pathLookupAfter
   * @param {$data.Tree} entitiesBefore
   * @param {$data.Tree} entitiesAfter
   * @returns {{pathsAdded: $data.StringSet, pathsRemoved: $data.StringSet,
   *     pathsChanged: $data.StringSet}}
   * @private
   */
  _groupPathsByChange: function (pathLookupBefore, pathLookupAfter, entitiesBefore, entitiesAfter) {
    var pathsBefore = pathLookupBefore.getKeysWrapped().toStringSet(),
        pathsAfter = pathLookupAfter.getKeysWrapped().toStringSet(),
        pathsRemain = pathsAfter.intersectWith(pathsBefore);

    return {
      pathsAdded: pathsAfter.subtract(pathsBefore),
      pathsRemoved: pathsAfter.subtractFrom(pathsBefore),
      pathsChanged: pathsRemain.filter(function (pathString) {
        var path = pathLookupBefore.getValue(pathString) || pathLookupAfter.getValue(pathString);
        return entitiesBefore.getNode(path) !== entitiesAfter.getNode(path);
      })
    };
  },

  /**
   * Builds property sets for events to be triggered.
   * @param {$data.Collection} [propertiesAdded]
   * @param {$data.Collection} [propertiesRemoved]
   * @param {$data.StringSet} [pathsChanged]
   * @param {$data.Tree} entitiesBefore
   * @param {$data.Tree} entitiesAfter
   * @returns {$data.Tree}
   * @private
   */
  _buildEventPropertyTree: function (propertiesAdded, propertiesRemoved, pathsChanged, entitiesBefore, entitiesAfter) {
    var result = $data.Tree.create();
    if (propertiesAdded) {
      propertiesAdded.forEachItem(function (propertiesAdded, pathString) {
        result.appendNode($data.Path.fromComponents([pathString]), {
          eventName: $entity.EVENT_ENTITY_CHANGE,
          entitiesBefore: entitiesBefore,
          entitiesAfter: entitiesAfter,
          propertiesAdded: propertiesAdded
        });
      });
    }
    if (propertiesRemoved) {
      propertiesRemoved.forEachItem(function (propertiesRemoved, pathString) {
        result.appendNode($data.Path.fromComponents([pathString]), {
          eventName: $entity.EVENT_ENTITY_CHANGE,
          entitiesBefore: entitiesBefore,
          entitiesAfter: entitiesAfter,
          propertiesRemoved: propertiesRemoved
        });
      });
    }
    if (pathsChanged) {
      pathsChanged.forEachItem(function (pathString) {
        result.appendNode($data.Path.fromComponents([pathString]), {
          eventName: $entity.EVENT_ENTITY_CHANGE,
          entitiesBefore: entitiesBefore,
          entitiesAfter: entitiesAfter
        });
      });
    }
    return result;
  },

  /**
   * Spawns and triggers events based on specified event properties.
   * @param {$data.Tree} eventPropertyTree
   * @returns {$utils.Promise}
   * @private
   */
  _triggerEvents: function (eventPropertyTree) {
    var promises = eventPropertyTree
    .asCollection()
    .mapValues(function (eventProperties, pathString) {
      return $data.Path.fromString(pathString)
      .toEntityKey()
      .toEntity()
      .spawnEvent(eventProperties);
    })
    .callOnEachValue('trigger');

    return $utils.Promise.when(promises.getValues());
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
   * Sets entity node in the container and triggers change event only for
   * the current entity. Significantly faster than $entity.Entity#setNode,
   * but will not notify affected child entities.
   * @param {*} node
   * @returns {$entity.Entity}
   * @todo Find a better name
   */
  setNodeLight: function (node) {
    var nodeBefore = this.getSilentNode();

    if (node !== nodeBefore) {
      $entity.entities.setNode(this.entityKey.getEntityPath(), node);

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
   * Sets entity node in the container and triggers change events for all
   * affected child entities.
   * @param {*} node
   * @returns {$entity.Entity}
   * @todo Separate branch for primitive before/after values
   */
  setNode: function (node) {
    var nodeBefore = this.getSilentNode();

    if (node !== nodeBefore) {
      $entity.entities.setNode(this.entityKey.getEntityPath(), node);

      var entityPath = this.entityKey.getEntityPath(),
          entitiesBefore = $data.Tree.create().setNode(entityPath, nodeBefore),
          entitiesAfter = $data.Tree.create().setNode(entityPath, node),
          leafNodeQuery = $data.Query.fromComponents(
              entityPath.clone().push('**').components),
          pathLookupBefore = this._extractPathLookup(entitiesBefore, leafNodeQuery),
          pathLookupAfter = this._extractPathLookup(entitiesAfter, leafNodeQuery),
          pathGroups = this._groupPathsByChange(
              pathLookupBefore, pathLookupAfter, entitiesBefore, entitiesAfter),
          propertiesRemoved = this._groupPropertiesByParent(
              pathGroups.pathsRemoved, pathLookupBefore),
          propertiesAdded = this._groupPropertiesByParent(
              pathGroups.pathsAdded, pathLookupAfter),
          eventPropertyTree = this._buildEventPropertyTree(propertiesAdded,
              propertiesRemoved, pathGroups.pathsChanged, entitiesBefore,
              entitiesAfter);

      this._triggerEvents(eventPropertyTree);
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
