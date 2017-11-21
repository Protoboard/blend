"use strict";

/**
 * Implements DOM-specific behavior for `Text` widgets.
 * @mixin $ui.DomText
 * @extends $ui.HtmlText
 * @extends $widget.DomWidget
 */
$ui.DomText = $oop.getClass('$ui.DomText')
.blend($oop.getClass('$ui.HtmlText'))
.blend($widget.DomWidget)
.define(/** @lends $ui.DomText# */{
  /**
   * @param {string|$utils.Stringifiable} textString
   * @returns {$ui.DomText}
   */
  setTextString: function setTextString(textString) {
    var textStringBefore = setTextString.shared.textStringBefore;
    if (textString !== textStringBefore) {
      this.reRenderContents();
    }
    return this;
  }
});

$oop.getClass('$ui.HtmlText')
.forwardBlend($ui.DomText, $utils.isBrowser);