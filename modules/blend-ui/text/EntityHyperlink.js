"use strict";

/**
 * @function $ui.EntityHyperlink.create
 * @param {Object} properties
 * @param {$entity.LeafNoded} properties.textEntity
 * @param {$entity.LeafNoded} properties.targetUrlEntity
 * @returns {$ui.EntityHyperlink}
 */

/**
 * @class $ui.EntityHyperlink
 * @extends $ui.Hyperlink
 * @extends $ui.EntityText
 */
$ui.EntityHyperlink = $oop.getClass('$ui.EntityHyperlink')
.blend($oop.getClass('$ui.Hyperlink'))
.blend($oop.getClass('$ui.EntityText'))
.define(/** @lends $ui.EntityHyperlink# */{
  /**
   * @member {$entity.ValueKey|$entity.ItemKey}
   *     $ui.EntityText#targetUrlEntity
   */

  /**
   * @memberOf $ui.EntityHyperlink
   * @param {$entity.ValueKey} targetUrlEntity
   * @param {Object} [properties]
   */
  fromTargetUrlEntity: function (targetUrlEntity, properties) {
    return this.create({
      targetUrlEntity: targetUrlEntity
    }, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOfOptional(
        this.targetUrlEntity, $entity.LeafNoded, "Invalid targetUrlEntity");
  },

  /**
   * @protected
   */
  _syncToEntityProperty: function (entityProperty) {
    if (entityProperty === 'targetUrlEntity') {
      this.setTargetUrl(this.targetUrlEntity.getNode());
    }
  },

  /**
   * @param {$entity.LeafNoded} targetUrlEntity
   * @returns {$ui.EntityText}
   */
  setTargetUrlEntity: function (targetUrlEntity) {
    this.setEntityProperty('targetUrlEntity', targetUrlEntity);
    return this;
  }
});
