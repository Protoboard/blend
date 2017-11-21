"use strict";

/**
 * @function $ui.Hyperlink.create
 * @returns {$ui.Hyperlink}
 */

/**
 * @class $ui.Hyperlink
 */
$ui.Hyperlink = $oop.getClass('$ui.Hyperlink')
.blend($oop.getClass('$ui.Text'))
.define(/** @lends $ui.Hyperlink# */{
  /**
   * @member {string} $ui.Hyperlink#targetUrl
   */

  /**
   * @param {string} targetUrl
   * @returns {$ui.Hyperlink}
   */
  setTargetUrl: function setTargetUrl(targetUrl) {
    var targetUrlBefore = this.targetUrl;
    this.targetUrl = targetUrl;
    setTargetUrl.shared.targetUrlBefore = targetUrlBefore;
    return this;
  }
});
