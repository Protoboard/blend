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
$entity.FieldValueTypePath = $oop.createClass('$entity.FieldValueTypePath')
.blend($data.TreePath)
.define(/** @lends $entity.FieldValueTypePath# */{
  /**
   * @memberOf $entity.FieldValueTypePath
   * @param valueType
   * @param {Object} [properties]
   * @returns {*|$data.TreePath}
   */
  fromFieldValueType: function (valueType, properties) {
    return this.create({
      components: [
        'document', '__field', '__field/valueType', 'options', valueType]
    }, properties);
  }
})
.build();

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.FieldValueTypePath}
   */
  toFieldValueTypePath: function (properties) {
    return $entity.FieldValueTypePath.fromFieldValueType(this.valueOf(), properties);
  }
});
