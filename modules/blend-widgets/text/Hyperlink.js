"use strict";

/**
 * @function $widgets.Hyperlink.create
 * @returns {$widgets.Hyperlink}
 */

/**
 * @class $widgets.Hyperlink
 */
$widgets.Hyperlink = $oop.getClass('$widgets.Hyperlink')
.blend($oop.getClass('$widgets.Text'))
.define(/** @lends $widgets.Hyperlink# */{
  /**
   * @member {string} $widgets.Hyperlink#targetUrl
   */

  /**
   * @param {string} targetUrl
   * @returns {$widgets.Hyperlink}
   */
  setTargetUrl: function setTargetUrl(targetUrl) {
    var targetUrlBefore = this.targetUrl;
    this.targetUrl = targetUrl;
    setTargetUrl.shared.targetUrlBefore = targetUrlBefore;
    return this;
  }
});
