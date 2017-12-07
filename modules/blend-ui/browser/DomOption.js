"use strict";

/**
 * @mixin $ui.DomOption
 * @extends $ui.HtmlOption
 * @extends $ui.DomInputEventBound
 */
$ui.DomOption = $oop.createClass('$ui.DomOption')
.blend($ui.HtmlOption)
.blend($ui.DomInputEventBound)
.define(/** @lends $ui.DomOption# */{
  /**
   * @protected
   */
  _syncElementSelected: function () {
    var element = this.getElement();
    if (element) {
      element.selected = this.isSelected();
    }
  },

  /**
   * @protected
   */
  _syncToElementSelected: function () {
    var element = this.getElement();
    if (element) {
      if (element.selected) {
        this.select();
      } else {
        this.deselect();
      }
    }
  },

  /**
   * @returns {$ui.DomOption}
   */
  select: function select() {
    var selectedStateBefore = select.shared.selectedStateBefore;
    if (!selectedStateBefore) {
      this._syncElementSelected();
    }
    return this;
  },

  /**
   * @returns {$ui.DomOption}
   */
  deselect: function deselect() {
    var selectedStateBefore = deselect.shared.selectedStateBefore;
    if (selectedStateBefore) {
      this._syncElementSelected();
    }
    return this;
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

$ui.HtmlOption
.forwardBlend($ui.DomOption, $utils.isBrowser);
