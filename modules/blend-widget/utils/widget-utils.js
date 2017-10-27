"use strict";

$oop.copyProperties($widget, /** @lends $widget */{
  /**
   * @param {string} string
   * @returns {string}
   */
  escapeXmlEntities: function (string) {
    return $widget.XmlEscaper.escapeXmlEntities(string);
  },

  /**
   * To be used for sorting arrays, or `OrderedList` instances.
   * @param {$widget.Node} nodeA
   * @param {$widget.Node} nodeB
   * @returns {number}
   */
  compareNodes: function (nodeA, nodeB) {
    var orderA = nodeA && nodeA.nodeOrder,
        orderB = nodeB && nodeB.nodeOrder,
        nameA = nodeA && nodeA.nodeName,
        nameB = nodeB && nodeB.nodeName;
    return orderA > orderB ? 1 :
        orderA < orderB ? -1 :
            nameA > nameB ? 1 :
                nameA < nameB ? -1 :
                    0;
  }
});
