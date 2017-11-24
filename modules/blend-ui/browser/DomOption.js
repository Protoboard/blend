"use strict";

/**
 * @mixin $ui.DomOption
 * @extends $ui.HtmlOption
 * @extends $ui.DomInputEventBound
 */
$ui.DomOption = $oop.getClass('$ui.DomOption')
.blend($oop.getClass('$ui.HtmlOption'))
.blend($oop.getClass('$ui.DomInputEventBound'))
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
});

$oop.getClass('$ui.HtmlOption')
.forwardBlend($ui.DomOption, $utils.isBrowser);
