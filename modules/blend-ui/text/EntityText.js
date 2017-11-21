"use strict";

/**
 * @function $ui.EntityText.create
 * @param {Object} properties
 * @param {$entity.ValueKey} properties.textEntity
 * @returns {$ui.EntityText}
 */

/**
 * @class $ui.EntityText
 * @extends $ui.Text
 * @extends $ui.EntityPropertyBound
 */
$ui.EntityText = $oop.getClass('$ui.EntityText')
.blend($oop.getClass('$ui.Text'))
.blend($oop.getClass('$ui.EntityPropertyBound'))
.define(/** @lends $ui.EntityText# */{
  /**
   * @member {$entity.ValueKey|$entity.ItemKey} $ui.EntityText#textEntity
   */

  /**
   * @memberOf $ui.EntityText
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
    $assert.isInstanceOfOptional(this.textEntity, $entity.LeafNoded,
        "Invalid textEntity");
  },

  /**
   * @protected
   */
  _syncToEntityProperty: function (entityProperty) {
    switch (entityProperty) {
    case 'textEntity':
      this.setTextString(this.textEntity.getNode());
      break;
    }
  },

  /**
   * @param {$entity.LeafNoded} textEntity
   * @returns {$ui.EntityText}
   */
  setTextEntity: function (textEntity) {
    this.setEntityProperty('textEntity', textEntity);
    return this;
  }
});
