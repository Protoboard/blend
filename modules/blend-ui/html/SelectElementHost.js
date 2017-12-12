"use strict";

/**
 * @mixin $ui.SelectElementHost
 * @extends $widget.HtmlWidget
 * @mixes $ui.DisabledAttributeHost
 */
$ui.SelectElementHost = $oop.createClass('$ui.SelectElementHost')
.blend($widget.HtmlWidget)
.blend($ui.DisabledAttributeHost)
.define(/** @lends $ui.SelectElementHost# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'select';
  }
})
.build();
