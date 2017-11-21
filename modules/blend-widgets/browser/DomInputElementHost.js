"use strict";

/**
 * @mixin $widgets.DomInputElementHost
 * @extends $widget.DomWidget
 * @extends $widgets.InputElementHost
 * @todo Merge with
 */
$widgets.DomInputElementHost = $oop.getClass('$widgets.DomInputElementHost')
.blend($widget.DomWidget)
.blend($oop.getClass('$widgets.InputElementHost'))
.define(/** @lends $widgets.DomInputElementHost# */{
  /**
   * @protected
   */
  _syncElementValue: function () {
    var element = this.getElement();
    element.value = this.inputValue;
  },

  /**
   * @protected
   */
  _syncToElementValue: function () {
    var element = this.getElement();
    this.setInputValue(element.value);
  },

  /**
   * @param {*} inputValue
   * @returns {$widgets.DomInputElementHost}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = setInputValue.shared.inputValueBefore;
    if (inputValue !== inputValueBefore) {
      this._syncElementValue();
    }
    return this;
  },

  /** @ignore */
  onRender: function () {
    this._syncElementValue();

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
    this._syncToElementValue();
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
    this._syncToElementValue();
  }
});

$oop.getClass('$widgets.InputElementHost')
.forwardBlend($widgets.DomInputElementHost, function () {
  return $utils.isBrowser();
});
