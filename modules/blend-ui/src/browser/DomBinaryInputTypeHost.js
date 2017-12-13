"use strict";

/**
 * @mixin $ui.DomBinaryInputTypeHost
 * @extends $ui.DomInputEventBound
 * @extends $ui.BinaryInputTypeHost
 */
$ui.DomBinaryInputTypeHost = $oop.createClass('$ui.DomBinaryInputTypeHost')
.blend($ui.DomInputEventBound)
.blend($ui.BinaryInputTypeHost)
.define(/** @lends $ui.DomBinaryInputTypeHost# */{
  /**
   * @protected
   */
  _syncElementChecked: function () {
    var element = this.getElement();
    if (element) {
      element.checked = this.isSelected();
    }
  },

  /**
   * @protected
   */
  _syncToElementChecked: function () {
    var element = this.getElement();
    if (element) {
      if (element.checked) {
        this.select();
      } else {
        this.deselect();
      }
    }
  },

  /**
   * @returns {$ui.DomBinaryInputTypeHost}
   */
  select: function select() {
    var selectedStateBefore = select.shared.selectedStateBefore;
    if (!selectedStateBefore) {
      this._syncElementChecked();
    }
    return this;
  },

  /**
   * @returns {$ui.DomBinaryInputTypeHost}
   */
  deselect: function select() {
    var selectedStateBefore = select.shared.selectedStateBefore;
    if (selectedStateBefore) {
      this._syncElementChecked();
    }
    return this;
  },

  /** @ignore */
  onRender: function () {
    this._syncElementChecked();
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onElementInput: function (event) {
    this._syncToElementChecked();
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onElementChange: function (event) {
    this._syncToElementChecked();
  }
})
.build();

$ui.BinaryInputTypeHost
.forwardBlend($ui.DomBinaryInputTypeHost, $utils.isBrowser);
