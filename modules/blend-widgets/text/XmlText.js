"use strict";

/**
 * @mixin $widgets.XmlText
 * @extends $widget.XmlNode
 * @augments $widgets.Text
 */
$widgets.XmlText = $oop.getClass('$widgets.XmlText')
.blend($oop.getClass('$widget.XmlNode'))
.expect($oop.getClass('$widgets.Text'))
.define(/** @lends $widgets.XmlText# */{
  /**
   * @returns {string}
   */
  getContentMarkup: function getContentMarkup() {
    return getContentMarkup.returned +
        $widget.escapeXmlEntities($utils.stringify(this.textString));
  }
});

$oop.getClass('$widgets.Text')
.forwardBlend($widgets.XmlText, $widget.isHtml);
