"use strict";

/**
 * @function $widget.XmlText.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {string|$utils.Stringifiable} [properties.textString]
 * @returns {$widget.XmlText}
 */

/**
 * @class $widgets.XmlText
 * @extends $widget.XmlNode
 * @augments $widgets.Text
 */
$widgets.XmlText = $oop.getClass('$widgets.XmlText')
.blend($oop.getClass('$widget.XmlNode'))
.blend($oop.getClass('$widgets.Text'))
.define(/** @lends $widgets.XmlText# */{
  /**
   * @returns {string}
   */
  getContentMarkup: function getContentMarkup() {
    return getContentMarkup.returned + $utils.stringify(this.textString);
  }
});

$oop.getClass('$widgets.Text')
.forwardBlend($widgets.XmlText, $widget.isHtml);
