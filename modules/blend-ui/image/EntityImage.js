"use strict";

/**
 * @function $ui.EntityImage.create
 * @returns {$ui.EntityImage}
 */

/**
 * @class $ui.EntityImage
 * @extends $ui.Image
 * @mixes $ui.EntityPropertyBound
 */
$ui.EntityImage = $oop.createClass('$ui.EntityImage')
.blend($ui.Image)
.blend($ui.EntityPropertyBound)
.define(/** @lends $ui.EntityImage# */{
  /**
   * @member {$entity.LeafNoded} $ui.EntityImage#imageUrlEntity
   */

  /**
   * @memberOf $ui.EntityImage
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
   * @returns {$ui.EntityImage}
   */
  setImageUrlEntity: function (imageUrlEntity) {
    this.setEntityProperty('imageUrlEntity', imageUrlEntity);
    return this;
  }
})
.build();
