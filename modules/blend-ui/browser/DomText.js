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
   * @param {string|$utils.Stringifiable} textContent
   * @returns {$ui.DomText}
   */
  setTextString: function setTextString(textContent) {
    var textStringBefore = setTextString.shared.textStringBefore;
    if (textContent !== textStringBefore) {
      // todo Should be syncing to textContent instead?
      this.reRenderContents();
    }
    return this;
  }
});

$oop.getClass('$ui.HtmlText')
.forwardBlend($ui.DomText, $utils.isBrowser);