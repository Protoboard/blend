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
    if (stateValue === true &&
        (stateValueBefore === undefined || stateValueBefore === true)) {
      // state changed from false or undefined to true
      this.addCssClass(stateName);
    } else if (stateValue === false &&
        (stateValueBefore === true || stateValueBefore === undefined)) {
      // state changed from true or undefined to false
      this.removeCssClass(stateName);
    } else {
      // state changed between arbitrary values
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
  return this.mixes($widget.Stateful) && $widget.isHtml();
});
