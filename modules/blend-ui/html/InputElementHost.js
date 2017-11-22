"use strict";

/**
 * @mixin $ui.InputElementHost
 * @extends $widget.HtmlWidget
 * @extends $ui.DisabledAttributeHost
 */
$ui.InputElementHost = $oop.getClass('$ui.InputElementHost')
.blend($widget.HtmlWidget)
.blend($oop.getClass('$ui.DisabledAttributeHost'))
.define(/** @lends $ui.InputElementHost# */{
  /**
   * @member {string} $ui.HtmlTextInput#inputType
   */

  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'input';
  },

  /** @ignore */
  init: function () {
    this._syncTypeAttribute();
  },

  /** @protected */
  _syncTypeAttribute: function () {
    this.setAttribute('type', this.inputType);
  }
});
