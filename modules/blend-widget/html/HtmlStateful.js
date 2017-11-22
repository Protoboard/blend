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
        (stateValueBefore === undefined || stateValueBefore === false)) {
      // state changed from false or undefined to true
      this.addCssClass(stateName);
    } else if (stateValue === false &&
        (stateValueBefore === true || stateValueBefore === undefined)) {
      // state changed from true or undefined to false
      this.removeCssClass(stateName);
    } else if (stateValue !== stateValueBefore) {
      // state changed between arbitrary values
      // todo Use Attributes instead of CSS class?
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
.forwardBlend($widget.HtmlStateful, $widget.isHtml);
