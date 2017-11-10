"use strict";

/**
 * @function $entity.FieldValueTypePath.create
 * @param {Object} properties
 * @param {string[]} properties.components Identifiable 'steps' along the path.
 * @returns {$entity.FieldValueTypePath}
 */

/**
 * Path identifying a field value type attribute node in the entity
 * container. Its primary purpose is to simplify event subscription by field
 * value type.
 * @class $entity.FieldValueTypePath
 * @extends $data.TreePath
 */
$entity.FieldValueTypePath = $oop.getClass('$entity.FieldValueTypePath')
.blend($data.TreePath)
.define(/** @lends $entity.FieldValueTypePath# */{
  /**
   * @memberOf $entity.FieldValueTypePath
   * @param valueType
   * @returns {*|$data.TreePath}
   */
  fromFieldValueType: function (valueType) {
    return this.create({
      components: [
        'document', '__field', '__field/valueType', 'options', valueType]
    });
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$entity.FieldValueTypePath}
   */
  toFieldValueTypePath: function () {
    return $entity.FieldValueTypePath.fromFieldValueType(this.valueOf());
  }
});
