"use strict";

/**
 * @mixin $ui.TextContentHost
 * @extends $widget.XmlNode
 */
$ui.TextContentHost = $oop.getClass('$ui.TextContentHost')
.blend($oop.getClass('$widget.XmlNode'))
.define(/** @lends $ui.TextContentHost# */{
  /**
   * @returns {string}
   */
  getContentMarkup: function getContentMarkup() {
    return getContentMarkup.returned +
        $widget.escapeXmlEntities($utils.stringify(this.textString));
  }
});
