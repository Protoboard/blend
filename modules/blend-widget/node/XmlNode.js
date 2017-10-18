"use strict";

/**
 * XML manifest behavior for `Node` classes.
 * @mixin $widget.XmlNode
 * @augments $widget.Node
 */
$widget.XmlNode = $oop.getClass('$widget.XmlNode')
.expect($oop.getClass('$widget.Node'))
.implement($utils.Stringifiable)
.define(/** @lends $widget.XmlNode# */{
  /**
   * @member {string} $widget.XmlNode#elementName
   */

  /**
   * @member {$widget.XmlAttributes} $widget.XmlNode#attributes
   */

  /**
   * @memberOf $widget.XmlNode
   * @param {string} elementName
   * @returns {$widget.XmlNode}
   */
  fromElementName: function (elementName) {
    return this.create({elementName: elementName});
  },

  /** @ignore */
  spread: function () {
    this.attributes = this.attributes || $widget.XmlAttributes.create();
  },

  /** @ignore */
  init: function () {
    $assert.isString(this.elementName, "Invalid elementName");
  },

  /**
   * @param attributeName
   * @param attributeValue
   * @returns {$widget.XmlNode}
   */
  setAttribute: function (attributeName, attributeValue) {
    this.attributes.setItem(attributeName, attributeValue);
    return this;
  },

  /**
   * @param attributeName
   * @returns {string}
   */
  getAttribute: function (attributeName) {
    return this.attributes.getValue(attributeName);
  },

  /**
   * @param attributeName
   * @returns {$widget.XmlNode}
   */
  deleteAttribute: function (attributeName) {
    this.attributes.deleteItem(attributeName);
    return this;
  },

  /**
   * @returns {string}
   */
  toString: function () {
    var elementName = $widget.escapeXmlEntities(this.elementName);
    return [
      '<' + elementName + ' ' + this.attributes + '>',
      // todo Would be nice if we could decouple children from XmlNode
      this.childNodes
      .callOnEachValue('toString')
      .getValues()
      // todo Sort by child order once introduced
      .sort()
      .join(''),
      '</' + elementName + '>'
    ].join('');
  }
});
