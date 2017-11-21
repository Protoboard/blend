"use strict";

/**
 * Maintains named sates for the host.
 * @mixin $widget.Stateful
 * @todo Add state change events? Expect Widget? Or EventSender?
 */
$widget.Stateful = $oop.getClass('$widget.Stateful')
.define(/** @lends $widget.Stateful# */{
  /**
   * Contains state
   * @member {Object} $widget.Stateful#state
   */

  /** @ignore */
  defaults: function () {
    this.state = this.state || {};
  },

  /**
   * @param {string} stateName
   * @param {*} stateValue
   * @returns {$widget.Stateful}
   */
  setStateValue: function setStateValue(stateName, stateValue) {
    var state = this.state,
        stateValueBefore = state[stateName];
    if (stateValue !== stateValueBefore) {
      state[stateName] = stateValue;
    }
    setStateValue.shared.stateValueBefore = stateValueBefore;
    return this;
  },

  /**
   * @param {string} stateName
   * @returns {*}
   */
  getStateValue: function (stateName) {
    return this.state[stateName];
  }
});
