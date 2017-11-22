"use strict";

/**
 * Binds host widget to 'input' and 'change' DOM events. Usually mixed to
 * DOM manifestations of input widgets.
 * @mixin $ui.DomInputEventBound
 * @extends $widget.DomWidget
 * @augments $ui.Inputable
 */
$ui.DomInputEventBound = $oop.getClass('$ui.DomInputEventBound')
.blend($widget.DomWidget)
.expect($oop.getClass('$ui.Inputable'))
.define(/** @lends $ui.DomInputEventBound# */{
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
