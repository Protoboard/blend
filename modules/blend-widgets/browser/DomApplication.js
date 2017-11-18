"use strict";

/**
 * @mixin $widgets.DomApplication
 * @extends $widget.DomWidget
 * @augments $widgets.Application
 */
$widgets.DomApplication = $oop.getClass('$widgets.DomApplication')
.blend($widget.DomWidget)
.expect($oop.getClass('$widgets.Application'))
.define(/** @lends $widgets.DomApplication# */{
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

$oop.getClass('$widgets.Application')
.forwardBlend($widgets.DomApplication, function () {
  return $utils.isBrowser();
});
