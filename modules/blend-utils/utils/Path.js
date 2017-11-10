"use strict";

/**
 * @function $utils.Path.create
 * @param {Object} properties
 * @param {string[]} properties.components Identifiable 'steps' along the path.
 * @returns {$utils.Path}
 */

/**
 * @class $utils.Path
 * @mixes $utils.Cloneable
 * @mixes $utils.Equatable
 * @example
 * $utils.Path.create(['foo', 'bar', 'baz'])
 */
$utils.Path = $oop.getClass('$utils.Path')
.blend($utils.Cloneable)
.blend($oop.getClass('$utils.Equatable'))
.define(/** @lends $utils.Path# */{
  /**
   * Path components.
   * @member {Array.<string>} $utils.Path#components
   */

  /**
   * Creates a `Path` instance based on the specified component array.
   * @memberOf $utils.Path
   * @param {Array.<string>} components
   * @returns {$utils.Path}
   */
  fromComponents: function (components) {
    return this.create({components: components});
  },

  /** @ignore */
  init: function () {
    $assert.isArray(this.components, "Invalid component list");
  },

  /**
   * @inheritDoc
   * @returns {$utils.Path}
   */
  clone: function clone() {
    var cloned = clone.returned;
    cloned.components = this.components.concat();
    return cloned;
  },

  /**
   * Tests whether specified path is equivalent to current path.
   * @param {$utils.Path} path
   * @returns {boolean}
   */
  equals: function equals(path) {
    var result = equals.returned;

    if (!result) {
      return result;
    }

    var componentsLeft = this.components,
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
  }
});

//$oop.copyProperties(Array.prototype, /** @lends Array# */{
//  /**
//   * @returns {$utils.Path}
//   */
//  toPath: function () {
//    return $utils.Path.create({components: this});
//  }
//});
