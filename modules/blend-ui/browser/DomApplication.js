"use strict";

/**
 * @mixin $ui.DomApplication
 * @extends $widget.DomWidget
 * @augments $ui.Application
 */
$ui.DomApplication = $oop.getClass('$ui.DomApplication')
.blend($widget.DomWidget)
.expect($oop.getClass('$ui.Application'))
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
});

$oop.getClass('$ui.Application')
.forwardBlend($ui.DomApplication, function () {
  return $utils.isBrowser();
});
