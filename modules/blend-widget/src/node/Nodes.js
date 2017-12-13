"use strict";

/**
 * @function $widget.Nodes.create
 * @returns {$widget.Nodes}
 */

/**
 * @class $widget.Nodes
 * @extends $data.OrderedList
 */
$widget.Nodes = $oop.createClass('$widget.Nodes')
.blend($data.OrderedList)
.define(/** @lends $widget.Nodes# */{
  /** @ignore */
  defaults: function () {
    this.compare = this.compare || $widget.compareNodes;
  }
})
.build();
