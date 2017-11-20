"use strict";

/**
 * @function $widgets.DataText.create
 * @param {Object} properties
 * @param {$entity.ValueKey} properties.textEntity
 * @returns {$widgets.DataText}
 */

/**
 * @class $widgets.DataText
 * @extends $widgets.Text
 * @extends $widgets.EntityPropertyBound
 */
$widgets.DataText = $oop.getClass('$widgets.DataText')
.blend($oop.getClass('$widgets.Text'))
.blend($oop.getClass('$widgets.EntityPropertyBound'))
.define(/** @lends $widgets.DataText# */{
  /**
   * @member {$entity.ValueKey|$entity.ItemKey} $widgets.DataText#textEntity
   */

  /**
   * @memberOf $widgets.DataText
   * @param {$entity.LeafNoded} textEntity
   * @param {Object} [properties]
   */
  fromTextEntity: function (textEntity, properties) {
    return this.create({
      textEntity: textEntity
    }, properties);
  },

  /** @ignore */
  init: function () {
    var textEntity = this.textEntity;
    $assert
    .isInstanceOf(textEntity, $entity.LeafNoded, "Invalid textEntity")
    .isInstanceOf(
        textEntity.entityKey, $entity.ValueKey, "Invalid textEntity key");
  },

  /**
   * @param {$entity.LeafNoded} textEntity
   * @returns {$widgets.DataText}
   */
  setTextEntity: function (textEntity) {
    this.setEntityProperty('textEntity', textEntity);
    return this;
  },

  /** @ignore */
  syncToEntityProperty: function (entityProperty) {
    switch (entityProperty) {
    case 'textEntity':
      this.setTextString(this.textEntity.getNode());
      break;
    }
  }
});
