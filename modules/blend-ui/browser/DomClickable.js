"use strict";

/**
 * @mixin $ui.DomClickable
 * @extends $ui.Clickable
 * @extends $widget.DomWidget
 */
$ui.DomClickable = $oop.getClass('$ui.DomClickable')
.blend($oop.getClass('$ui.Clickable'))
.blend($widget.DomWidget)
.define(/** @lends $ui.DomClickable# */{
  /** @ignore */
  onRender: function () {
    this.getElement().addEventListener('click', this.onClick);
  },

  /**
   * @param {MouseEvent} event
   * @ignore
   */
  onClick: function (event) {
    var eventTrail = $event.EventTrail.create(),
        wrapperEvent = $event.WrapperEvent.fromEventName('clickWrapper')
        .wrap(event);

    eventTrail.push(wrapperEvent);
    this.click();
  }
});

$oop.getClass('$ui.Clickable')
.forwardBlend($ui.DomClickable, $utils.isBrowser);
