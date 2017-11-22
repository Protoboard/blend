"use strict";

/**
 * @mixin $ui.XmlText
 * @extends $widget.XmlNode
 * @augments $ui.Text
 * @todo Rename to TextContentHost & move to /html
 */
$ui.XmlText = $oop.getClass('$ui.XmlText')
.blend($oop.getClass('$widget.XmlNode'))
.expect($oop.getClass('$ui.Text'))
.define(/** @lends $ui.XmlText# */{
  /**
   * @returns {string}
   */
  getContentMarkup: function getContentMarkup() {
    return getContentMarkup.returned +
        $widget.escapeXmlEntities($utils.stringify(this.textString));
  }
});

$oop.getClass('$ui.Text')
.forwardBlend($ui.XmlText, $widget.isHtml);
