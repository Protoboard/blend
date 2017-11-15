"use strict";

/**
 * @mixin $widgets.DomClickable
 * @extends $widgets.Clickable
 * @augments $widget.DomWidget
 */
$widgets.DomClickable = $oop.getClass('$widgets.DomClickable')
.blend($oop.getClass('$widgets.Clickable'))
.expect($widget.DomWidget)
.define(/** @lends $widgets.DomClickable# */{
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

$oop.getClass('$widgets.Clickable')
.forwardBlend($widgets.DomClickable, function () {
  return $utils.isBrowser();
});
