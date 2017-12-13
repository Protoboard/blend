"use strict";

/**
 * @mixin $ui.TextareaElementHost
 * @extends $widget.HtmlWidget
 * @extends $ui.DisabledAttributeHost
 * @augments $ui.InputValueHost
 */
$ui.TextareaElementHost = $oop.createClass('$ui.TextareaElementHost')
.blend($widget.HtmlWidget)
.blend($ui.DisabledAttributeHost)
.expect($ui.InputValueHost)
.define(/** @lends $ui.TextareaElementHost# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'textarea';
  },

  /**
   * @returns {string}
   */
  getContentMarkup: function getContentMarkup() {
    return getContentMarkup.returned +
        $widget.escapeXmlEntities($utils.stringify(this.inputValue));
  }
})
.build();
