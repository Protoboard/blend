"use strict";

$oop.copyProperties($data, /** @lends $data */{
  /**
   * Determines whether an object has any enumerable properties.
   * @param {Object} obj
   * @returns {boolean}
   */
  isEmptyObject: function (obj) {
    var key;
    for (key in obj) {
      if (hOP.call(obj, key)) {
        return false;
      }
    }
    return true;
  },

  /**
   * Determines whether an object has exactly one enumerable property.
   * @todo Remove?
   * @param {Object} obj
   * @returns {boolean}
   */
  isSingleKeyObject: function (obj) {
    var count = 0,
        key;
    for (key in obj) {
      if (hOP.call(obj, key) && ++count > 1) {
        return false;
      }
    }
    return count === 1;
  },

  /**
   * Determines whether an object has more than one enumerable properties.
   * @param {Object} obj
   * @returns {boolean}
   */
  isMultiKeyObject: function (obj) {
    var count = 0,
        key;
    for (key in obj) {
      if (hOP.call(obj, key) && ++count > 1) {
        return true;
      }
    }
    return false;
  },

  /**
   * Creates a shallow copy of an object. Property names will be copied, but
   * property values will point to the original references.
   * @param {object|Array} original
   * @returns {object|Array} Shallow copy of original
   */
  shallowCopy: function (original) {
    var propertyNames,
        i, propertyName,
        result;

    if (original instanceof Array) {
      // shorthand for arrays
      result = original.concat([]);
    } else if (typeof original === 'object' && original !== null) {
      // actual objects
      propertyNames = Object.getOwnPropertyNames(original);
      result = {};
      for (i = 0; i < propertyNames.length; i++) {
        propertyName = propertyNames[i];
        result[propertyName] = original[propertyName];
      }
    } else {
      // primitives
      result = original;
    }

    return result;
  },

  /**
   * Creates a deep copy of an object, optionally limited to the specified
   * depth. Does not check for loops.
   * @param {object|Array} original
   * @param {number} [depth=Infinity]
   * @returns {object|Array} Deep copy of original
   */
  deepCopy: function (original, depth) {
    depth = depth === undefined ? Infinity : depth;

    return (function deepCopy(original, currentDepth) {
      var result,
          keys, keyCount,
          i, key;

      if (currentDepth < depth) {
        if (original instanceof Array) {
          result = [];
          keyCount = original.length;
          for (i = 0; i < keyCount; i++) {
            result[i] = deepCopy(original[i], currentDepth + 1);
          }
        } else if (typeof original === 'object' && original !== null) {
          result = {};
          keys = Object.keys(original);
          keyCount = keys.length;
          for (i = 0; i < keyCount; i++) {
            key = keys[i];
            result[key] = deepCopy(original[key], currentDepth + 1);
          }
        } else {
          result = original;
        }
      } else {
        result = original;
      }

      return result;
    }(original, 0));
  }
});