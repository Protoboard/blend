"use strict";

/**
 * @mixin $ui.DomApplication
 * @extends $widget.DomWidget
 * @augments $ui.Application
 */
$ui.DomApplication = $oop.createClass('$ui.DomApplication')
.blend($widget.DomWidget)
.expect($ui.Application)
.define(/** @lends $ui.DomApplication# */{
  /** @ignore */
  onAttach: function () {
    if (!this.getElement() && document.body) {
      this.renderInto(document.body);
    }
  },

  /** @ignore */
  onRouteChange: function () {
    if (!this.getElement() && this.isAttached()) {
      this.renderInto(document.body);
    }
  }
})
.build();

$ui.Application
.forwardBlend($ui.DomApplication, $utils.isBrowser);
