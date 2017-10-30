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
 * @extends $data.Path
 */
$entity.FieldAttributePath = $oop.getClass('$entity.FieldAttributePath')
.blend($data.Path)
.define(/** @lends $entity.FieldAttributePath# */{
  /**
   * @memberOf $entity.FieldAttributePath
   * @param attributeRef
   * @returns {*|$data.Path}
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
