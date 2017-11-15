"use strict";

/**
 * @mixin $widgets.DomClickable
 * @extends $widget.DomWidget
 * @extends $widgets.Clickable
 */
$widgets.DomClickable = $oop.getClass('$widgets.DomClickable')
.blend($widget.DomWidget)
.blend($oop.getClass('$widgets.Clickable'))
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
