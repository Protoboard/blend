"use strict";

/**
 * @mixin $widgets.InputElementHost
 * @extends $widget.HtmlWidget
 * @extends $widgets.ValueAttributeHost
 */
$widgets.InputElementHost = $oop.getClass('$widgets.InputElementHost')
.blend($widget.HtmlWidget)
.blend($oop.getClass('$widgets.ValueAttributeHost'))
.define(/** @lends $widgets.InputElementHost# */{
  /**
   * @member {string} $widgets.HtmlTextInput#inputType
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
