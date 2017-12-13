"use strict";

/**
 * @mixin $ui.HtmlCheckbox
 * @extends $ui.BinaryInputTypeHost
 * @augments $ui.Checkbox
 */
$ui.HtmlCheckbox = $oop.createClass('$ui.HtmlCheckbox')
.blend($ui.BinaryInputTypeHost)
.expect($ui.Checkbox)
.define(/** @lends $ui.HtmlCheckbox# */{
  /** @ignore */
  defaults: function () {
    this.inputType = this.inputType || 'checkbox';
  }
})
.build();

$ui.Checkbox
.forwardBlend($ui.HtmlCheckbox, $widget.isHtml);