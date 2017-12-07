"use strict";

/**
 * @function $ui.Image.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {string|$utils.Stringifiable} [properties.imageUrl]
 * @returns {$ui.Image}
 */

/**
 * @class $ui.Image
 * @extends $widget.Widget
 */
$ui.Image = $oop.createClass('$ui.Image')
.blend($widget.Widget)
.define(/** @lends $ui.Image# */{
  /**
   * @member {string|$utils.Stringifiable} $ui.Image#imageUrl
   */

  /**
   * @param {string|$utils.Stringifiable} imageUrl
   * @returns {$ui.Image}
   */
  setImageUrl: function setImageUrl(imageUrl) {
    var imageUrlBefore = this.imageUrl;
    if (imageUrl !== imageUrlBefore) {
      this.imageUrl = imageUrl;
    }
    setImageUrl.shared.imageUrlBefore = imageUrlBefore;
    return this;
  }
})
.build();
