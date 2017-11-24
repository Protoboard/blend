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
  defaults: function () {
    this.code = this.code || "No code sample";
  },

  /** @ignore */
  spread: function () {
    this.itemTitle = this.itemTitle || this.contentWidget.__classId;
  },

  /** @ignore */
  init: function () {
    this
    .addChildNode($ui.Text.create({
      elementName: 'h3',
      nodeName: 'title',
      nodeOrder: 0,
      textContent: this.itemTitle
    }))
    .addChildNode($ui.Text.create({
      elementName: 'p',
      nodeName: 'widgetId',
      nodeOrder: 1,
      textContent: this.contentWidget.getAttribute('id')
    }))
    .addChildNode(
        this.contentWidget
        .setNodeName('widget')
        .setNodeOrder(2))
    .addChildNode($ui.Text.create({
      elementName: 'pre',
      nodeName: 'code',
      nodeOrder: 3,
      textContent: String(this.code)
    }));
  }
});
