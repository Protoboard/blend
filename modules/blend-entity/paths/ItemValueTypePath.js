"use strict";

/**
 * @function $entity.ItemValueTypePath.create
 * @param {Object} properties
 * @param {string[]} properties.components Identifiable 'steps' along the path.
 * @returns {$entity.ItemValueTypePath}
 */

/**
 * Path identifying an item value type attribute node in the entity
 * container. Its primary purpose is to simplify event subscription by item
 * value type.
 * @class $entity.ItemValueTypePath
 * @extends $data.TreePath
 */
$entity.ItemValueTypePath = $oop.getClass('$entity.ItemValueTypePath')
.blend($data.TreePath)
.define(/** @lends $entity.ItemValueTypePath# */{
  /**
   * @memberOf $entity.ItemValueTypePath
   * @param valueType
   * @param {Object} [properties]
   * @returns {*|$data.TreePath}
   */
  fromItemValueType: function (valueType, properties) {
    return this.create({
      components: [
        'document', '__field', '__field/itemValueType', 'options', valueType]
    }, properties);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.ItemValueTypePath}
   */
  toItemValueTypePath: function (properties) {
    return $entity.ItemValueTypePath.fromItemValueType(this.valueOf(), properties);
  }
});
