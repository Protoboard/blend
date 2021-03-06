"use strict";

/**
 * @mixin $ui.DomValidatable
 * @extends $widget.DomWidget
 * @extends $ui.Validatable
 */
$ui.DomValidatable = $oop.createClass('$ui.DomValidatable')
.blend($widget.DomWidget)
.blend($ui.Validatable)
.define(/** @lends $ui.DomValidatable# */{
  /**
   * @protected
   */
  _syncToElementValidity: function () {
    var element = this.getElement();
    if (element) {
      if (element.checkValidity()) {
        this.validateBy('dom');
      } else {
        this.invalidateBy('dom');
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

    // invalidating directly as syncing would lead to infinite 'invalid'
    // event loop
    this.invalidateBy('dom');
  }
})
.build();

$ui.Validatable
.forwardBlend($ui.DomValidatable, $utils.isBrowser);
