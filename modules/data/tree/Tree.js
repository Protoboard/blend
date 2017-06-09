"use strict";

/**
 * @function $data.Tree.create
 * @param {object|Array} [data]
 * @returns {$data.Tree}
 */

/**
 * @class $data.Tree
 * @extends $data.DataContainer
 */
$data.Tree = $oop.getClass('$data.Tree')
    .extend($oop.getClass('$data.DataContainer'))
    .define(/** @lends $data.Tree# */{
        /**
         * Creates a deep copy of the current tree.
         * @returns {$data.Tree}
         */
        clone: function clone() {
            var cloned = clone.returned;
            cloned._data = $data.deepCopy(this._data);
            return cloned;
        },

        /**
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
         * Returns path identifying the last fork on the specified path.
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
         * @param {$data.Path} path
         * @returns {$data.Tree}
         */
        getNodeWrapped: function (path) {
            return $oop.getClass(this.__classId).create(this.getNode(path));
        },

        /**
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
         * @param {$data.Path} path
         * @param {Object|Array} node
         * @returns {$data.Tree}
         */
        appendNode: function (path, node) {
            var hostNode = this.getNode(path),
                keys, keyCount,
                start, i, key,
                changed = false;

            if (hostNode instanceof Array && node instanceof Array) {
                if (node.length) {
                    // appending non-empty array to array
                    start = hostNode.length;
                    keyCount = node.length;
                    hostNode.length = start + keyCount;
                    for (i = 0; i < keyCount; i++) {
                        hostNode[start + i] = node[i];
                    }
                    changed = true;
                }
            } else if (hostNode instanceof Object && node instanceof Object) {
                // appending object to object
                // (or object to array)
                keys = Object.keys(node);
                keyCount = keys.length;
                for (i = 0; i < keyCount; i++) {
                    key = keys[i];
                    if (!changed && hostNode[key] !== node[key]) {
                        changed = true;
                    }
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
         * @param {$data.Path} path Path to node
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
