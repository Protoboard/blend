"use strict";

/**
 * Two-way binds `ownValue` and `isSelected` to associated
 * `ownValueEntity` and `isSelectedEntity`.
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
   * @member {$entity.LeafNoded} $ui.EntitySelectable#isSelectedEntity
   */

  /**
   * @memberOf $ui.EntitySelectable
   * @param {$entity.LeafNoded} ownValueEntity
   * @param {$entity.LeafNoded} [isSelectedEntity]
   * @param {Object} [properties]
   */
  fromOwnValueEntity: function (ownValueEntity, isSelectedEntity,
      properties
  ) {
    return this.create({
      ownValueEntity: ownValueEntity,
      isSelectedEntity: isSelectedEntity
    }, properties);
  },

  /** @ignore */
  init: function () {
    $assert
    .isInstanceOfOptional(this.ownValueEntity, $entity.LeafNoded,
        "Invalid ownValueEntity")
    .isInstanceOfOptional(this.isSelectedEntity, $entity.LeafNoded,
        "Invalid isSelectedEntity");
  },

  /**
   * @param {string} entityProperty
   * @protected
   */
  _syncToEntityProperty: function (entityProperty) {
    var ownValueEntity = this.ownValueEntity,
        isSelectedEntity = this.isSelectedEntity;

    switch (entityProperty) {
    case 'ownValueEntity':
      if (ownValueEntity) {
        this.setOwnValue(ownValueEntity.getNode());
      }
      break;

    case 'isSelectedEntity':
      if (isSelectedEntity) {
        if (isSelectedEntity.getNode()) {
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
    var isSelectedEntity = this.isSelectedEntity;
    if (isSelectedEntity) {
      isSelectedEntity.setNode(this.isSelected);
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
    var isSelectedBefore = select.shared.isSelectedBefore;
    if (!isSelectedBefore) {
      this._syncIsSelectedEntity();
    }
    return this;
  },

  /**
   * @returns {$ui.EntitySelectable}
   */
  deselect: function select() {
    var isSelectedBefore = select.shared.isSelectedBefore;
    if (isSelectedBefore) {
      this._syncIsSelectedEntity();
    }
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
   * @param {$entity.LeafNoded} isSelectedEntity
   * @returns {$ui.EntitySelectable}
   */
  setIsSelectedEntity: function (isSelectedEntity) {
    this.setEntityProperty('isSelectedEntity', isSelectedEntity);
    return this;
  }
});
