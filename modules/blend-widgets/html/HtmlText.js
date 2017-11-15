"use strict";

/**
 * @function $widget.HtmlText.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {string|$utils.Stringifiable} [properties.textString]
 * @returns {$widget.HtmlText}
 */

/**
 * @class $widgets.HtmlText
 * @extends $widgets.XmlText
 * @extends $widget.HtmlWidget
 */
$widgets.HtmlText = $oop.getClass('$widgets.HtmlText')
.blend($oop.getClass('$widgets.XmlText'))
.blend($widget.HtmlWidget)
.define(/** @lends $widgets.HtmlText# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'span';
  }
});

$oop.getClass('$widgets.XmlText')
.forwardBlend($widgets.HtmlText, $widget.isHtml);
