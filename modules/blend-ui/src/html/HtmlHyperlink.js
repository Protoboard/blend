"use strict";

/**
 * @mixin $ui.HtmlHyperlink
 * @extends $ui.HtmlText
 * @augments $ui.Hyperlink
 */
$ui.HtmlHyperlink = $oop.createClass('$ui.HtmlHyperlink')
.blend($ui.HtmlText)
.expect($ui.Hyperlink)
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
      this.setAttribute('href', $utils.stringify(targetUrl));
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
})
.build();

$ui.Hyperlink
.forwardBlend($ui.HtmlHyperlink, $widget.isHtml);
