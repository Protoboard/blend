"use strict";

/**
 * Two-way binds `inputValue` to an associated `inputValueEntity`.
 * @mixin $ui.EntityInputValueHost
 * @extends $ui.EntityPropertyBound
 * @extends $ui.InputValueHost
 */
$ui.EntityInputValueHost = $oop.createClass('$ui.EntityInputValueHost')
.blend($ui.EntityPropertyBound)
.blend($ui.InputValueHost)
.define(/** @lends $ui.EntityInputValueHost# */{
  /**
   * @member {$entity.LeafNoded} $ui.EntityInputValueHost#inputValueEntity
   */

  /**
   * @memberOf $ui.EntityInputValueHost
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
   * @returns {$ui.EntityInputValueHost}
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
   * @returns {$ui.EntityInputValueHost}
   */
  setInputValueEntity: function (inputValueEntity) {
    this.setEntityProperty('inputValueEntity', inputValueEntity);
    return this;
  }
})
.build();
