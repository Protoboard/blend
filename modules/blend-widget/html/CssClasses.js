"use strict";

/**
 * @function $widget.CssClasses.create
 * @param {Object} [properties]
 * @param {Object|Array} [properties.data]
 * @returns {$widget.CssClasses}
 */

/**
 * @class $widget.CssClasses
 * @extends $data.Collection
 * @implements $utils.Stringifiable
 * @todo Change base class to StringSet?
 */
$widget.CssClasses = $oop.getClass('$widget.CssClasses')
.blend($data.Collection)
.implement($utils.Stringifiable)
.define(/** @lends $widget.CssClasses# */{
  /** @returns {string} */
  toString: function () {
    return this.getKeys().join(' ');
  }
});
