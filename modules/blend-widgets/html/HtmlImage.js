"use strict";

/**
 * @mixin $widgets.HtmlImage
 * @extends $widget.HtmlWidget
 * @augments $widgets.Image
 */
$widgets.HtmlImage = $oop.getClass('$widgets.HtmlImage')
.blend($widget.HtmlWidget)
.expect($oop.getClass('$widgets.Image'))
.define(/** @lends $widgets.HtmlImage# */{
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
   * @returns {$widgets.HtmlImage}
   */
  setImageUrl: function setImageUrl(imageUrl) {
    var imageUrlBefore = setImageUrl.returned;
    if (imageUrl !== imageUrlBefore) {
      this._syncSrcAttribute();
    }
    return this;
  }
});

$oop.getClass('$widgets.Image')
.forwardBlend($widgets.HtmlImage, $widget.isHtml);
