"use strict";

/**
 * @mixin $ui.SelectElementHost
 * @extends $widget.HtmlWidget
 * @mixes $ui.DisabledAttributeHost
 * @augments $ui.Inputable
 */
$ui.SelectElementHost = $oop.getClass('$ui.SelectElementHost')
.blend($widget.HtmlWidget)
.blend($oop.getClass('$ui.DisabledAttributeHost'))
.expect($oop.getClass('$ui.Inputable'))
.define(/** @lends $ui.SelectElementHost# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'select';
  }
});
