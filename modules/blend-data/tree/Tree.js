"use strict";

/**
 * @function $data.Tree.create
 * @param {Object} [properties]
 * @param {Object|Array} [properties.data]
 * @returns {$data.Tree}
 */

/**
 * Allows access & manipulation of tree (nested JavaScript objects) data
 * structures.
 * @class $data.Tree
 * @extends $data.DataContainer
 * @extends $data.ObjectContainer
 * @implements $data.Queryable
 * @todo Make Filterable and implement filtering by query.
 */
$data.Tree = $oop.getClass('$data.Tree')
.blend($oop.getClass('$data.DataContainer'))
.blend($oop.getClass('$data.ObjectContainer'))
.implement($oop.getClass('$data.Queryable'))
.define(/** @lends $data.Tree# */{
  /**
   * @param {$data.QueryComponent[]} components Query components
   * @param {function} callback Function to invoke on matched paths
   * @param {string[]} path Current path
   * @param {*} node Current node
   * @param {number} i Index of current query component
   * @private
   */
  _traverse: function (components, callback, path, node, i) {
    var queryComponent = components[i],
        nextQueryComponent = components[i + 1],
        keys, keyCount,
        j, key, value;

    if (i === components.length) {
      // reached end of query
      // invoking callback with whatever path & node we're at
      callback($data.Path.fromComponents(path), node);
      return;
    } else if (!(node instanceof Object)) {
      // reached leaf node mid-query
      if (i === components.length - 1 &&
          queryComponent.isSkipper
      ) {
        // current q.c. is a trailing skipper
        // invoking callback w/ leaf node
        callback($data.Path.fromComponents(path), node);
      }
      return;
    }

    if (queryComponent.keyOptions &&
        !queryComponent.isKeyExcluded
    ) {
      // key options available
      // can go directly to child nodes
      keys = queryComponent.keyOptions
      .filter(function (key) {
        return hOP.call(node, key);
      });
    } else {
      // iterating over all keys in node
      keys = Object.keys(node);
    }

    keyCount = keys.length;
    for (j = 0; j < keyCount; j++) {
      key = keys[j];
      value = node[key];
      if (queryComponent.isSkipper) {
        // in skipping mode
        if (nextQueryComponent &&
            nextQueryComponent.matches(key, value)
        ) {
          // next query component is a match
          // staying on path and exiting skipping mode
          this._traverse(components, callback, path, node, i + 1);
        } else if (queryComponent.matches(key, value)) {
          // next query component does'n match, but
          // current q.c. does
          // burrowing, but staying in skipping mode
          this._traverse(components, callback,
              path.concat(key), value, i);
        }
      } else if (queryComponent.matches(key, value)) {
        // current (non-skip) query component is a match
        // burrowing
        this._traverse(components, callback,
            path.concat(key), value, i + 1);
      }
    }
  },

  /**
   * Creates a deep copy of the current tree.
   * @see $data.deepCopy
   * @returns {$data.Tree}
   */
  clone: function clone() {
    var cloned = clone.returned;
    cloned.data = $data.deepCopy(this.data);
    return cloned;
  },

  /**
   * Traverses tree and invokes specified callback on paths that match the
   * query.
   * @todo Compare performance w/ Giant 0.4 Tree
   * @param {$data.Query} query
   * @param {function} callback
   * @returns {$data.Tree}
   */
  query: function (query, callback) {
    this._traverse(query.components, callback, [], this.data, 0);
    return this;
  },

  /**
   * Tests whether a node exists in the tree on the specified path.
   * @param {$data.Path} path
   * @returns {boolean}
   */
  hasPath: function (path) {
    var pathComponents = path.components,
        pathComponentCount = pathComponents.length,
        i, pathComponent,
        parentNode, childNode,
        result = true;

    for (i = 0, parentNode = this.data; i < pathComponentCount; i++) {
      pathComponent = pathComponents[i];
      childNode = parentNode[pathComponent];
      if (childNode === undefined &&
          !hOP.call(parentNode, pathComponent)
      ) {
        result = false;
        break;
      }
      parentNode = childNode;
    }

    return result;
  },

  /**
   * Retrieves a path to an existing node in the tree where the specified path
   * would fork off. For paths that already exist in the tree, this is the
   * 1st-degree parent.
   * @param {$data.Path} path
   * @returns {$data.Path}
   */
  getParentPath: function (path) {
    var pathComponents = path.components,
        pathComponentCount = pathComponents.length,
        i, pathComponent,
        parentNode, childNode,
        result = [];

    for (i = 0, parentNode = this.data; i < pathComponentCount - 1; i++) {
      pathComponent = pathComponents[i];
      childNode = parentNode[pathComponent];
      if (!(childNode instanceof Object)) {
        break;
      } else {
        result.push(pathComponent);
      }
      parentNode = childNode;
    }

    return $data.Path.fromComponents(result);
  },

  /**
   * Returns path to the last forking node (node with more than 1 keys) on the
   * specified path.
   * @param {$data.Path} path
   * @returns {$data.Path}
   */
  getLastForkPath: function (path) {
    var pathComponents = path.components,
        pathComponentCount = pathComponents.length,
        i, pathComponent, parentNode, currentNode,
        parentNodes = [],
        parentNodeCount;

    // collecting parent nodes along path in a flat array
    for (i = 0, parentNode = this.data; i < pathComponentCount; i++) {
      parentNodes.unshift(parentNode);
      pathComponent = pathComponents[i];
      if (!hOP.call(parentNode, pathComponent)) {
        break;
      } else {
        parentNode = parentNode[pathComponent];
      }
    }
    parentNodeCount = parentNodes.length;

    // looping through nodes until first multi-key node is found
    for (i = 0; i < parentNodeCount; i++) {
      currentNode = parentNodes[i];
      if (currentNode instanceof Object &&
          $data.isMultiKeyObject(currentNode)
      ) {
        // making it seem we're exiting normally
        i++;
        break;
      }
    }

    return $data.Path.fromComponents(
        pathComponents.slice(0, parentNodeCount - i));
  },

  /**
   * Retrieves node from the tree at the specified path. If the path does not
   * exist in the tree, returns `undefined`.
   * @param {$data.Path} path Path to node
   * @returns {*} Whatever value is found at path
   */
  getNode: function (path) {
    var pathComponents = path.components,
        pathComponentCount = pathComponents.length,
        result = this.data,
        i;

    // we could rely on Path#pop(), but for performance reasons, we're
    // accessing components directly
    for (i = 0; i < pathComponentCount; i++) {
      result = result[pathComponents[i]];
      if (result === undefined) {
        break;
      }
    }

    return result;
  },

  /**
   * Retrieves node from the tree at the specified path, wrapped in a `Tree`
   * instance. For absent paths, returns an empty `Tree`.
   * @param {$data.Path} path
   * @returns {$data.Tree}
   * @todo Wrap primitives in DataContainer
   */
  getNodeWrapped: function (path) {
    return $oop.getClass(this.__classId).create({data: this.getNode(path)});
  },

  /**
   * Retrieves node from the tree at the specified path. If the path does not
   * exist in the tree, runs `initializer`, stores its return value as new
   * node, and returns the initialized node.
   * @param {$data.Path} path Path to node
   * @param {function} initializer Function that initializes the node when path
   *     is absent
   * @returns {*} Existing or initialized node
   */
  getInitializedNode: function (path, initializer) {
    var node = this.getNode(path);
    if (node === undefined && !this.hasPath(path)) {
      node = initializer(path);
      this.setNode(path, node);
    }
    return node;
  },

  /**
   * @param {$data.Path} path Path to node
   * @param {function} initializer Function that initializes the node
   * @returns {$data.Tree}
   */
  getInitializedNodeWrapped: function (path, initializer) {
    var initializedNode = this.getInitializedNode(path, initializer);
    return $oop.getClass(this.__classId).create({data: initializedNode});
  },

  /**
   * Sets the specified node at the specified path. When the path already
   * exists in the tree, it will be overwritten. When there's a primitive node
   * along the specified path, it will be overwritten.
   * @param {$data.Path} path
   * @param {*} node
   * @returns {$data.Tree}
   */
  setNode: function (path, node) {
    var pathComponents = path.components,
        lastPathComponentIndex = pathComponents.length - 1,
        parentPath = this.getParentPath(path),
        parentPathComponentCount = parentPath.components.length,
        parentNode = this.getNode(parentPath),
        i, currentNode;

    // adding container nodes
    for (i = parentPathComponentCount; i < lastPathComponentIndex; i++) {
      parentNode[pathComponents[i]] = currentNode = {};
      parentNode = currentNode;
    }

    // setting node on 1st-degree parent
    parentNode[pathComponents[i]] = node;

    return this;
  },

  /**
   * Appends the specified node to the node on the specified path. Array nodes
   * will be concatenated to existing array nodes. When path does not exist in
   * tree, `appendNode` is equivalent to `setNode`.
   * @see $data.Tree#setNode
   * @param {$data.Path} path
   * @param {Object|Array} node
   * @returns {$data.Tree}
   */
  appendNode: function (path, node) {
    var hostNode = this.getNode(path),
        keys, keyCount,
        start, i, key;

    if (hostNode instanceof Array && node instanceof Array) {
      if (node.length) {
        // appending non-empty array to array
        start = hostNode.length;
        keyCount = node.length;
        hostNode.length = start + keyCount;
        for (i = 0; i < keyCount; i++) {
          hostNode[start + i] = node[i];
        }
      }
    } else if (hostNode instanceof Object && node instanceof Object) {
      // appending object to object
      // (or object to array)
      keys = Object.keys(node);
      keyCount = keys.length;
      for (i = 0; i < keyCount; i++) {
        key = keys[i];
        hostNode[key] = node[key];
      }
    } else if (hostNode === undefined) {
      // node does not exist
      // replacing node
      this.setNode(path, node);
    } else {
      // node exists and is not an object
      // or specified node is primitive
      $assert.fail("Attempting to append (to) primitive node.");
    }

    return this;
  },

  /**
   * Removes a single node (with key) from its parent node. For array parent
   * nodes, it is possible to use splicing for removal. When path does not
   * exist in tree, `deleteNode` has no effect.
   * @param {$data.Path} path
   * @param {boolean} [splice=false]
   * @returns {$data.Tree}
   */
  deleteNode: function (path, splice) {
    var parentPath = path.clone(),
        key = parentPath.pop(),
        parentNode = this.getNode(parentPath);

    if (splice && parentNode instanceof Array) {
      // splicing out of array
      parentNode.splice(key, 1);
    } else if (parentNode instanceof Object &&
        hOP.call(parentNode, key)
    ) {
      // key exists in parent
      delete parentNode[key];
    }

    return this;
  },

  /**
   * Removes all non-forking nodes along the specified path, even if the whole
   * path doesn't exist in the tree. When `path` points to an existing forking
   * node, `deletePath` is equivalent to `deleteNode`.
   * @param {$data.Path} path
   * @param {boolean} [splice=false]
   * @returns {$data.Tree}
   */
  deletePath: function (path, splice) {
    var pathComponents = path.components,
        parentPath = this.getLastForkPath(path),
        parentPathComponents = parentPath.components,
        parentPathComponentCount = parentPathComponents.length;

    if (parentPathComponentCount === pathComponents.length - 1) {
      // target parent is 1st degree parent
      // removing node at path
      this.deleteNode(path, splice);
    } else {
      // target parent is closer to root
      // removing node from under parentPath
      this.deleteNode(
          parentPath.clone()
          .push(pathComponents[parentPathComponentCount]),
          splice);
    }

    return this;
  },

  /**
   * Queries nodes from the tree matching the specified query. Order of items
   * in the resulting array is non-deterministic.
   * @param {$data.Query} query
   * @returns {Array}
   */
  queryNodes: function (query) {
    var result = [];
    this.query(query, function (/**$data.Path*/path, node) {
      result.push(node);
    });
    return result;
  },

  /**
   * @param {$data.Query} query
   * @returns {$data.Collection}
   */
  queryNodesWrapped: function (query) {
    return $data.Collection.create({data: this.queryNodes(query)});
  },

  /**
   * Queries keys from the tree matching the specified query. Order of items in
   * the resulting array is non-deterministic.
   * @param {$data.Query} query
   * @returns {string[]}
   */
  queryKeys: function (query) {
    var result = [];
    this.query(query, function (/**$data.Path*/path) {
      var pathComponents = path.components,
          key = pathComponents[pathComponents.length - 1];
      result.push(key);
    });
    return result;
  },

  /**
   * @param {$data.Query} query
   * @returns {$data.StringCollection}
   */
  queryKeysWrapped: function (query) {
    return $data.StringCollection.create({data: this.queryKeys(query)});
  },

  /**
   * Queries paths from the tree matching the specified query. Order of items
   * in the resulting array is non-deterministic.
   * @param {$data.Query} query
   * @returns {$data.Path[]}
   */
  queryPaths: function (query) {
    var result = [];
    this.query(query, function (/**$data.Path*/path) {
      result.push(path);
    });
    return result;
  },

  /**
   * @param {$data.Query} query
   * @returns {$data.Collection}
   */
  queryPathsWrapped: function (query) {
    return $data.Collection.create({data: this.queryPaths(query)});
  },

  /**
   * Queries key-node pairs from the tree matching the specified query.
   * @param {$data.Query} query
   * @returns {$data.PairList}
   */
  queryKeyNodePairs: function (query) {
    var result = [];
    this.query(query, function (/**$data.Path*/path, node) {
      var pathComponents = path.components,
          key = pathComponents[pathComponents.length - 1];
      result.push({key: key, value: node});
    });
    return $data.PairList.create({data: result});
  },

  /**
   * Queries path-node pairs from the tree matching the specified query.
   * @param {$data.Query} query
   * @returns {$data.PairList}
   */
  queryPathNodePairs: function (query) {
    var result = [];
    this.query(query, function (/**$data.Path*/path, node) {
      result.push({key: path, value: node});
    });
    return $data.PairList.create({data: result});
  }
});

$oop.getClass('$data.DataContainer')
.delegate(/** @lends $data.DataContainer# */{
  /**
   * @returns {$data.Tree}
   */
  asTree: function () {
    return this.as($data.Tree);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$data.Tree}
   */
  asTree: function () {
    return $data.Tree.create({data: this});
  }
});
