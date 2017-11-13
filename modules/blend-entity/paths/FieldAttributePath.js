"use strict";

/**
 * @function $entity.FieldAttributePath.create
 * @param {Object} properties
 * @param {string[]} properties.components Identifiable 'steps' along the path.
 * @returns {$entity.FieldAttributePath}
 */

/**
 * Path identifying a field attribute node in the entity container. Its primary
 * purpose is to simplify event subscription by field.
 * @class $entity.FieldAttributePath
 * @extends $data.TreePath
 */
$entity.FieldAttributePath = $oop.getClass('$entity.FieldAttributePath')
.blend($data.TreePath)
.define(/** @lends $entity.FieldAttributePath# */{
  /**
   * @memberOf $entity.FieldAttributePath
   * @param {string} attributeRef
   * @param {Object} [properties]
   * @returns {*|$data.TreePath}
   */
  fromAttributeRef: function (attributeRef, properties) {
    return this.create({
      components: ['document', '__field', attributeRef]
    }, properties);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.FieldAttributePath}
   */
  toFieldAttributePath: function (properties) {
    return $entity.FieldAttributePath.fromAttributeRef(this.valueOf(), properties);
  }
});
