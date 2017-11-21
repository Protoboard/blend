"use strict";

/**
 * @function $widgets.EntityHyperlink.create
 * @param {Object} properties
 * @param {$entity.LeafNoded} properties.textEntity
 * @param {$entity.LeafNoded} properties.targetUrlEntity
 * @returns {$widgets.EntityHyperlink}
 */

/**
 * @class $widgets.EntityHyperlink
 * @extends $widgets.Hyperlink
 * @extends $widgets.EntityText
 */
$widgets.EntityHyperlink = $oop.getClass('$widgets.EntityHyperlink')
.blend($oop.getClass('$widgets.Hyperlink'))
.blend($oop.getClass('$widgets.EntityText'))
.define(/** @lends $widgets.EntityHyperlink# */{
  /**
   * @member {$entity.ValueKey|$entity.ItemKey}
   *     $widgets.EntityText#targetUrlEntity
   */

  /**
   * @memberOf $widgets.EntityHyperlink
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
   * @returns {$widgets.EntityText}
   */
  setTargetUrlEntity: function (targetUrlEntity) {
    this.setEntityProperty('targetUrlEntity', targetUrlEntity);
    return this;
  }
});
