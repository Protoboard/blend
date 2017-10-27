"use strict";

/**
 * @mixin $widget.HtmlStateful
 * @augments $widget.HtmlNode
 * @augments $widget.Stateful
 */
$widget.HtmlStateful = $oop.getClass('$widget.HtmlStateful')
.expect($oop.getClass('$widget.HtmlNode'))
.expect($oop.getClass('$widget.Stateful'))
.define(/** @lends $widget.HtmlStateful# */{
  /**
   * @param {string} stateName
   * @param {*} stateValue
   * @returns {$widget.HtmlStateful}
   */
  setStateValue: function setStateValue(stateName, stateValue) {
    var stateValueBefore = setStateValue.shared.stateValueBefore;
    if (stateValue === true && !stateValueBefore) {
      this.addCssClass(stateName);
    } else if (stateValueBefore === true && !stateValue) {
      this.removeCssClass(stateName);
    } else {
      if (stateValueBefore !== undefined) {
        this.removeCssClass(stateName + '-' + stateValueBefore);
      }
      if (stateValue !== undefined) {
        this.addCssClass(stateName + '-' + stateValue);
      }
    }
    return this;
  }
});

$oop.getClass('$widget.Node')
.forwardBlend($widget.HtmlStateful, function () {
  return this.mixes($widget.Stateful) && $widget.isBrowser();
});
