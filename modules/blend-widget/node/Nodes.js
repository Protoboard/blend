"use strict";

/**
 * @function $widget.Nodes.create
 * @returns {$widget.Nodes}
 */

/**
 * @class $widget.Nodes
 * @extends $data.OrderedList
 */
$widget.Nodes = $oop.getClass('$widget.Nodes')
.blend($data.OrderedList)
.define(/** @lends $widget.Nodes# */{
  /** @ignore */
  spread: function () {
    this.compare = $widget.compareNodes;
  }
});
