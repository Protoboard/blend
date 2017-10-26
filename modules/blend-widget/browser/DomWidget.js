"use strict";

/**
 * @mixin $widget.DomWidget
 * @extends $widget.DomNode
 * @augments $widget.Widget
 */
$widget.DomWidget = $oop.getClass('$widget.DomWidget')
.blend($oop.getClass('$widget.DomNode'))
.expect($oop.getClass('$widget.Widget'))
.define(/** @lends $widget.DomWidget# */{
  /**
   * @param {$widget.DomWidget} node
   * @returns {$widget.DomWidget}
   */
  addChildNode: function addChildNode(node) {
    var childNodeBefore = addChildNode.saved.childNodeBefore;
    if (node !== childNodeBefore && this.isAttached() && this.getElement()) {
      node.onRender();
    }
    return this;
  },

  /** @ignore */
  onRender: function () {
    this.childNodeLookup.callOnEachValue('onRender');
  }
});

$oop.getClass('$widget.Widget')
.forwardBlend($widget.DomWidget, $widget.isBrowser);
