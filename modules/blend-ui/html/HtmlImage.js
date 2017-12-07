"use strict";

/**
 * @mixin $ui.HtmlImage
 * @extends $widget.HtmlWidget
 * @augments $ui.Image
 */
$ui.HtmlImage = $oop.createClass('$ui.HtmlImage')
.blend($widget.HtmlWidget)
.expect($ui.Image)
.define(/** @lends $ui.HtmlImage# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'img';
  },

  /** @ignore */
  init: function () {
    this._syncSrcAttribute();
  },

  /**
   * @protected
   */
  _syncSrcAttribute: function () {
    this.setAttribute('src', $utils.stringify(this.imageUrl));
  },

  /**
   * @param {string|$utils.Stringifiable} imageUrl
   * @returns {$ui.HtmlImage}
   */
  setImageUrl: function setImageUrl(imageUrl) {
    var imageUrlBefore = setImageUrl.returned;
    if (imageUrl !== imageUrlBefore) {
      this._syncSrcAttribute();
    }
    return this;
  }
})
.build();

$ui.Image
.forwardBlend($ui.HtmlImage, $widget.isHtml);
