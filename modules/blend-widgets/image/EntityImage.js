"use strict";

/**
 * @function $widgets.EntityImage.create
 * @returns {$widgets.EntityImage}
 */

/**
 * @class $widgets.EntityImage
 * @extends $widgets.Image
 * @mixes $widgets.EntityPropertyBound
 */
$widgets.EntityImage = $oop.getClass('$widgets.EntityImage')
.blend($oop.getClass('$widgets.Image'))
.blend($oop.getClass('$widgets.EntityPropertyBound'))
.define(/** @lends $widgets.EntityImage# */{
  /**
   * @member {$entity.LeafNoded} $widgets.EntityImage#imageUrlEntity
   */

  /**
   * @memberOf $widgets.EntityImage
   * @param {$entity.LeafNoded} imageUrlEntity
   * @param {Object} [properties]
   */
  fromImageUrlEntity: function (imageUrlEntity, properties) {
    return this.create({
      imageUrlEntity: imageUrlEntity
    }, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOfOptional(this.imageUrlEntity, $entity.LeafNoded,
        "Invalid imageUrlEntity");
  },

  /**
   * @param {string} entityProperty
   * @protected
   */
  _syncToEntityProperty: function (entityProperty) {
    if (entityProperty === 'imageUrlEntity') {
      this.setImageUrl(this.imageUrlEntity.getNode());
    }
  },

  /**
   * @param {$entity.LeafNoded} imageUrlEntity
   * @returns {$widgets.EntityImage}
   */
  setImageUrlEntity: function (imageUrlEntity) {
    this.setEntityProperty('imageUrlEntity', imageUrlEntity);
    return this;
  }
});
