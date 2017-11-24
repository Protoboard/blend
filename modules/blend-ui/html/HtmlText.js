"use strict";

/**
 * @mixin $ui.HtmlText
 * @extends $widget.HtmlWidget
 * @augments $ui.Text
 */
$ui.HtmlText = $oop.getClass('$ui.HtmlText')
.blend($widget.HtmlWidget)
.expect($oop.getClass('$ui.Text'))
.define(/** @lends $ui.HtmlText# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'span';
  },

  /**
   * @returns {string}
   */
  getContentMarkup: function getContentMarkup() {
    return getContentMarkup.returned +
        $widget.escapeXmlEntities($utils.stringify(this.textContent));
  }
});

$oop.getClass('$ui.Text')
.forwardBlend($ui.HtmlText, $widget.isHtml);
