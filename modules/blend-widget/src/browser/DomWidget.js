"use strict";

/**
 * @mixin $widget.DomWidget
 * @extends $widget.DomNode
 * @extends $widget.HtmlWidget
 */
$widget.DomWidget = $oop.createClass('$widget.DomWidget')
.blend($widget.DomNode)
.blend($widget.HtmlWidget)
.define(/** @lends $widget.DomWidget# */{
  /**
   * @param {$widget.DomWidget} node
   * @returns {$widget.DomWidget}
   */
  addChildNode: function addChildNode(node) {
    var childNodeBefore = addChildNode.shared.childNodeBefore;
    if (node !== childNodeBefore && this.isAttached() && this.getElement()) {
      node.onRender();
    }
    return this;
  },

  /**
   * @param {Element} parentElement
   * @returns {$widget.DomWidget}
   * @ignore
   */
  renderInto: function (parentElement) {
    this.onRender();
    return this;
  },

  /**
   * @returns {$widget.DomWidget}
   */
  reRender: function () {
    var element = this.getElement();
    if (element) {
      this.onRender();
    }
    return this;
  },

  /**
   * @returns {$widget.DomWidget}
   */
  reRenderContents: function () {
    var element = this.getElement();
    if (element) {
      this.onRender();
    }
    return this;
  },

  /** @ignore */
  onRender: function () {
    this.childNodeByNodeName.callOnEachValue('onRender');
  }
})
.build();

$widget.HtmlWidget
.forwardBlend($widget.DomWidget, $utils.isBrowser);
