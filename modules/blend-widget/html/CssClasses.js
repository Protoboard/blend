"use strict";

/**
 * @function $widget.CssClasses.create
 * @param {Object} [properties]
 * @param {Object|Array} [properties.data]
 * @returns {$widget.CssClasses}
 */

/**
 * @class $widget.CssClasses
 * @extends $data.StringSet
 * @implements $utils.Stringifiable
 */
$widget.CssClasses = $oop.getClass('$widget.CssClasses')
.blend($data.StringSet)
.implement($utils.Stringifiable)
.define(/** @lends $widget.CssClasses# */{
  /** @returns {string} */
  toString: function () {
    return Object.keys(this.data).join(' ');
  }
});
