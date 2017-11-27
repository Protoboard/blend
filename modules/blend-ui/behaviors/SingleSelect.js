"use strict";

/**
 * @mixin $ui.SingleSelect
 * @extends $ui.SelectableHost
 * @augments $ui.Inputable
 */
$ui.SingleSelect = $oop.getClass('$ui.SingleSelect')
.blend($oop.getClass('$ui.SelectableHost'))
.expect($oop.getClass('$ui.Inputable'))
.define(/** @lends $ui.SingleSelect# */{
  /**
   * @protected
   */
  _syncSelectableStates: function () {
    var activeSelectable = this.getSelectableByOwnValue(this.inputValue);
    if (activeSelectable) {
      activeSelectable.select();
    }
  },

  /**
   * @param {$ui.Selectable} node
   * @returns {$ui.SingleSelect}
   */
  addChildNode: function addChildNode(node) {
    var childNodeBefore = addChildNode.shared.childNodeBefore;
    if (node !== childNodeBefore && node.ownValue === this.inputValue) {
      node.select();
    }
    return this;
  },

  /**
   * @param {string} nodeName
   * @returns {$ui.SingleSelect}
   */
  removeChildNode: function removeChildNode(nodeName) {
    var childNodeBefore = removeChildNode.shared.childNodeBefore;
    if (childNodeBefore && childNodeBefore.isSelected()) {
      childNodeBefore.deselect();
    }
    return this;
  },

  /**
   * @param {*} inputValue
   * @returns {$ui.SingleSelect}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = setInputValue.shared.inputValueBefore,
        activeSelectableBefore,
        activeSelectableAfter;

    if (inputValue !== inputValueBefore) {
      activeSelectableBefore = this.getSelectableByOwnValue(inputValueBefore);
      activeSelectableAfter = this.getSelectableByOwnValue(inputValue);

      if (activeSelectableBefore) {
        activeSelectableBefore.deselect();
      }
      if (activeSelectableAfter) {
        activeSelectableAfter.select();
      }
    }

    return this;
  },

  /** @ignore */
  onAttach: function () {
    this._syncSelectableStates();
    this.on($widget.EVENT_STATE_CHANGE, this, this.onStateChange);
  },

  /**
   * @param {$ui.SelectableOwnValueChangeEvent} event
   * @ignore
   */
  onSelectableOwnValueChange: function (event) {
    var selectable = event.sender;
    if (selectable.isSelected()) {
      this.setInputValue(selectable.ownValue);
    }
  },

  /**
   * @param {$widget.StateChangeEvent} event
   * @ignore
   */
  onStateChange: function (event) {
    var stateName = event.stateName,
        selectable = event.sender;

    if (stateName === $ui.STATE_NAME_SELECTED &&
        selectable.isSelected()
    ) {
      this.setInputValue(selectable.ownValue);
    }
  }
});