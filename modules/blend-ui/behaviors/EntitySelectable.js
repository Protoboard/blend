"use strict";

/**
 * Two-way binds `ownValue` property and `selected` state to associated
 * `ownValueEntity` and `selectedStateEntity`.
 * @mixin $ui.EntitySelectable
 * @extends $ui.EntityPropertyBound
 * @extends $ui.Selectable
 */
$ui.EntitySelectable = $oop.getClass('$ui.EntitySelectable')
.blend($oop.getClass('$ui.EntityPropertyBound'))
.blend($oop.getClass('$ui.Selectable'))
.define(/** @lends $ui.EntitySelectable# */{
  /**
   * @member {$entity.LeafNoded} $ui.EntitySelectable#ownValueEntity
   */

  /**
   * @member {$entity.LeafNoded} $ui.EntitySelectable#selectedStateEntity
   */

  /**
   * @memberOf $ui.EntitySelectable
   * @param {$entity.LeafNoded} ownValueEntity
   * @param {$entity.LeafNoded} [selectedStateEntity]
   * @param {Object} [properties]
   */
  fromOwnValueEntity: function (ownValueEntity, selectedStateEntity,
      properties
  ) {
    return this.create({
      ownValueEntity: ownValueEntity,
      selectedStateEntity: selectedStateEntity
    }, properties);
  },

  /** @ignore */
  init: function () {
    $assert
    .isInstanceOfOptional(this.ownValueEntity, $entity.LeafNoded,
        "Invalid ownValueEntity")
    .isInstanceOfOptional(this.selectedStateEntity, $entity.LeafNoded,
        "Invalid selectedStateEntity");
  },

  /**
   * @param {string} entityProperty
   * @protected
   */
  _syncToEntityProperty: function (entityProperty) {
    var ownValueEntity = this.ownValueEntity,
        selectedStateEntity = this.selectedStateEntity;

    switch (entityProperty) {
    case 'ownValueEntity':
      if (ownValueEntity) {
        this.setOwnValue(ownValueEntity.getNode());
      }
      break;

    case 'selectedStateEntity':
      if (selectedStateEntity) {
        if (selectedStateEntity.getNode()) {
          this.select();
        } else {
          this.deselect();
        }
      }
      break;
    }
  },

  /** @private */
  _syncOwnValueEntity: function () {
    var ownValueEntity = this.ownValueEntity;
    if (ownValueEntity) {
      ownValueEntity.setNode(this.ownValue);
    }
  },

  /** @private */
  _syncIsSelectedEntity: function () {
    var selectedStateEntity = this.selectedStateEntity;
    if (selectedStateEntity) {
      selectedStateEntity.setNode(this.isSelected());
    }
  },

  /**
   * @param {*} ownValue
   * @returns {$ui.EntitySelectable}
   */
  setOwnValue: function setOwnValue(ownValue) {
    var ownValueBefore = setOwnValue.shared.ownValueBefore;
    if (ownValue !== ownValueBefore) {
      this._syncOwnValueEntity();
    }
    return this;
  },

  /**
   * @returns {$ui.EntitySelectable}
   */
  select: function select() {
    this._syncIsSelectedEntity();
    return this;
  },

  /**
   * @returns {$ui.EntitySelectable}
   */
  deselect: function select() {
    this._syncIsSelectedEntity();
    return this;
  },

  /**
   * @param {$entity.LeafNoded} ownValueEntity
   * @returns {$ui.EntitySelectable}
   */
  setOwnValueEntity: function (ownValueEntity) {
    this.setEntityProperty('ownValueEntity', ownValueEntity);
    return this;
  },

  /**
   * @param {$entity.LeafNoded} selectedStateEntity
   * @returns {$ui.EntitySelectable}
   */
  setSelectedStateEntity: function (selectedStateEntity) {
    this.setEntityProperty('selectedStateEntity', selectedStateEntity);
    return this;
  }
});
