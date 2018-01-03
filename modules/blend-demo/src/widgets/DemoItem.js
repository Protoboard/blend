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
$demo.DemoItem = $oop.createClass('$demo.DemoItem')
.blend($widget.Widget)
.define(/** @lends $demo.DemoItem# */{
  /**
   * @member {string} $demo.DemoItem#itemTitle
   */

  /**
   * @member {$widget.Widget} $demo.DemoItem#contentWidget
   */

  /**
   */
  xmlTemplate: [
    //@formatter:off
    '<div class="container1">',
      '<h3 blend-nodeName="title"></h3>',
      '<p blend-nodeName="widgetId"></p>',
      '<div blend-nodeName="widget"></div>',
      '<pre blend-nodeName="code"></pre>',
    '</div>'
    //@formatter:on
  ].join(''),

  /** @ignore */
  defaults: function () {
    this.code = this.code || "No code sample";
  },

  /** @ignore */
  spread: function () {
    this.itemTitle = this.itemTitle || this.contentWidget.__className;
  },

  /** @ignore */
  init: function () {
    this
    .addChildNode($ui.Text.create({
      nodeName: 'title',
      textContent: this.itemTitle
    }, this._childProperties.title))
    .addChildNode($ui.Text.create({
      nodeName: 'widgetId',
      textContent: this.contentWidget.getAttribute('id')
    }, this._childProperties.widgetId))
    .addChildNode(
        this.contentWidget
        .setNodeName('widget')
        .setNodeOrder(2))
    .addChildNode($ui.Text.create({
      nodeName: 'code',
      textContent: String(this.code)
    }, this._childProperties.code));
  }
})
.build();
