"use strict";

/**
 * @function $data.Path.create
 * @param {Object} properties
 * @param {string[]} properties.components Identifiable 'steps' along the path.
 * @returns {$data.Path}
 */

/**
 * Unambiguously identifies a node in a tree-like structure. A path is composed
 * of path components (strings), identifying keys in nodes along the path. In
 * string representation of the path, components are separated by the character
 * '`.`' (period).
 * @class $data.Path
 * @mixes $utils.Cloneable
 * @mixes $data.Comparable
 * @implements $utils.Stringifiable
 * @implements $data.Stackable
 * @example
 * $data.Path.create(['foo', 'bar', 'baz'])
 */
$data.Path = $oop.getClass('$data.Path')
.mix($utils.Cloneable)
.mix($oop.getClass('$data.Comparable'))
.implement($utils.Stringifiable)
.implement($oop.getClass('$data.Stackable'))
.define(/** @lends $data.Path# */{
  /**
   * Path components.
   * @member {Array.<string>} $data.Path#components
   */

  /**
   * Creates a `Path` instance based on the specified component array.
   * @memberOf $data.Path
   * @param {Array.<string>} components
   * @returns {$data.Path}
   */
  fromComponents: function (components) {
    return this.create({components: components});
  },

  /**
   * Creates a `Path` instance based on the specified string.
   * @memberOf $data.Path
   * @param {string} pathStr
   * @returns {$data.Path}
   */
  fromString: function (pathStr) {
    var components = $utils.safeSplit(pathStr, $data.PATH_COMPONENT_SEPARATOR)
    .map($data.unescapePathComponent);
    return $data.Path.create({components: components});
  },

  /** @ignore */
  init: function () {
    $assert.isArray(this.components, "Invalid component list");
  },

  /**
   * @inheritDoc
   * @returns {$data.Path}
   */
  clone: function clone() {
    var cloned = clone.returned;
    cloned.components = this.components.concat();
    return cloned;
  },

  /**
   * Tests whether specified path is equivalent to current path.
   * @param {$data.Path} path
   * @returns {boolean}
   */
  equals: function equals(path) {
    var result = equals.returned,
        componentsLeft = this.components,
        componentsRight = path.components,
        componentCount = componentsRight.length,
        i;

    if (componentsLeft.length !== componentsRight.length) {
      return false;
    } else {
      for (i = 0; i < componentCount; i++) {
        if (componentsLeft[i] !== componentsRight[i]) {
          return false;
        }
      }
      return result;
    }
  },

  /**
   * Tests whether specified path includes current path. (From start)
   * @param {$data.Path} path
   * @returns {boolean}
   */
  lessThan: function lessThan(path) {
    return path.greaterThan(this);
  },

  /**
   * Tests whether specified path is included in current path. (From start)
   * @param {$data.Path} path
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
   * @returns {$data.Path}
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
   * @returns {$data.Path}
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
   * @param {$data.Path} path
   * @returns {$data.Path}
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
   * $data.Path.create(['foo', 'bar.baz'])+'' // 'foo.bar\.baz'
   */
  toString: function () {
    return this.components.map($data.escapePathComponent)
    .join($data.PATH_COMPONENT_SEPARATOR);
  }
});

$oop.copyProperties($assert, /** @lends $assert */{
  /**
   * @param {$data.Path} expr
   * @param {string} [message]
   * @returns {$assert}
   */
  isPath: function (expr, message) {
    return $assert.assert(
        $data.Path.mixedBy(expr), message);
  },

  /**
   * @param {$data.Path} [expr]
   * @param {string} [message]
   * @returns {$assert}
   */
  isPathOptional: function (expr, message) {
    return $assert.assert(
        expr === undefined ||
        $data.Path.mixedBy(expr), message);
  }
});

$oop.copyProperties($data, /** @lends $data */{
  /**
   * Separates path components.
   * @constant
   */
  PATH_COMPONENT_SEPARATOR: '.',

  /**
   * Escapes special characters in path components.
   * @param {string} pathComponentStr
   * @returns {string}
   */
  escapePathComponent: function (pathComponentStr) {
    return $utils.escape(pathComponentStr, $data.PATH_COMPONENT_SEPARATOR);
  },

  /**
   * Un-escapes special characters in path components.
   * @param {string} pathComponentStr
   * @returns {string}
   */
  unescapePathComponent: function (pathComponentStr) {
    return $utils.unescape(pathComponentStr, $data.PATH_COMPONENT_SEPARATOR);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$data.Path}
   */
  toPath: function () {
    return $data.Path.fromString(this.valueOf());
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$data.Path}
   */
  toPath: function () {
    return $data.Path.create({components: this});
  }
});
