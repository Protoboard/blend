"use strict";

/**
 * @mixin $ui.MultipleChoice
 * @extends $ui.SelectableHost
 * @augments $ui.InputValuesHost
 */
$ui.MultipleChoice = $oop.createClass('$ui.MultipleChoice')
.blend($ui.SelectableHost)
.expect($ui.InputValuesHost)
.define(/** @lends $ui.MultipleChoice# */{
  /**
   * Syncs initial selected state to inputValues.
   * @protected
   */
  _syncSelectableStates: function () {
    $data.Collection.fromData(this.inputValues)
    .toStringDictionary()
    .join($data.Collection.fromData(this.selectablesByOwnValue).toDictionary())
    .callOnEachValue('select');
  },

  /**
   * @param {$ui.Selectable} node
   * @returns {$ui.MultipleChoice}
   */
  addChildNode: function addChildNode(node) {
    var childNodeBefore = addChildNode.shared.childNodeBefore,
        ownValue = node.ownValue;
    if (node !== childNodeBefore &&
        ownValue !== undefined && ownValue === this.inputValues[ownValue]
    ) {
      node.select();
    }
    return this;
  },

  /**
   * @param {string} nodeName
   * @returns {$ui.MultipleChoice}
   */
  removeChildNode: function removeChildNode(nodeName) {
    var childNodeBefore = removeChildNode.shared.childNodeBefore;
    if (childNodeBefore && childNodeBefore.isSelected()) {
      childNodeBefore.deselect();
    }
    return this;
  },

  /**
   * @param {Object.<string,string>} inputValues
   * @returns {$ui.MultipleChoice}
   * @todo Necessary? (Harmful to perf?)
   */
  setInputValues: function setInputValues(inputValues) {
    var inputValuesBefore = setInputValues.shared.inputValuesBefore,
        inputValuesAdded = $data.StringSet.fromData(inputValues)
        .subtract($data.StringSet.fromData(inputValuesBefore)),
        inputValuesRemoved = $data.StringSet.fromData(inputValues)
        .subtractFrom($data.StringSet.fromData(inputValuesBefore));

    if (inputValuesRemoved.getItemCount()) {
      inputValuesRemoved.toCollection().toStringDictionary()
      .join($data.Collection.fromData(this.selectablesByOwnValue)
      .toDictionary())
      .callOnEachValue('deselect');
    }

    if (inputValuesAdded.getItemCount()) {
      inputValuesAdded.toCollection().toStringDictionary()
      .join($data.Collection.fromData(this.selectablesByOwnValue)
      .toDictionary())
      .callOnEachValue('select');
    }

    return this;
  },

  /**
   * @param {*} inputValue
   * @return {$ui.MultipleChoice}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = setInputValue.shared.inputValueBefore,
        selectable = this.getSelectableByOwnValue(inputValue);
    if (inputValue !== inputValueBefore && selectable) {
      selectable.select();
    }
    return this;
  },

  /**
   * @param {*} inputValue
   * @return {$ui.MultipleChoice}
   */
  deleteInputValue: function deleteInputValue(inputValue) {
    var inputValueBefore = deleteInputValue.shared.inputValueBefore,
        selectable = this.getSelectableByOwnValue(inputValue);
    if (inputValue === inputValueBefore && selectable) {
      selectable.deselect();
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
      this
      .deleteInputValue(event.ownValueBefore)
      .setInputValue(event.ownValueAfter);
    }
  },

  /**
   * @param {$widget.StateChangeEvent} event
   * @ignore
   */
  onStateChange: function (event) {
    var stateName = event.stateName,
        selectable = event.sender;

    if (stateName === $ui.STATE_NAME_SELECTED) {
      if (selectable.isSelected()) {
        this.setInputValue(selectable.ownValue);
      } else {
        this.deleteInputValue(selectable.ownValue);
      }
    }
  }
})
.build();
