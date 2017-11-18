"use strict";

/**
 * @function $demo.DemoItem.create
 * @param {Object} properties
 * @param {string} properties.itemTitle
 * @param {$widget.Widget} properties.contentWidget
 * @returns {$demo.DemoItem}
 */

/**
 * @class $demo.DemoItem
 * @extends $widget.Widget
 */
$demo.DemoItem = $oop.getClass('$demo.DemoItem')
.blend($widget.Widget)
.define(/** @lends $demo.DemoItem# */{
  /**
   * @member {string} $demo.DemoItem#itemTitle
   */

  /**
   * @member {$widget.Widget} $demo.DemoItem#contentWidget
   */

  /** @ignore */
  spread: function () {
    this.itemTitle = this.itemTitle || this.contentWidget.__classId;
  },

  /** @ignore */
  init: function () {
    this
    .addChildNode($widgets.Text.create({
      elementName: 'h3',
      nodeName: 'title',
      nodeOrder: 0,
      textString: this.itemTitle
    }))
    .addChildNode(
        this.contentWidget
        .setNodeName('widget')
        .setNodeOrder(1));
  }
});
