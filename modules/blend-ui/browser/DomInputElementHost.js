"use strict";

/**
 * @mixin $ui.DomInputElementHost
 * @extends $widget.DomWidget
 * @extends $ui.InputElementHost
 * @todo Merge with ValueAttributeHost?
 */
$ui.DomInputElementHost = $oop.getClass('$ui.DomInputElementHost')
.blend($widget.DomWidget)
.blend($oop.getClass('$ui.InputElementHost'))
.define(/** @lends $ui.DomInputElementHost# */{
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
   * @returns {$ui.DomInputElementHost}
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

$oop.getClass('$ui.InputElementHost')
.forwardBlend($ui.DomInputElementHost, function () {
  return $utils.isBrowser();
});
