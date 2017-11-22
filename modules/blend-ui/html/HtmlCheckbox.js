"use strict";

/**
 * @mixin $ui.HtmlCheckbox
 * @extends $ui.BinaryInputTypeHost
 * @augments $ui.Checkbox
 */
$ui.HtmlCheckbox = $oop.getClass('$ui.HtmlCheckbox')
.blend($oop.getClass('$ui.BinaryInputTypeHost'))
.expect($oop.getClass('$ui.Checkbox'))
.define(/** @lends $ui.HtmlCheckbox# */{
  /** @ignore */
  defaults: function () {
    this.inputType = this.inputType || 'checkbox';
  }
});

$oop.getClass('$ui.Checkbox')
.forwardBlend($ui.HtmlCheckbox, $widget.isHtml);