"use strict";

/**
 * @mixin $ui.SelectElementHost
 * @extends $widget.HtmlWidget
 * @mixes $ui.DisabledAttributeHost
 * @augments $ui.InputValueHost
 */
$ui.SelectElementHost = $oop.createClass('$ui.SelectElementHost')
.blend($widget.HtmlWidget)
.blend($ui.DisabledAttributeHost)
.expect($ui.InputValueHost)
.define(/** @lends $ui.SelectElementHost# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'select';
  }
})
.build();
