"use strict";

/**
 * @mixin $widgets.XmlText
 * @augments $widgets.Text
 */
$widgets.XmlText = $oop.getClass('$widgets.XmlText')
.expect($oop.getClass('$widgets.Text'))
.define(/** @lends $widgets.XmlText# */{
  /**
   * @returns {string}
   */
  getContentMarkup: function getContentMarkup() {
    return getContentMarkup.returned + $utils.stringify(this.textString);
  }
});

$oop.getClass('$widgets.Text')
.forwardBlend($widgets.XmlText, $widget.isBrowser);