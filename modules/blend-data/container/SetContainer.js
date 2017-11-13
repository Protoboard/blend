"use strict";

/**
 * Maintains a set of singular values. Agnostic about value storage and types.
 * Hosts are expected to implement storage-specific behavior and features.
 * @mixin $data.SetContainer
 * @extends $data.ItemContainer
 * @implements $data.Filterable
 * @implements $data.Reducible
 * @implements $data.SetConvertible
 * @implements $data.KeyValueConvertible
 * @implements $data.Transformable
 */
$data.SetContainer = $oop.getClass('$data.SetContainer')
.blend($oop.getClass('$data.ItemContainer'))
.implement($oop.getClass('$data.Filterable'))
.implement($oop.getClass('$data.Reducible'))
.implement($oop.getClass('$data.SetConvertible'))
.implement($oop.getClass('$data.KeyValueConvertible'))
.implement($oop.getClass('$data.Transformable'))
.define(/** @lends $data.SetContainer# */{
  /**
   * @memberOf $data.SetContainer
   * @param {Array.<string>} array
   * @param {Object} [properties]
   * @returns {$data.SetContainer}
   * @todo Optimize in StringSet & Chain once optimize() is available.
   */
  fromArray: function (array, properties) {
    var result = this.create(properties);
    array.forEach(function (item) {
      result.setItem(item);
    });
    return result;
  },

  /**
   * Transforms a `SetContainer` to the current `SetContainer` class.
   * @memberOf $data.SetContainer
   * @param {$data.SetContainer} setContainer
   * @param {Object} [properties]
   * @returns {$data.SetContainer}
   */
  fromSetContainer: function (setContainer, properties) {
    var result = this.create(properties);
    setContainer.forEachItem(function (item) {
      result.setItem(item);
    });
    return result;
  },

  /**
   * Transforms a `KeyValueContainer` to the current `SetContainer` class,
   * using values from key-value pairs as items. Loses keys.
   * @memberOf $data.SetContainer
   * @param {$data.KeyValueContainer} keyValueContainer
   * @returns {$data.SetContainer}
   * @todo Might be a good idea to add separate key/value versions
   * @todo Move to separate file & delegate?
   */
  fromKeyValueContainer: function (keyValueContainer, properties) {
    var result = this.create(properties);
    keyValueContainer.forEachItem(function (value) {
      result.setItem(value);
    });
    return result;
  },

  /**
   * @returns {$data.SetContainer}
   */
  clone: function clone() {
    var cloned = clone.returned;
    cloned.clear();
    this.forEachItem(function (item) {
      cloned.setItem(item);
    });
    return cloned;
  },

  /**
   * Extracts items matching the condition in the specified callback function
   * and returns the result as a new collection.
   * @param {function} callback Filter function returning a boolean
   * @param {Object} [context] Context for callback
   * @returns {$data.SetContainer} Filtered collection
   */
  filter: function (callback, context) {
    var ResultClass = $oop.getClass(this.__classId),
        result = ResultClass.create();

    this.forEachItem(function (item) {
      if (callback.call(this, item)) {
        result.setItem(item);
      }
    }, context);

    return result;
  },

  /**
   * Accumulates a value based on the contribution of each item, as defined by
   * the specified callback.
   * @param {function} callback Contributes to accumulated value based on
   *     current item
   * @param {*} [initialValue] Initial value for accumulated result
   * @param {Object} [context] Context for callback
   * @returns {*} Accumulated value
   */
  reduce: function (callback, initialValue, context) {
    var result = initialValue;

    this.forEachItem(function (value) {
      result = callback.call(this, result, value);
    }, context);

    return result;
  },

  /**
   * Transforms current `SetContainer` to the specified `DataContainer` class.
   * @param {$data.SetConvertible} SetConvertible
   * @returns {$data.DataContainer}
   */
  to: function (SetConvertible) {
    return SetConvertible.fromSetContainer(this);
  }
});
