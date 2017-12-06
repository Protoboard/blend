"use strict";

/**
 * HTML manifest behavior for `Node` classes.
 * @mixin $widget.HtmlNode
 * @extends $widget.XmlNode
 * @todo Maintaining reference count for CSS classes?
 */
$widget.HtmlNode = $oop.createClass('$widget.HtmlNode')
.blend($widget.XmlNode)
.define(/** @lends $widget.HtmlNode# */{
  /**
   * Identifies element in the HTML document.
   * @member {string} $widget.HtmlNode#elementId
   */

  /**
   * CSS classes assigned to the current node.
   * @member {$widget.CssClasses} $widget.HtmlNode#cssClasses
   */

  /**
   * Inline styles assigned to the current node.
   * @member {$widget.InlineStyles} $widget.HtmlNode#inlineStyles
   */

  /**
   * @memberOf $widget.HtmlNode
   * @param {string} elementId
   * @param {Object} [properties]
   * @returns {$widget.HtmlNode}
   */
  fromElementId: function (elementId, properties) {
    return this.create({elementId: elementId}, properties);
  },

  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'div';
    this.cssClasses = this.cssClasses || $widget.CssClasses.create();
    this.inlineStyles = this.inlineStyles || $widget.InlineStyles.create();
  },

  /** @ignore */
  init: function () {
    this._updateIdAttribute();
    this._updateClassAttribute();
    this._updateStyleAttribute();
  },

  /**
   * Updates 'id' XML attribute based on elementId.
   * @private
   */
  _updateIdAttribute: function () {
    var idAttribute = this.elementId;
    if (idAttribute) {
      this.setAttribute('id', idAttribute);
    } else {
      this.deleteAttribute('id');
    }
  },

  /**
   * Updates 'class' XML attribute based on cssClasses collection.
   * @private
   */
  _updateClassAttribute: function () {
    var classAttribute = this.cssClasses.toString();
    if (classAttribute) {
      this.setAttribute('class', classAttribute);
    } else {
      this.deleteAttribute('class');
    }
  },

  /**
   * Updates 'style' XML attribute based on inlineStyles collection.
   * @private
   */
  _updateStyleAttribute: function () {
    var styleAttribute = this.inlineStyles.toString();
    if (styleAttribute) {
      this.setAttribute('style', styleAttribute);
    } else {
      this.deleteAttribute('style');
    }
  },

  /**
   * @param {string} elementId
   * @returns {$widget.HtmlNode}
   */
  setElementId: function (elementId) {
    if (elementId !== this.elementId) {
      this.elementId = elementId;
      this._updateIdAttribute();
    }
    return this;
  },

  /**
   * @param {string} cssClass
   * @returns {$widget.HtmlNode}
   */
  addCssClass: function (cssClass) {
    var cssClasses = this.cssClasses;
    if (!cssClasses.hasItem(cssClass)) {
      cssClasses.setItem(cssClass);
      this._updateClassAttribute();
    }
    return this;
  },

  /**
   * @param {string} cssClass
   * @returns {boolean}
   */
  hasCssClass: function (cssClass) {
    return !!this.cssClasses.hasItem(cssClass);
  },

  /**
   * @param {string} cssClass
   * @returns {$widget.HtmlNode}
   */
  removeCssClass: function (cssClass) {
    var cssClasses = this.cssClasses;
    if (cssClasses.hasItem(cssClass)) {
      cssClasses.deleteItem(cssClass);
      this._updateClassAttribute();
    }
    return this;
  },

  /**
   * @param {string} styleName
   * @param {string} styleValue
   * @returns {$widget.HtmlNode}
   */
  setInlineStyle: function (styleName, styleValue) {
    var inlineStyles = this.inlineStyles;
    if (inlineStyles.getValue(styleName) !== styleValue) {
      inlineStyles.setItem(styleName, styleValue);
      this._updateStyleAttribute();
    }
    return this;
  },

  /**
   * @param {string} styleName
   * @returns {string}
   */
  getInlineStyle: function (styleName) {
    return this.inlineStyles.getValue(styleName);
  },

  /**
   * @param {string} styleName
   * @returns {$widget.HtmlNode}
   */
  deleteInlineStyle: function (styleName) {
    var inlineStyles = this.inlineStyles;
    if (inlineStyles.getValue(styleName)) {
      inlineStyles.deleteItem(styleName);
      this._updateStyleAttribute();
    }
    return this;
  }
})
.build();

$widget.XmlNode
.forwardBlend($widget.HtmlNode, $widget.isHtml);
