"use strict";

/**
 * @function $ui.BinaryState.create
 * @param {Object} properties
 * @returns {$ui.BinaryState}
 */

/**
 * @class $ui.BinaryState
 */
$ui.BinaryState = $oop.createClass('$ui.BinaryState')
.define(/** @lends $ui.BinaryState# */{
  /**
   * @member {string} $ui.BinaryState#stateName
   */

  /**
   * @member {$data.StringSet} $ui.BinaryState#stateSourceIds
   */

  /**
   * @member {boolean} $ui.BinaryState#cascades
   */

  /**
   * @memberOf $ui.BinaryState
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
   * @returns {$ui.BinaryState}
   */
  addStateSourceId: function (stateSourceId) {
    this.stateSourceIds.setItem(stateSourceId);
    return this;
  },

  /**
   * @param {string} stateSourceId
   * @returns {$ui.BinaryState}
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
})
.build();
