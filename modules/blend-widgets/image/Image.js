"use strict";

/**
 * @function $widgets.Image.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {string|$utils.Stringifiable} [properties.imageUrl]
 * @returns {$widgets.Image}
 */

/**
 * @class $widgets.Image
 * @extends $widget.Widget
 */
$widgets.Image = $oop.getClass('$widgets.Image')
.blend($widget.Widget)
.define(/** @lends $widgets.Image# */{
  /**
   * @member {string|$utils.Stringifiable} $widgets.Image#imageUrl
   */

  /**
   * @param {string|$utils.Stringifiable} imageUrl
   * @returns {$widgets.Image}
   */
  setImageUrl: function setImageUrl(imageUrl) {
    var imageUrlBefore = this.imageUrl;
    if (imageUrl !== imageUrlBefore) {
      this.imageUrl = imageUrl;
    }
    setImageUrl.shared.imageUrlBefore = imageUrlBefore;
    return this;
  }
});
