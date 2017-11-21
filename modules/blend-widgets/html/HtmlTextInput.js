"use strict";

/**
 * @mixin $widgets.HtmlTextInput
 * @extend $widget.HtmlWidget
 * @extend $widget.DisabledAttributeHost
 * @augments $widgets.TextInput
 */
$widgets.HtmlTextInput = $oop.getClass('$widgets.HtmlTextInput')
.blend($widget.HtmlWidget)
.blend($oop.getClass('$widgets.InputElementHost'))
.blend($oop.getClass('$widgets.DisabledAttributeHost'))
.blend($oop.getClass('$widgets.ValueAttributeHost'))
.expect($oop.getClass('$widgets.TextInput'))
.define(/** @lends $widgets.HtmlTextInput# */{
  /** @ignore */
  defaults: function () {
    this.inputType = this.inputType || 'text';
  }
});

$oop.getClass('$widgets.TextInput')
.forwardBlend($widgets.HtmlTextInput, $widget.isHtml);
