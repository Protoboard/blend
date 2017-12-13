"use strict";

/**
 * @function $ui.EntityText.create
 * @param {Object} properties
 * @param {$entity.ValueKey} properties.textContentEntity
 * @returns {$ui.EntityText}
 */

/**
 * @class $ui.EntityText
 * @extends $ui.Text
 * @extends $ui.EntityPropertyBound
 */
$ui.EntityText = $oop.createClass('$ui.EntityText')
.blend($ui.Text)
.blend($ui.EntityPropertyBound)
.define(/** @lends $ui.EntityText# */{
  /**
   * @member {$entity.ValueKey|$entity.ItemKey} $ui.EntityText#textContentEntity
   */

  /**
   * @memberOf $ui.EntityText
   * @param {$entity.LeafNoded} textContentEntity
   * @param {Object} [properties]
   */
  fromTextEntity: function (textContentEntity, properties) {
    return this.create({
      textContentEntity: textContentEntity
    }, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOfOptional(this.textContentEntity, $entity.LeafNoded,
        "Invalid textContentEntity");
  },

  /**
   * @protected
   */
  _syncToEntityProperty: function (entityProperty) {
    switch (entityProperty) {
    case 'textContentEntity':
      this.setTextString(this.textContentEntity.getNode());
      break;
    }
  },

  /**
   * @param {$entity.LeafNoded} textContentEntity
   * @returns {$ui.EntityText}
   */
  setTextContentEntity: function (textContentEntity) {
    this.setEntityProperty('textContentEntity', textContentEntity);
    return this;
  }
})
.build();
