"use strict";

/**
 * @mixin $ui.TextareaElementHost
 * @extends $widget.HtmlWidget
 * @extends $ui.DisabledAttributeHost
 * @augments $ui.Inputable
 */
$ui.TextareaElementHost = $oop.getClass('$ui.TextareaElementHost')
.blend($widget.HtmlWidget)
.blend($oop.getClass('$ui.DisabledAttributeHost'))
.expect($oop.getClass('$ui.Inputable'))
.define(/** @lends $ui.TextareaElementHost# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'textarea';
  },

  /**
   * @returns {string}
   * @todo Remove once based on TextContentHost
   */
  getContentMarkup: function getContentMarkup() {
    return getContentMarkup.returned +
        $widget.escapeXmlEntities($utils.stringify(this.inputValue));
  }
});
