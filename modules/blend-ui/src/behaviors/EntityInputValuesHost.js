"use strict";

/**
 * Two-way binds `inputValue` to an associated `inputValuesEntity`.
 * @mixin $ui.EntityInputValuesHost
 * @extends $ui.EntityPropertyBound
 * @extends $ui.InputValuesHost
 */
$ui.EntityInputValuesHost = $oop.createClass('$ui.EntityInputValuesHost')
.blend($ui.EntityPropertyBound)
.blend($ui.InputValuesHost)
.define(/** @lends $ui.EntityInputValuesHost# */{
  /**
   * @member {$entity.LeafNoded} $ui.EntityInputValuesHost#inputValuesEntity
   */

  /**
   * @memberOf $ui.EntityInputValuesHost
   * @param {$entity.LeafNoded} inputValuesEntity
   * @param {Object} [properties]
   */
  fromInputValuesEntity: function (inputValuesEntity, properties) {
    return this.create({
      inputValuesEntity: inputValuesEntity
    }, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOfOptional(this.inputValuesEntity, $entity.CollectionField,
        "Invalid inputValuesEntity");
  },

  /**
   * @param {string} entityProperty
   * @protected
   */
  _syncToEntityProperty: function (entityProperty) {
    var inputValuesEntity = this.inputValuesEntity;
    if (entityProperty === 'inputValuesEntity' && inputValuesEntity) {
      this.setInputValues(inputValuesEntity.getNode());
    }
  },

  /** @private */
  _syncInputValuesEntity: function () {
    var inputValuesEntity = this.inputValuesEntity;
    if (inputValuesEntity) {
      inputValuesEntity.setNode(this.inputValues);
    }
  },

  /**
   * @param {*} inputValues
   * @returns {$ui.EntityInputValuesHost}
   */
  setInputValues: function setInputValues(inputValues) {
    var inputValuesBefore = setInputValues.shared.inputValuesBefore;
    if (inputValues !== inputValuesBefore) {
      this._syncInputValuesEntity();
    }
    return this;
  },

  /**
   * @param {*} inputValue
   * @returns {$ui.EntityInputValuesHost}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = setInputValue.shared.inputValueBefore,
        inputValuesEntity = this.inputValuesEntity;
    if (inputValue !== inputValueBefore && inputValuesEntity) {
      inputValuesEntity.getItem(inputValue).setNode(inputValue);
    }
    return this;
  },

  /**
   * @param {*} inputValue
   * @returns {$ui.EntityInputValuesHost}
   */
  deleteInputValue: function deleteInputValue(inputValue) {
    var inputValueBefore = deleteInputValue.shared.inputValueBefore,
        inputValuesEntity = this.inputValuesEntity;
    if (inputValue !== inputValueBefore && inputValuesEntity) {
      inputValuesEntity.getItem(inputValue).deleteNode();
    }
    return this;
  },

  /**
   * @param {$entity.LeafNoded} inputValuesEntity
   * @returns {$ui.EntityInputValuesHost}
   */
  setInputValuesEntity: function (inputValuesEntity) {
    this.setEntityProperty('inputValuesEntity', inputValuesEntity);
    return this;
  }
})
.build();
