"use strict";

/**
 * @mixin $ui.HtmlHyperlink
 * @extends $ui.HtmlText
 * @augments $ui.Hyperlink
 */
$ui.HtmlHyperlink = $oop.getClass('$ui.HtmlHyperlink')
.blend($oop.getClass('$ui.HtmlText'))
.expect($oop.getClass('$ui.Hyperlink'))
.define(/** @lends $ui.HtmlHyperlink# */{
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
   * @returns {$ui.HtmlHyperlink}
   */
  setTargetUrl: function (targetUrl) {
    this._syncHrefAttribute();
    return this;
  }
});

$oop.getClass('$ui.Hyperlink')
.forwardBlend($ui.HtmlHyperlink, $widget.isHtml);
