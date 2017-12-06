"use strict";

/**
 * @function $widget.XmlNodes.create
 * @param {Object} [properties]
 * @param {object|Array} [properties.data]
 * @returns {$widget.XmlNodes}
 */

/**
 * @class $widget.XmlNodes
 * @extends $widget.Nodes
 * @implements $utils.Stringifiable
 */
$widget.XmlNodes = $oop.createClass('$widget.XmlNodes')
.blend($widget.Nodes)
.implement($utils.Stringifiable)
.define(/** @lends $widget.XmlNodes# */{
  /** @returns {string} */
  toString: function () {
    return this.data
    .map(String)
    .join('');
  }
})
.build();
