"use strict";

/**
 * HTML manifest behavior for `Node` classes.
 * @mixin $widget.HtmlNode
 * @extends $widget.XmlNode
 */
$widget.HtmlNode = $oop.getClass('$widget.HtmlNode')
.blend($oop.getClass('$widget.XmlNode'))
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
   * @returns {$widget.HtmlNode}
   */
  fromElementId: function (elementId) {
    return this.create({elementId: elementId});
  },

  /** @ignore */
  spread: function () {
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
    this.setAttribute('id', this.elementId);
  },

  /**
   * Updates 'class' XML attribute based on cssClasses collection.
   * @private
   */
  _updateClassAttribute: function () {
    this.setAttribute('class', this.cssClasses.toString());
  },

  /**
   * Updates 'style' XML attribute based on inlineStyles collection.
   * @private
   */
  _updateStyleAttribute: function () {
    this.setAttribute('style', this.inlineStyles.toString());
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
    if (!cssClasses.getValue(cssClass)) {
      cssClasses.setItem(cssClass, cssClass);
      this._updateClassAttribute();
    }
    return this;
  },

  /**
   * @param {string} cssClass
   * @returns {boolean}
   */
  hasCssClass: function (cssClass) {
    return !!this.cssClasses.getValue(cssClass);
  },

  /**
   * @param {string} cssClass
   * @returns {$widget.HtmlNode}
   */
  removeCssClass: function (cssClass) {
    var cssClasses = this.cssClasses;
    if (cssClasses.getValue(cssClass)) {
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
});
