"use strict";

/**
 * @mixin $ui.MultipleChoice
 * @extends $ui.SelectableHost
 * @augments $ui.InputValueHost
 */
$ui.MultipleChoice = $oop.createClass('$ui.MultipleChoice')
.blend($ui.SelectableHost)
.expect($ui.InputValueHost)
.define(/** @lends $ui.MultipleChoice# */{
  /**
   * Stores selected values as a symmetric lookup.
   * @name $ui.MultipleChoice#inputValue
   * @type {Object.<string,string>}
   */

  /** @ignore */
  defaults: function () {
    this.inputValue = this.inputValue || {};
  },

  /**
   * Syncs initial selected state to inputValue.
   * @protected
   */
  _syncSelectableStates: function () {
    $data.Collection.fromData(this.inputValue)
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
        ownValue !== undefined && ownValue === this.inputValue[ownValue]
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
   * @param {Object.<string,string>} inputValue
   * @returns {$ui.MultipleChoice}
   * @todo Necessary? (Harmful to perf?)
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = setInputValue.shared.inputValueBefore,
        inputValuesAdded = $data.StringSet.fromData(inputValue)
        .subtract($data.StringSet.fromData(inputValueBefore)),
        inputValuesRemoved = $data.StringSet.fromData(inputValue)
        .subtractFrom($data.StringSet.fromData(inputValueBefore));

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
   * @todo Move parts to MultiInputable?
   */
  addInputValue: function addInputValue(inputValue) {
    var inputValueBefore = this.inputValue[inputValue],
        selectable = this.getSelectableByOwnValue(inputValue);

    if (inputValue !== inputValueBefore) {
      this.inputValue[inputValue] = inputValue;

      if (selectable) {
        selectable.select();
      }
    }

    addInputValue.shared.inputValueBefore = inputValueBefore;
    return this;
  },

  /**
   * @param {*} inputValue
   * @return {$ui.MultipleChoice}
   * @todo Move parts to MultiInputable?
   */
  removeInputValue: function removeInputValue(inputValue) {
    var inputValueBefore = this.inputValue[inputValue],
        selectable = this.getSelectableByOwnValue(inputValue);

    if (inputValue === inputValueBefore) {
      delete this.inputValue[inputValue];

      if (selectable) {
        // might not be reachable in browser
        selectable.deselect();
      }
    }

    removeInputValue.shared.inputValueBefore = inputValueBefore;
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
      .removeInputValue(event.ownValueBefore)
      .addInputValue(event.ownValueAfter);
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
        this.addInputValue(selectable.ownValue);
      } else {
        this.removeInputValue(selectable.ownValue);
      }
    }
  }
})
.build();
