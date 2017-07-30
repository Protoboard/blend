"use strict";

/**
 * Maintains a set of key-value pairs. Agnostic about pair storage and key /
 * value types. Hosts are expected to implement storage-specific behavior and
 * features.
 * @mixin $data.KeyValueContainer
 * @implements $data.Filterable
 * @implements $data.Reducible
 * @extends $data.ItemContainer
 */
$data.KeyValueContainer = $oop.getClass('$data.KeyValueContainer')
.mix($oop.getClass('$data.ItemContainer'))
.implement($oop.getClass('$data.Filterable'))
.implement($oop.getClass('$data.Reducible'))
.define(/** @lends $data.KeyValueContainer# */{
  /**
   * @type {string}
   * @constant
   */
  keyType: $data.KEY_TYPE_ANY,

  /**
   * @type {string}
   * @constant
   */
  valueType: $data.VALUE_TYPE_ANY,

  /**
   * @type {string}
   * @constant
   */
  keyMultiplicity: $data.KEY_MUL_ANY,

  /**
   * @returns {$data.SetContainer}
   */
  clone: function clone() {
    var cloned = clone.returned;
    cloned.clear();
    this.forEachItem(function (value, key) {
      cloned.setItem(key, value);
    });
    return cloned;
  },

  /**
   * Extracts items matching the condition in the specified callback function
   * and returns the result as a new collection. @param {function} callback
   * Filter function returning a boolean
   * @param {function} callback
   * @param {Object} [context] Context for callback
   * @returns {$data.KeyValueContainer} Filtered collection
   */
  filter: function (callback, context) {
    var data = this.data instanceof Array ? [] : {},
        ResultClass = $oop.getClass(this.__classId),
        result = ResultClass.create({data: data});

    this.forEachItem(function (value, key) {
      if (callback.call(this, value, key)) {
        result.setItem(key, value);
      }
    }, context);

    return result;
  },

  /**
   * Accumulates a value based on the contribution of each item, as defined
   * by the specified callback.
   * @param {function} callback Contributes to accumulated value
   * based on current item
   * @param {*} [initialValue] Initial value for accumulated result
   * @param {Object} [context] Context for callback
   * @returns {*} Accumulated value
   */
  reduce: function (callback, initialValue, context) {
    var result = initialValue;

    this.forEachItem(function (value, key) {
      result = callback.call(this, result, value, key);
    }, context);

    return result;
  },

  /**
   * Retrieves a list of all keys in the container. Result might contain
   * duplicates, depending on host class.
   * @returns {Array}
   */
  getKeys: function () {
    var result = [];
    this.forEachItem(function (value, key) {
      result.push(key);
    });
    return result;
  },

  /**
   * @returns {$data.StringCollection}
   */
  getKeysWrapped: function () {
    return $data.StringCollection.create({data: this.getKeys()});
  },

  /**
   * Retrieves a list of all values in the container. Result might contain
   * duplicates, depending on host class.
   * @returns {Array}
   */
  getValues: function () {
    var result = [];
    this.forEachItem(function (value) {
      result.push(value);
    });
    return result;
  },

  /**
   * @returns {$data.Collection}
   */
  getValuesWrapped: function () {
    return $data.Collection.create({data: this.getValues()});
  },

  /**
   * @returns {*}
   */
  getFirstKey: function () {
    var result;
    this.forEachItem(function (value, key) {
      result = key;
      return false;
    });
    return result;
  },

  /**
   * @returns {*}
   */
  getFirstValue: function () {
    var result;
    this.forEachItem(function (value) {
      result = value;
      return false;
    });
    return result;
  },

  /**
   * Converts current KeyValueContainer to the specified class.
   * @param {$data.KeyValueContainer} KeyValueContainer
   * @returns {$data.KeyValueContainer}
   */
  toType: function (KeyValueContainer) {
    var result = KeyValueContainer.create();
    this.forEachItem(function (value, key) {
      result.setItem(key, value);
    });
    return result;
  },

  /**
   * Maps collection values using the specified callback and returns mapped
   * key-value pairs as a new collection.
   * @todo Pass in result value type?
   * @param {function} callback Returns new value based on current item
   * @param {Object} [context] Context for callback
   * @returns {$data.Collection} Mapped collection
   */
  mapValues: function (callback, context) {
    var data = this.data instanceof Array ? [] : {},
        ResultClass = $data.getMapResultClass(this, null, $data.VALUE_TYPE_ANY),
        result = ResultClass.create({data: data});

    this.forEachItem(function (value, key) {
      value = callback.call(this, value, key);
      result.setItem(key, value);
    }, context);

    return result;
  },

  /**
   * Maps collection keys using the specified callback and returns mapped
   * key-value pairs as a new collection.
   * @todo Pass in result value type?
   * @param {function} callback Returns new value based on current item
   * @param {Object} [context] Context for callback
   * @returns {$data.Collection} Mapped collection
   */
  mapKeys: function (callback, context) {
    var ResultClass = $data.getMapResultClass(this, $data.KEY_TYPE_ANY, null),
        result = ResultClass.create();

    this.forEachItem(function (value, key) {
      key = callback.call(this, value, key);
      result.setItem(value, key);
    }, context);

    return result;
  },

  /**
   * Passes each item value to the specified callback as one of its
   * arguments, and returns mapped key-value pairs as a new collection.
   * @param {function} callback Returns new value based on arguments
   * @param {Object} [context] Context for callback
   * @param {number} [argIndex=0] Index of item value among arguments
   * @param {...*} [arg] Rest of arguments to be passed to callback.
   * Item value will be spliced in at given index.
   * @returns {$data.KeyValueContainer} Mapped collection
   */
  passEachValueTo: function (callback, context, argIndex, arg) {
    var args;

    if (arguments.length > 3) {
      // there are additional arguments
      // splicing in placeholder for item value
      args = slice.call(arguments, 3);
      args.splice(argIndex, 0, null);
      return this.mapValues(function (value) {
        args[argIndex] = value;
        return callback.apply(this, args);
      }, context);
    } else {
      // no additional arguments
      return this.mapValues(function (value) {
        return callback.call(this, value);
      }, context);
    }
  },

  /**
   * Calls the specified method on all item values, and returns mapped
   * key-value pairs as a new collection.
   * @param {string} methodName Identifies method on item values
   * @param {...*} [arg] Rest of arguments to be passed to callback.
   * Item value will be spliced in at given index.
   * @returns {$data.KeyValueContainer} Mapped collection
   */
  callOnEachValue: function (methodName, arg) {
    var args;

    if (arguments.length > 1) {
      args = slice.call(arguments, 1);
      return this.mapValues(function (value) {
        return value[methodName].apply(value, args);
      });
    } else {
      return this.mapValues(function (value) {
        return value[methodName]();
      });
    }
  },

  /**
   * Extracts items matching the specified key prefix and returns result as a
   * new collection.
   * @param {string} prefix Key prefix to be matched
   * @returns {$data.KeyValueContainer} Filtered collection
   */
  filterByKeyPrefix: function (prefix) {
    var prefixLength = prefix.length;
    return this.filter(function (value, key) {
      return key.slice(0, prefixLength) === prefix;
    });
  },

  /**
   * @param {string} prefix
   * @returns {$data.KeyValueContainer}
   */
  filterByValuePrefix: function (prefix) {
    var prefixLength = prefix.length;
    return this.filter(function (value) {
      return value.slice(0, prefixLength) === prefix;
    });
  },

  /**
   * Extracts items matching the specified key regular expression and returns
   * result as a new collection.
   * @param {RegExp} regExp Regular expression to be matched by keys
   * @returns {$data.KeyValueContainer} Filtered collection
   */
  filterByKeyRegExp: function (regExp) {
    return this.filter(function (value, key) {
      return regExp.test(key);
    });
  },

  /**
   * @param {RegExp} regExp
   * @returns {$data.KeyValueContainer}
   */
  filterByValueRegExp: function (regExp) {
    return this.filter(function (value) {
      return regExp.test(value);
    });
  },

  /**
   * Extracts items matching the specified value type and returns result as a
   * new collection.
   * @todo Allow repeating arguments.
   * @param {string|function|Object|$oop.Class} type Describes type
   * to be matched by item values. When string, `filterByValueType` will
   * check using `typeof` operator, when function, `instanceof`,
   * when object, `.isPrototypeOf()`, when a class, `.mixedBy()`.
   * @returns {$data.KeyValueContainer} Filtered collection
   */
  filterByValueType: function (type) {
    switch (true) {
    case typeof type === 'string':
      return this.filter(function (value) {
        return typeof value === type;
      });

    case typeof type === 'function':
      return this.filter(function (value) {
        return value instanceof type;
      });

    case $oop.Class.isPrototypeOf(type):
      return this.filter(function (value) {
        return type.mixedBy(value);
      });

    case typeof type === 'object':
      return this.filter(function (value) {
        return type.isPrototypeOf(value);
      });
    }
  },

  /**
   * @returns {$data.KeyValueContainer}
   */
  swapKeysAndValues: function () {
    var result = $data.getSwapResultClass(this).create();
    this.forEachItem(result.setItem, result);
    return result;
  },

  /**
   * @param {$data.KeyValueContainer} rightContainer
   * @returns {$data.KeyValueContainer}
   */
  mergeWith: function (rightContainer) {
    var result = $data.getMergeResultClass(this, rightContainer)
    .create();
    this.forEachItem(function (value, key) {
      result.setItem(key, value);
    });
    rightContainer.forEachItem(function (value, key) {
      result.setItem(key, value);
    });
    return result;
  }
});
