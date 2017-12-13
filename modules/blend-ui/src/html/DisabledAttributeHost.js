"use strict";

/**
 * Manifests "disabled" state in "disabled" HTML attribute.
 * @mixin $ui.DisabledAttributeHost
 * @extend $widget.HtmlWidget
 * @augments $ui.Disableable
 */
$ui.DisabledAttributeHost = $oop.createClass('$ui.DisabledAttributeHost')
.blend($widget.HtmlWidget)
.expect($ui.Disableable)
.define(/** @lends $ui.DisabledAttributeHost# */{
  /** @ignore */
  init: function () {
    this._syncDisabledAttribute();
  },

  /**
   * @protected
   */
  _syncDisabledAttribute: function () {
    if (this.getStateValue($ui.STATE_NAME_DISABLED)) {
      this.setAttribute('disabled', 'disabled');
    } else {
      this.deleteAttribute('disabled');
    }
  },

  /**
   * @param {string} stateName
   * @param {*} stateValue
   * @returns {$ui.DisabledAttributeHost}
   */
  setStateValue: function setStateValue(stateName, stateValue) {
    var stateValueBefore = setStateValue.shared.stateValueBefore;
    if (stateName === $ui.STATE_NAME_DISABLED &&
        stateValue !== stateValueBefore
    ) {
      this._syncDisabledAttribute();
    }
    return this;
  }
})
.build();

