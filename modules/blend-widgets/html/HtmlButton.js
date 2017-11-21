"use strict";

/**
 * @mixin $widgets.HtmlButton
 * @extend $widget.HtmlWidget
 * @augments $widgets.Button
 */
$widgets.HtmlButton = $oop.getClass('$widgets.HtmlButton')
.blend($widget.HtmlWidget)
.expect($oop.getClass('$widgets.Button'))
.define(/** @lends $widgets.HtmlButton# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'button';
  },

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
   * @returns {$widgets.HtmlButton}
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

$oop.getClass('$widgets.Button')
.forwardBlend($widgets.HtmlButton, $widget.isHtml);
