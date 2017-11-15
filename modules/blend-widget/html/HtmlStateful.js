"use strict";

/**
 * @mixin $widget.HtmlStateful
 * @extends $widget.Stateful
 * @extends $widget.HtmlNode
 */
$widget.HtmlStateful = $oop.getClass('$widget.HtmlStateful')
.blend($oop.getClass('$widget.Stateful'))
.blend($oop.getClass('$widget.HtmlNode'))
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

$oop.getClass('$widget.Stateful')
.forwardBlend($widget.HtmlStateful, function () {
  return $widget.isHtml();
});
