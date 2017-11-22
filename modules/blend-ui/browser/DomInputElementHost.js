"use strict";

/**
 * @mixin $ui.DomInputElementHost
 * @extends $widget.DomWidget
 * @extends $ui.InputElementHost
 */
$ui.DomInputElementHost = $oop.getClass('$ui.DomInputElementHost')
.blend($widget.DomWidget)
.blend($oop.getClass('$ui.InputElementHost'))
.define(/** @lends $ui.DomInputElementHost# */{
  /** @ignore */
  onRender: function () {
    var element = this.getElement();
    element.addEventListener('input', this.onInput);
    element.addEventListener('change', this.onChange);
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onInput: function (event) {
    var eventTrail = $event.EventTrail.create(),
        wrapperEvent = $event.WrapperEvent.fromEventName('inputWrapper')
        .wrap(event);

    eventTrail.push(wrapperEvent);
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onChange: function (event) {
    var eventTrail = $event.EventTrail.create(),
        wrapperEvent = $event.WrapperEvent.fromEventName('changeWrapper')
        .wrap(event);

    eventTrail.push(wrapperEvent);
  }
});

$oop.getClass('$ui.InputElementHost')
.forwardBlend($ui.DomInputElementHost, function () {
  return $utils.isBrowser();
});
