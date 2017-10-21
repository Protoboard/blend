"use strict";

/**
 * @function $widget.TextNode.create
 * @returns {$widget.TextNode}
 */

/**
 * @class $widget.TextNode
 * @extends $widget.Node
 * @implements $utils.Stringifiable
 */
$widget.TextNode = $oop.getClass('$widget.TextNode')
.blend($oop.getClass('$widget.Node'))
.blend($oop.getClass('$widget.ChildOnly'))
.implement($utils.Stringifiable)
.define(/** @lends $widget.TextNode# */{
  /**
   * @member {string|$utils.Stringifiable} $widget.TextNode#textContent
   */

  /**
   * @memberOf $widget.TextNode
   * @param {string} string
   * @returns {$widget.TextNode}
   */
  fromString: function (string) {
    return this.create({textContent: string});
  },

  /**
   * @memberOf $widget.TextNode
   * @param {string|$utils.Stringifiable} textContent
   * @returns {$widget.TextNode}
   */
  fromTextContent: function (textContent) {
    return this.create({textContent: textContent});
  },

  /** @returns {string} */
  toString: function () {
    return $utils.stringify(this.textContent);
  }
});
