"use strict";

/**
 * @function $data.Tree.create
 * @param {object|Array} [data]
 * @returns {$data.Tree}
 */

/**
 * Allows access & manipulation of tree (nested JavaScript objects) data
 * structures.
 * @class $data.Tree
 * @extends $data.DataContainer
 * @implements $data.Queryable
 */
$data.Tree = $oop.getClass('$data.Tree')
    .extend($oop.getClass('$data.DataContainer'))
    .implement($oop.getClass('$data.Queryable'))
    .define(/** @lends $data.Tree# */{
        /**
         * Creates a deep copy of the current tree.
         * @see $data.deepCopy
         * @returns {$data.Tree}
         */
        clone: function clone() {
            var cloned = clone.returned;
            cloned._data = $data.deepCopy(this._data);
            return cloned;
        },

        /**
         * Traverses tree and invokes specified callback on paths that match
         * the query.
         * TODO: Compare performance w/ Giant 0.4 Tree
         * @param {$data.Query} query
         * @param {function} callback
         * @returns {$data.Tree}
         */
        query: function (query, callback) {
            var queryComponents = query._components,
                queryComponentCount = queryComponents.length;

            (function traverse(path, node, i) {
                var queryComponent = queryComponents[i],
                    nextQueryComponent = queryComponents[i + 1],
                    keys, keyCount,
                    j, key, value;

                if (i === queryComponentCount) {
                    // reached end of query
                    // invoking callback with whatever path & node we're at
                    callback($data.Path.create(path), node);
                    return;
                } else if (!(node instanceof Object)) {
                    // reached leaf node mid-query
                    if (i === queryComponentCount - 1 &&
                        queryComponent._isSkipper
                    ) {
                        // current q.c. is a trailing skipper
                        // invoking callback w/ leaf node
                        callback($data.Path.create(path), node);
                    }
                    return;
                }

                //
                if (queryComponent._keyOptions &&
                    !queryComponent._isKeyExcluded
                ) {
                    // key options available
                    // can go directly to child nodes
                    keys = queryComponent._keyOptions
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
                    if (queryComponent._isSkipper) {
                        // in skipping mode
                        if (nextQueryComponent &&
                            nextQueryComponent.matches(key, value)
                        ) {
                            // next query component is a match
                            // staying on path and exiting skipping mode
                            traverse(path, node, i + 1);
                        } else if (queryComponent.matches(key, value)) {
                            // next query component does'n match, but
                            // current q.c. does
                            // burrowing, but staying in skipping mode
                            traverse(path.concat(key), value, i);
                        }
                    } else if (queryComponent.matches(key, value)) {
                        // current (non-skip) query component is a match
                        // burrowing
                        traverse(path.concat(key), value, i + 1);
                    }
                }
            }([], this._data, 0));

            return this;
        },

        /**
         * Tests whether a node exists in the tree on the specified path.
         * @param {$data.Path} path
         * @returns {boolean}
         */
        hasPath: function (path) {
            var pathComponents = path._components,
                pathComponentCount = pathComponents.length,
                i, pathComponent,
                parentNode, childNode,
                result = true;

            for (i = 0, parentNode = this._data; i < pathComponentCount; i++) {
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
         * Retrieves a path to an existing node in the tree where the
         * specified path would fork off. For paths that already exist in
         * the tree, this is the 1st-degree parent.
         * @param {$data.Path} path
         * @returns {$data.Path}
         */
        getParentPath: function (path) {
            var pathComponents = path._components,
                pathComponentCount = pathComponents.length,
                i, pathComponent,
                parentNode, childNode,
                result = [];

            for (i = 0, parentNode = this._data; i < pathComponentCount - 1; i++) {
                pathComponent = pathComponents[i];
                childNode = parentNode[pathComponent];
                if (!(childNode instanceof Object)) {
                    break;
                } else {
                    result.push(pathComponent);
                }
                parentNode = childNode;
            }

            return $data.Path.create(result);
        },

        /**
         * Returns path to the last forking node (ode with more than 1 keys)
         * on the specified path.
         * @param {$data.Path} path
         * @returns {$data.Path}
         */
        getLastForkPath: function (path) {
            var pathComponents = path._components,
                pathComponentCount = pathComponents.length,
                i, pathComponent, parentNode, currentNode,
                nodes = [],
                nodeCount;

            // getting nodes along path in a flat array
            for (i = 0, parentNode = this._data; i < pathComponentCount; i++) {
                pathComponent = pathComponents[i];
                currentNode = parentNode[pathComponent];
                if (!hOP.call(parentNode, pathComponent)) {
                    break;
                } else {
                    nodes.unshift(currentNode);
                    parentNode = currentNode;
                }
            }
            nodeCount = nodes.length;

            // looping through nodes until first multi-key node is found
            for (i = 0; i < nodeCount; i++) {
                currentNode = nodes[i];
                if (currentNode instanceof Object &&
                    $data.isMultiKeyObject(currentNode)
                ) {
                    break;
                }
            }

            return $data.Path.create(pathComponents
                .slice(0, nodeCount - i));
        },

        /**
         * Retrieves node from the tree at the specified path. If the path
         * does not exist in the tree, returns `undefined`.
         * @param {$data.Path} path Path to node
         * @returns {*} Whatever value is found at path
         */
        getNode: function (path) {
            var pathComponents = path._components,
                pathComponentCount = pathComponents.length,
                result = this._data,
                i;

            // we could rely on Path#pop(), but for performance reasons, we're
            // accessing _components directly
            for (i = 0; i < pathComponentCount; i++) {
                result = result[pathComponents[i]];
                if (result === undefined) {
                    break;
                }
            }

            return result;
        },

        /**
         * Retrieves node from the tree at the specified path, wrapped in a
         * `Tree` instance. For absent paths, returns an empty `Tree`.
         * @param {$data.Path} path
         * @returns {$data.Tree}
         */
        getNodeWrapped: function (path) {
            return $oop.getClass(this.__classId).create(this.getNode(path));
        },

        /**
         * Sets the specified node at the specified path. When the path
         * already exists in the tree, it will be overwritten. When there's
         * a primitive node along the specified path, it will be overwritten.
         * @param {$data.Path} path
         * @param {*} node
         * @returns {$data.Tree}
         */
        setNode: function (path, node) {
            var pathComponents = path._components,
                lastPathComponentIndex = pathComponents.length - 1,
                parentPath = this.getParentPath(path),
                parentPathComponentCount = parentPath._components.length,
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
         * Appends the specified node to the node on the specified path.
         * Array nodes will be concatenated to existing array nodes. When
         * path does not exist in tree, `appendNode` is equivalent to `setNode`.
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
                $assert.assert(false,
                    "Attempting to append (to) primitive node.");
            }

            return this;
        },

        /**
         * Removes a single node (with key) from its parent node. For array
         * parent nodes, it is possible to use splicing for removal. When
         * path does not exist in tree, `deleteNode` has no effect.
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
         * Removes all non-forking nodes along the specified path, even if
         * the whole path doesn't exist in the tree. When `path` points to
         * an existing forking node, `deletePath` is equivalent to `deleteNode`.
         * @param {$data.Path} path
         * @param {boolean} [splice=false]
         * @returns {$data.Tree}
         */
        deletePath: function (path, splice) {
            var pathComponents = path._components,
                basePath = this.getLastForkPath(path),
                basePathComponents = basePath._components,
                basePathComponentCount = basePathComponents.length;

            if (basePathComponentCount === pathComponents.length) {
                // path exists in tree
                // removing node at path
                this.deleteNode(path, splice);
            } else {
                // stem path exists in tree
                // removing node from stem path
                this.deleteNode(
                    basePath.clone()
                        .push(pathComponents[basePathComponentCount]),
                    splice);
            }

            return this;
        }
    });

$oop.getClass('$data.DataContainer')
    .delegate(/** @lends $data.DataContainer# */{
        /**
         * @returns {$data.Tree}
         */
        toTree: function () {
            return $data.Tree.create(this._data);
        }
    });

$oop.copyProperties($assert, /** @lends $assert */{
    /**
     * @param {$data.Tree} expr
     * @param {string} [message]
     * @returns {$assert}
     */
    isTree: function (expr, message) {
        return $assert.assert(
            $data.Tree.isIncludedBy(expr), message);
    },

    /**
     * @param {$data.Tree} [expr]
     * @param {string} [message]
     * @returns {$assert}
     */
    isTreeOptional: function (expr, message) {
        return $assert.assert(
            expr === undefined ||
            $data.Tree.isIncludedBy(expr), message);
    }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
    /**
     * @returns {$data.Tree}
     */
    toTree: function () {
        return $data.Tree.create(this);
    }
});
