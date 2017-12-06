"use strict";

/**
 * @function $ui.Hyperlink.create
 * @returns {$ui.Hyperlink}
 */

/**
 * @class $ui.Hyperlink
 */
$ui.Hyperlink = $oop.createClass('$ui.Hyperlink')
.blend($ui.Text)
.define(/** @lends $ui.Hyperlink# */{
  /**
   * @member {string|$utils.Stringifiable} $ui.Hyperlink#targetUrl
   */

  /**
   * @param {string|$utils.Stringifiable} targetUrl
   * @returns {$ui.Hyperlink}
   */
  setTargetUrl: function setTargetUrl(targetUrl) {
    var targetUrlBefore = this.targetUrl;
    this.targetUrl = targetUrl;
    setTargetUrl.shared.targetUrlBefore = targetUrlBefore;
    return this;
  }
})
.build();
