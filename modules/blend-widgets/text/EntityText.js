"use strict";

/**
 * @function $widgets.EntityText.create
 * @param {Object} properties
 * @param {$entity.ValueKey} properties.textEntity
 * @returns {$widgets.EntityText}
 */

/**
 * @class $widgets.EntityText
 * @extends $widgets.Text
 * @extends $widgets.EntityPropertyBound
 */
$widgets.EntityText = $oop.getClass('$widgets.EntityText')
.blend($oop.getClass('$widgets.Text'))
.blend($oop.getClass('$widgets.EntityPropertyBound'))
.define(/** @lends $widgets.EntityText# */{
  /**
   * @member {$entity.ValueKey|$entity.ItemKey} $widgets.EntityText#textEntity
   */

  /**
   * @memberOf $widgets.EntityText
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
   * @returns {$widgets.EntityText}
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
