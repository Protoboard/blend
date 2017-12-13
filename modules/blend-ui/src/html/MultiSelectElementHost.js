"use strict";

/**
 * @mixin $ui.MultiSelectElementHost
 * @extends $ui.SelectElementHost
 */
$ui.MultiSelectElementHost = $oop.createClass('$ui.MultiSelectElementHost')
.blend($ui.SelectElementHost)
.define(/** @lends $ui.MultiSelectElementHost# */{
  /** @ignore */
  init: function () {
    this.setAttribute('multiple', 'multiple');
  }
})
.build();
