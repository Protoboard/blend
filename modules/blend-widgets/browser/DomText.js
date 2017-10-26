"use strict";

/**
 * Implements DOM-specific behavior for `Text` widgets.
 * @mixin $widgets.DomText
 * @extends $widget.DomWidget
 * @augments $widgets.Text
 * @augments $widgets.XmlText
 */
$widgets.DomText = $oop.getClass('$widgets.DomText')
.blend($widget.DomWidget)
.expect($oop.getClass('$widgets.Text'))
.expect($oop.getClass('$widgets.XmlText'))
.define(/** @lends $widgets.DomText# */{
  /**
   * @param {string|$utils.Stringifiable} textString
   * @returns {$widgets.DomText}
   */
  setTextString: function setTextString(textString) {
    var textStringBefore = setTextString.saved.textStringBefore;
    if (textString !== textStringBefore) {
      this.reRenderContents();
    }
    return this;
  }
});

$oop.getClass('$widgets.Text')
.forwardBlend($widgets.DomText, $widget.isBrowser);