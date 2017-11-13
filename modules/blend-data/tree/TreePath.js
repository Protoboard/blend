"use strict";

/**
 * @function $data.TreePath.create
 * @param {Object} properties
 * @param {string[]} properties.components Identifiable 'steps' along the path.
 * @returns {$data.TreePath}
 */

/**
 * Unambiguously identifies a node in a tree structure. A path is composed of
 * path components (strings), identifying keys in nodes along the path. In
 * string representation of the path, components are separated by the character
 * '`.`' (period).
 * @class $data.TreePath
 * @extends $utils.Path
 * @extends $data.Comparable
 * @implements $utils.Stringifiable
 * @implements $data.Stackable
 * @example
 * $data.TreePath.create(['foo', 'bar', 'baz'])
 */
$data.TreePath = $oop.getClass('$data.TreePath')
.blend($utils.Path)
.blend($oop.getClass('$data.Comparable'))
.implement($utils.Stringifiable)
.implement($oop.getClass('$data.Stackable'))
.define(/** @lends $data.TreePath# */{
  /**
   * Path components.
   * @member {Array.<string>} $data.TreePath#components
   */

  /**
   * Converts `Path` components directly to string. Escapes components the
   * same way as `$data.TreePath.fromComponents([...]).toString()`.
   * @memberOf $data.TreePath
   * @param {Array.<string>} components
   * @returns {string}
   */
  fromComponentsToString: function (components) {
    return components.map($data.escapeTreePathComponent).join('.');
  },

  /**
   * Creates a `Path` instance based on the specified string.
   * @memberOf $data.TreePath
   * @param {string} pathStr
   * @param {Object} [properties]
   * @returns {$data.TreePath}
   */
  fromString: function (pathStr, properties) {
    var components = $utils.safeSplit(pathStr, $data.TREE_PATH_DELIMITER)
    .map($data.unescapeTreePathComponent);
    return this.create({components: components}, properties);
  },

  /**
   * Tests whether specified path includes current path. (From start)
   * @param {$data.TreePath} path
   * @returns {boolean}
   */
  lessThan: function lessThan(path) {
    return path.greaterThan(this);
  },

  /**
   * Tests whether specified path is included in current path. (From start)
   * @param {$data.TreePath} path
   * @returns {boolean}
   */
  greaterThan: function greaterThan(path) {
    var result = greaterThan.returned,
        componentsLeft = this.components,
        componentsRight = path.components,
        componentCount = componentsRight.length,
        i;

    if (componentsRight.length > componentsLeft.length) {
      return false;
    }

    for (i = 0; i < componentCount; i++) {
      if (componentsLeft[i] !== componentsRight[i]) {
        return false;
      }
    }

    return result;
  },

  /**
   * Appends a path component to the path.
   * @param {string} component
   * @returns {$data.TreePath}
   */
  push: function (component) {
    this.components.push(component);
    return this;
  },

  /**
   * Trims one component off the end of the path.
   * @returns {string}
   */
  pop: function () {
    return this.components.pop();
  },

  /**
   * Prepends a path component to the path.
   * @param {string} component
   * @returns {$data.TreePath}
   */
  unshift: function (component) {
    this.components.unshift(component);
    return this;
  },

  /**
   * Trims one component off the start of the path.
   * @returns {string}
   */
  shift: function () {
    return this.components.shift();
  },

  /**
   * Appends specified path to current path.
   * @param {$data.TreePath} path
   * @returns {$data.TreePath}
   */
  concat: function (path) {
    var components = this.components.concat(path.components);
    return $oop.getClass(this.__classId).create({components: components});
  },

  /**
   * Returns string representation of path. Special characters inside path
   * components will be escaped.
   * @returns {string}
   * @example
   * $data.TreePath.create(['foo', 'bar.baz'])+'' // 'foo.bar\.baz'
   */
  toString: function () {
    return this.components.map($data.escapeTreePathComponent)
    .join($data.TREE_PATH_DELIMITER);
  }
});

$oop.copyProperties($data, /** @lends $data */{
  /**
   * Separates path components.
   * @constant
   */
  TREE_PATH_DELIMITER: '.',

  /**
   * Escapes special characters in path components.
   * @param {string} pathComponentStr
   * @returns {string}
   */
  escapeTreePathComponent: function (pathComponentStr) {
    return $utils.escape(pathComponentStr, $data.TREE_PATH_DELIMITER);
  },

  /**
   * Un-escapes special characters in path components.
   * @param {string} pathComponentStr
   * @returns {string}
   */
  unescapeTreePathComponent: function (pathComponentStr) {
    return $utils.unescape(pathComponentStr, $data.TREE_PATH_DELIMITER);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$data.TreePath}
   */
  toTreePath: function () {
    return $data.TreePath.fromString(this.valueOf());
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$data.TreePath}
   */
  toTreePath: function () {
    return $data.TreePath.create({components: this});
  }
});
