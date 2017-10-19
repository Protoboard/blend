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
  /**
   * @param {$widget.Node} nodeA
   * @param {$widget.Node} nodeB
   * @returns {number}
   * @private
   */
  _compareNodeOrders: function (nodeA, nodeB) {
    var orderA = nodeA.nodeOrder,
        orderB = nodeB.nodeOrder,
        nameA = nodeA.nodeName,
        nameB = nodeB.nodeName;

    return orderA > orderB ? 1 :
        orderA < orderB ? -1 :
            nameA > nameB ? 1 :
                nameA < nameB ? -1 :
                    0;
  },

  /** @returns {string} */
  toString: function () {
    return this.getValues()
    .sort(this._compareNodeOrders)
    .map(String)
    .join('');
  }
});
