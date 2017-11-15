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
   * @member {$data.Collection} $widget.Stateful#state
   */

  /** @ignore */
  init: function () {
    this.state = $data.Collection.create();
  },

  /**
   * @param {string} stateName
   * @param {*} stateValue
   * @returns {$widget.Stateful}
   */
  setStateValue: function setStateValue(stateName, stateValue) {
    var state = this.state,
        stateValueBefore = state.getValue(stateName);
    if (stateValue !== stateValueBefore) {
      state.setItem(stateName, stateValue);
    }
    setStateValue.shared.stateValueBefore = stateValueBefore;
    return this;
  },

  /**
   * @param {string} stateName
   * @returns {*}
   */
  getStateValue: function (stateName) {
    return this.state.getValue(stateName);
  }
});
