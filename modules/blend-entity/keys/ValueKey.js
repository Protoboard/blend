"use strict";

/**
 * Marks entity keys that identify value nodes in the entity store.
 * @mixin $entity.ValueKey
 * @augments $entity.EntityKey
 */
$entity.ValueKey = $oop.createClass('$entity.ValueKey')
.expect($entity.EntityKey)
.define(/** @lends $entity.ValueKey# */{
  /**
   * @inheritDoc
   * @returns {string}
   */
  getNodeType: function getNodeType() {
    return getNodeType.returned || 'leaf';
  },

  /**
   * Retrieves `valueType` attribute for the current entity.
   * @returns {string}
   */
  getValueType: function () {
    return this.getAttribute('valueType');
  },

  /**
   * Retrieves `valueType` attribute for the current entity.
   * @returns {string}
   */
  getValueOptions: function () {
    return this.getAttribute('valueOptions');
  }
})
.build();
