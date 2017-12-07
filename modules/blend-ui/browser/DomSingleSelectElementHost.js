"use strict";

/**
 * @mixin $ui.DomSingleSelectElementHost
 * @extends $ui.SingleSelectElementHost
 * @mixes $ui.DomInputEventBound
 */
$ui.DomSingleSelectElementHost = $oop.createClass('$ui.DomSingleSelectElementHost')
.blend($ui.SingleSelectElementHost)
.blend($ui.DomInputEventBound)
.define(/** @lends $ui.DomSingleSelectElementHost# */{
  /**
   * @protected
   */
  _syncToElementSelected: function () {
    var element = this.getElement(),
        selectedOption = element && element.selectedOptions[0];
    if (selectedOption) {
      this.setInputValue(selectedOption.value);
    }
  },

  /** @ignore */
  onRender: function () {
    this._syncToElementSelected();
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onElementInput: function (event) {
    this._syncToElementSelected();
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onElementChange: function (event) {
    this._syncToElementSelected();
  }
})
.build();

$ui.SingleSelectElementHost
.forwardBlend($ui.DomSingleSelectElementHost, $utils.isBrowser);
