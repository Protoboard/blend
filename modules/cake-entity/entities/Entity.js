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
   * Extracts a node of affected properties reflecting the entity's current
   * state.
   * @param {Object} nodeAfter
   * @returns {Object}
   * @private
   * @todo Need a faster way of filtering properties. (Collection#filterByKeys?)
   */
  _extractNodeBeforeForAppend: function (nodeAfter) {
    var entityPath = this.entityKey.getEntityPath(),
        affectedProperties = Object.keys(nodeAfter),
        propertiesQuery = $data.Query.fromComponents(
            entityPath.clone()
            .push($data.QueryComponent.fromKeyOptions(affectedProperties))
                .components);

    return $entity.entities.queryKeyNodePairs(propertiesQuery)
    .toCollection()
        .data;
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
   * Triggers event on current entity.
   * @param {*} nodeBefore
   * @param {*} nodeAfter
   * @returns {$utils.Promise}
   * @private
   */
  _triggerEntityChangeEvent: function (nodeBefore, nodeAfter) {
    return this.spawnEvent({
      eventName: $entity.EVENT_ENTITY_CHANGE,
      _nodeBefore: nodeBefore,
      _nodeAfter: nodeAfter
    })
    .trigger();
  },

  /**
   * Triggers events on all entities affected by the change.
   * @param {Object|*} nodeBefore
   * @param {Object|*} nodeAfter
   * @returns {$utils.Promise}
   * @private
   */
  _triggerEntityChangeEvents: function (nodeBefore, nodeAfter) {
    var entityPath = this.entityKey.getEntityPath(),
        entitiesBefore = $data.Tree.create().setNode(entityPath, nodeBefore),
        entitiesAfter = $data.Tree.create().setNode(entityPath, nodeAfter),
        leafNodeQuery = $data.Query.fromComponents(
            entityPath.clone().push('**')
                .components),
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

    return this._triggerEvents(eventPropertyTree);
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
   * Sets specified *primitive* node as new value for the current entity,
   * and triggers change event for the current entity only. Primitive nodes
   * are considered *non-object* nodes.
   * @param {*} node
   * @returns {$entity.Entity}
   */
  setPrimitiveNode: function (node) {
    var nodeBefore = this.getSilentNode();

    if (node !== nodeBefore) {
      $entity.entities.setNode(this.entityKey.getEntityPath(), node);
      this._triggerEntityChangeEvent(nodeBefore, node);
    }

    return this;
  },

  /**
   * Sets specified node as new value for the current entity, and
   * triggers change events for all affected child entities.
   * @param {*} node
   * @returns {$entity.Entity}
   * @todo Return promise?
   */
  setNode: function (node) {
    var nodeBefore = this.getSilentNode();

    if (node !== nodeBefore) {
      $entity.entities.setNode(this.entityKey.getEntityPath(), node);

      if (node instanceof Object || nodeBefore instanceof Object) {
        // triggering events on all affected entities
        this._triggerEntityChangeEvents(nodeBefore, node);
      } else {
        // triggering event on current entity only
        this._triggerEntityChangeEvent(nodeBefore, node);
      }
    }

    return this;
  },

  /**
   * Appends properties of the specified node to those of the current
   * entity, and triggers change events for all affected child entities.
   * Second degree children and beyond will be overwritten just like in
   * {@link $entity.Entity#setNode}.
   * @param {Object} node
   * @returns {$entity.Entity}
   * @todo Return promise?
   * @todo Removal counterpart?
   */
  appendNode: function (node) {
    var entityPath = this.entityKey.getEntityPath(),
        nodeBefore = this._extractNodeBeforeForAppend(node);

    $entity.entities.appendNode(entityPath, node);
    this._triggerEntityChangeEvents(nodeBefore, node);

    return this;
  },

  /**
   * @returns {$entity.Entity}
   * @todo Return promise?
   */
  deleteNode: function () {
    var nodeBefore = this.getSilentNode();

    if (nodeBefore !== undefined) {
      $entity.entities.deleteNode(this.entityKey.getEntityPath());
      this._triggerEntityChangeEvents(nodeBefore, undefined);
    }

    return this;
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
