"use strict";

/**
 * @mixin $ui.DomValidatable
 * @extends $widget.DomWidget
 * @extends $ui.Validatable
 */
$ui.DomValidatable = $oop.getClass('$ui.DomValidatable')
.blend($widget.DomWidget)
.blend($oop.getClass('$ui.Validatable'))
.define(/** @lends $ui.DomValidatable# */{
  /**
   * @protected
   */
  _syncToElementValidity: function () {
    var element = this.getElement();
    if (element) {
      // no need to handle invalid case
      // as checkValidity will trigger 'invalid' event
      if (element.checkValidity()) {
        this.validateBy('dom');
      }
    }
  },

  /**
   * @param {*} inputValue
   * @returns {$ui.DomValidatable}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = setInputValue.shared.inputValueBefore;
    if (inputValue !== inputValueBefore) {
      this._syncToElementValidity();
    }
    return this;
  },

  /** @ignore */
  onRender: function () {
    this._syncToElementValidity();

    var element = this.getElement();
    element.addEventListener('invalid', this.onElementInvalid);
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onElementInvalid: function (event) {
    var eventTrail = $event.EventTrail.create(),
        wrapperEvent = $event.WrapperEvent.fromEventName('invalidWrapper')
        .wrap(event);

    eventTrail.push(wrapperEvent);
    this.invalidateBy('dom');
  }
});

$oop.getClass('$ui.Validatable')
.forwardBlend($ui.DomValidatable, $utils.isBrowser);
