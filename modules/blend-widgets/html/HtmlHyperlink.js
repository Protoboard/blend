"use strict";

/**
 * @mixin $widgets.HtmlHyperlink
 * @extends $widgets.HtmlText
 * @augments $widgets.Hyperlink
 */
$widgets.HtmlHyperlink = $oop.getClass('$widgets.HtmlHyperlink')
.blend($oop.getClass('$widgets.HtmlText'))
.expect($oop.getClass('$widgets.Hyperlink'))
.define(/** @lends $widgets.HtmlHyperlink# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'a';
  },

  /** @ignore */
  init: function () {
    this._syncHrefAttribute();
  },

  /**
   * @protected
   */
  _syncHrefAttribute: function () {
    var targetUrl = this.targetUrl;
    if (targetUrl) {
      this.setAttribute('href', targetUrl);
    } else {
      this.deleteAttribute('href');
    }
  },

  /**
   * @returns {$widgets.HtmlHyperlink}
   */
  setTargetUrl: function (targetUrl) {
    this._syncHrefAttribute();
    return this;
  }
});

$oop.getClass('$widgets.Hyperlink')
.forwardBlend($widgets.HtmlHyperlink, function () {
  return $widget.isHtml();
});
