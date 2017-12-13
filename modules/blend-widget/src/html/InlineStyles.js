"use strict";

/**
 * @function $widget.InlineStyles.create
 * @param {Object} [properties]
 * @param {Object|Array} [properties.data]
 * @returns {$widget.InlineStyles}
 */

/**
 * @class $widget.InlineStyles
 * @extends $data.Collection
 * @implements $utils.Stringifiable
 */
$widget.InlineStyles = $oop.createClass('$widget.InlineStyles')
.blend($data.Collection)
.implement($utils.Stringifiable)
.define(/** @lends $widget.InlineStyles# */{
  /** @returns {string} */
  toString: function () {
    return this
    .mapValues(function (styleValue, styleName) {
      return styleName + ':' + styleValue;
    })
    .getValues()
    .join(';');
  }
})
.build();
