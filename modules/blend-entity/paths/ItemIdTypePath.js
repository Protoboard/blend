"use strict";

/**
 * @function $entity.ItemIdTypePath.create
 * @param {Object} properties
 * @param {string[]} properties.components Identifiable 'steps' along the path.
 * @returns {$entity.ItemIdTypePath}
 */

/**
 * Path identifying an item value type attribute node in the entity
 * container. Its primary purpose is to simplify event subscription by item
 * ID type.
 * @class $entity.ItemIdTypePath
 * @extends $data.TreePath
 */
$entity.ItemIdTypePath = $oop.getClass('$entity.ItemIdTypePath')
.blend($data.TreePath)
.define(/** @lends $entity.ItemIdTypePath# */{
  /**
   * @memberOf $entity.ItemIdTypePath
   * @param idType
   * @param {Object} [properties]
   * @returns {*|$data.TreePath}
   */
  fromItemIdType: function (idType, properties) {
    return this.create({
      components: [
        'document', '__field', '__field/itemIdType', 'options', idType]
    }, properties);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.ItemIdTypePath}
   */
  toItemIdTypePath: function (properties) {
    return $entity.ItemIdTypePath.fromItemIdType(this.valueOf(), properties);
  }
});
