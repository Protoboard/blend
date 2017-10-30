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
 * @extends $data.Path
 */
$entity.ItemValueTypePath = $oop.getClass('$entity.ItemValueTypePath')
.blend($data.Path)
.define(/** @lends $entity.ItemValueTypePath# */{
  /**
   * @memberOf $entity.ItemValueTypePath
   * @param valueType
   * @returns {*|$data.Path}
   */
  fromItemValueType: function (valueType) {
    return this.create({
      components: [
        'document', '__field', '__field/itemValueType', 'options', valueType]
    });
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$entity.ItemValueTypePath}
   */
  toItemValueTypePath: function () {
    return $entity.ItemValueTypePath.fromItemValueType(this.valueOf());
  }
});
