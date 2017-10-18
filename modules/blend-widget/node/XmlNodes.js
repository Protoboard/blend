"use strict";

/**
 * @function $widget.XmlNodes.create
 * @param {Object} [properties]
 * @param {object|Array} [properties.data]
 * @returns {$widget.XmlNodes}
 */

/**
 * @class $widget.XmlNodes
 * @extends $data.Collection
 * @implements $utils.Stringifiable
 */
$widget.XmlNodes = $oop.getClass('$widget.XmlNodes')
.blend($data.Collection)
.implement($utils.Stringifiable)
.define(/** @lends $widget.XmlNodes# */{
  /** @returns {string} */
  toString: function () {
    return this
    .callOnEachValue('toString')
    .getValues()
    // todo Sort by child order once introduced
    .sort()
    .join('');
  }
});
