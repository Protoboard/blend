"use strict";

/**
 * Manifests "disabled" state in "disabled" HTML attribute.
 * @mixin $widgets.DisabledAttributeHost
 * @extend $widget.HtmlWidget
 * @augments $widgets.Disableable
 */
$widgets.DisabledAttributeHost = $oop.getClass('$widgets.DisabledAttributeHost')
.blend($widget.HtmlWidget)
.expect($oop.getClass('$widgets.Disableable'))
.define(/** @lends $widgets.DisabledAttributeHost# */{
  /** @ignore */
  init: function () {
    this._syncDisabledAttribute();
  },

  /**
   * @protected
   */
  _syncDisabledAttribute: function () {
    if (this.getStateValue($widgets.STATE_NAME_DISABLED)) {
      this.setAttribute('disabled', 'disabled');
    } else {
      this.deleteAttribute('disabled');
    }
  },

  /**
   * @param {string} stateName
   * @param {*} stateValue
   * @returns {$widgets.DisabledAttributeHost}
   */
  setStateValue: function setStateValue(stateName, stateValue) {
    var stateValueBefore = setStateValue.shared.stateValueBefore;
    if (stateName === $widgets.STATE_NAME_DISABLED &&
        stateValue !== stateValueBefore
    ) {
      this._syncDisabledAttribute();
    }
    return this;
  }
});

