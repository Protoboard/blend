"use strict";

/**
 * Implements DOM-specific behavior for `Text` widgets.
 * @mixin $widgets.DomText
 * @extends $widgets.HtmlText
 * @extends $widget.DomWidget
 */
$widgets.DomText = $oop.getClass('$widgets.DomText')
.blend($oop.getClass('$widgets.HtmlText'))
.blend($widget.DomWidget)
.define(/** @lends $widgets.DomText# */{
  /**
   * @param {string|$utils.Stringifiable} textString
   * @returns {$widgets.DomText}
   */
  setTextString: function setTextString(textString) {
    var textStringBefore = setTextString.shared.textStringBefore;
    if (textString !== textStringBefore) {
      this.reRenderContents();
    }
    return this;
  }
});

$oop.getClass('$widgets.HtmlText')
.forwardBlend($widgets.DomText, $utils.isBrowser);