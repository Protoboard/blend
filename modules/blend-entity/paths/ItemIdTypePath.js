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
 * @extends $data.Path
 */
$entity.ItemIdTypePath = $oop.getClass('$entity.ItemIdTypePath')
.blend($data.Path)
.define(/** @lends $entity.ItemIdTypePath# */{
  /**
   * @memberOf $entity.ItemIdTypePath
   * @param idType
   * @returns {*|$data.Path}
   */
  fromItemIdType: function (idType) {
    return this.create({
      components: [
        'document', '__field', '__field/itemIdType', 'options', idType]
    });
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$entity.ItemIdTypePath}
   */
  toItemIdTypePath: function () {
    return $entity.ItemIdTypePath.fromItemIdType(this.valueOf());
  }
});
