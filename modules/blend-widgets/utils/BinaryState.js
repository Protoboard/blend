"use strict";

/**
 * @function $widgets.BinaryState.create
 * @param {Object} properties
 * @returns {$widgets.BinaryState}
 */

/**
 * @class $widgets.BinaryState
 */
$widgets.BinaryState = $oop.getClass('$widgets.BinaryState')
.define(/** @lends $widgets.BinaryState# */{
  /**
   * @member {string} $widgets.BinaryState#stateName
   */

  /**
   * @member {$data.StringSet} $widgets.BinaryState#stateSourceIds
   */

  /**
   * @member {boolean} $widgets.BinaryState#cascades
   */

  /**
   * @memberOf $widgets.BinaryState
   * @param {string} stateName
   * @param {Object} [properties]
   */
  fromStateName: function (stateName, properties) {
    return this.create({
      stateName: stateName
    }, properties);
  },

  /** @ignore */
  defaults: function () {
    this.stateSourceIds = this.stateSourceIds || $data.StringSet.create();
    if (this.cascades === undefined) {
      this.cascades = false;
    }
  },

  /** @ignore */
  init: function () {
    $assert.isString(this.stateName, "Invalid state name");
  },

  /**
   * @param {string} stateSourceId
   * @returns {$widgets.BinaryState}
   */
  addStateSourceId: function (stateSourceId) {
    this.stateSourceIds.setItem(stateSourceId);
    return this;
  },

  /**
   * @param {string} stateSourceId
   * @returns {$widgets.BinaryState}
   */
  removeStateSourceId: function (stateSourceId) {
    this.stateSourceIds.deleteItem(stateSourceId);
    return this;
  },

  /**
   * @returns {boolean}
   */
  isStateOn: function () {
    return this.stateSourceIds.getItemCount() > 0;
  }
});
