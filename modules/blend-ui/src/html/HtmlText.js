"use strict";

/**
 * @mixin $ui.HtmlText
 * @extends $widget.HtmlWidget
 * @augments $ui.Text
 */
$ui.HtmlText = $oop.createClass('$ui.HtmlText')
.blend($widget.HtmlWidget)
.expect($ui.Text)
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
})
.build();

$ui.Text
.forwardBlend($ui.HtmlText, $widget.isHtml);
