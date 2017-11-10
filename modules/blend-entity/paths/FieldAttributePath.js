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
   * @param attributeRef
   * @returns {*|$data.TreePath}
   */
  fromAttributeRef: function (attributeRef) {
    return this.create({
      components: ['document', '__field', attributeRef]
    });
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$entity.FieldAttributePath}
   */
  toFieldAttributePath: function () {
    return $entity.FieldAttributePath.fromAttributeRef(this.valueOf());
  }
});
