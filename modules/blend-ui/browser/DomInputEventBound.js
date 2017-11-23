"use strict";

/**
 * Binds host widget to 'input' and 'change' DOM events. Usually mixed to
 * DOM manifestations of input widgets.
 * @mixin $ui.DomInputEventBound
 * @extends $widget.DomWidget
 */
$ui.DomInputEventBound = $oop.getClass('$ui.DomInputEventBound')
.blend($widget.DomWidget)
.define(/** @lends $ui.DomInputEventBound# */{
  /** @ignore */
  onRender: function () {
    var element = this.getElement();
    element.addEventListener('input', this.onElementInput);
    element.addEventListener('change', this.onElementChange);
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onElementInput: function (event) {
    var eventTrail = $event.EventTrail.create(),
        wrapperEvent = $event.WrapperEvent.fromEventName('inputWrapper')
        .wrap(event);

    eventTrail.push(wrapperEvent);
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onElementChange: function (event) {
    var eventTrail = $event.EventTrail.create(),
        wrapperEvent = $event.WrapperEvent.fromEventName('changeWrapper')
        .wrap(event);

    eventTrail.push(wrapperEvent);
  }
});
