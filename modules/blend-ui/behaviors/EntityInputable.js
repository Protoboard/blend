"use strict";

/**
 * Two-way binds `inputValue` to an associated `inputValueEntity`.
 * @mixin $ui.EntityInputable
 * @extends $ui.EntityPropertyBound
 * @extends $ui.Inputable
 */
$ui.EntityInputable = $oop.getClass('$ui.EntityInputable')
.blend($oop.getClass('$ui.EntityPropertyBound'))
.blend($oop.getClass('$ui.Inputable'))
.define(/** @lends $ui.EntityInputable# */{
  /**
   * @member {$entity.LeafNoded} $ui.EntityInputable#inputValueEntity
   */

  /**
   * @memberOf $ui.EntityInputable
   * @param {$entity.LeafNoded} inputValueEntity
   * @param {Object} [properties]
   */
  fromInputValueEntity: function (inputValueEntity, properties) {
    return this.create({
      inputValueEntity: inputValueEntity
    }, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOfOptional(this.inputValueEntity, $entity.LeafNoded,
        "Invalid inputValueEntity");
  },

  /**
   * @param {string} entityProperty
   * @protected
   */
  _syncToEntityProperty: function (entityProperty) {
    var inputValueEntity = this.inputValueEntity;
    if (entityProperty === 'inputValueEntity' && inputValueEntity) {
      this.setInputValue(inputValueEntity.getNode());
    }
  },

  /** @private */
  _syncInputValueEntity: function () {
    var inputValueEntity = this.inputValueEntity;
    if (inputValueEntity) {
      inputValueEntity.setNode(this.inputValue);
    }
  },

  /**
   * @param {*} inputValue
   * @returns {$ui.EntityInputable}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = setInputValue.shared.inputValueBefore;
    if (inputValue !== inputValueBefore) {
      this._syncInputValueEntity();
    }
    return this;
  },

  /**
   * @param {$entity.LeafNoded} inputValueEntity
   * @returns {$ui.EntityInputable}
   */
  setInputValueEntity: function (inputValueEntity) {
    this.setEntityProperty('inputValueEntity', inputValueEntity);
    return this;
  }
});
