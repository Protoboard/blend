"use strict";

/**
 * Maintains a lookup of `Selectable` children by their ownValue property.
 * @mixin $ui.SelectableHost
 * @augments $ui.InputValueHost
 */
$ui.SelectableHost = $oop.createClass('$ui.SelectableHost')
.expect($ui.InputValueHost)
.define(/** @lends $ui.SelectableHost# */{
  /**
   * Associates ownValue's of Selectable child widgets with child widgets.
   * @member {Object} $ui.SelectableHost#selectablesByOwnValue
   */

  /** @ignore */
  defaults: function () {
    this.selectablesByOwnValue = this.selectablesByOwnValue || {};
  },

  /**
   * @protected
   */
  _syncToOwnValues: function () {
    var selectablesByOwnValue = this.selectablesByOwnValue;
    this.childNodes
    .filter(function (selectable) {
      return selectable.ownValue !== undefined;
    })
    .forEachItem(function (selectable) {
      selectablesByOwnValue[selectable.ownValue] = selectable;
    });
  },

  /**
   * @param {$ui.Selectable} node
   * @returns {$ui.SelectableHost}
   */
  addChildNode: function addChildNode(node) {
    var childNodeBefore = addChildNode.shared.childNodeBefore,
        selectablesByOwnValue = this.selectablesByOwnValue,
        ownValueBefore = childNodeBefore && childNodeBefore.ownValue,
        ownValueAfter = node.ownValue;

    if (node !== childNodeBefore) {
      if (childNodeBefore) {
        // replaced child node of same nodeName
        delete selectablesByOwnValue[ownValueBefore];
      }
      if (ownValueAfter !== undefined) {
        selectablesByOwnValue[ownValueAfter] = node;
      }
    }

    return this;
  },

  /**
   * @param {string} nodeName
   * @returns {$ui.SelectableHost}
   */
  removeChildNode: function removeChildNode(nodeName) {
    var childNodeBefore = removeChildNode.shared.childNodeBefore,
        ownValue = childNodeBefore && childNodeBefore.ownValue;
    if (childNodeBefore && ownValue !== undefined) {
      delete this.selectablesByOwnValue[ownValue];
    }
    return this;
  },

  /**
   * @param {*} ownValue
   * @returns {$ui.Selectable}
   */
  getSelectableByOwnValue: function (ownValue) {
    return this.selectablesByOwnValue[ownValue];
  },

  /** @ignore */
  onAttach: function () {
    this._syncToOwnValues();
    this.on($ui.EVENT_SELECTABLE_OWN_VALUE_CHANGE, this, this.onSelectableOwnValueChange);
  },

  /**
   * @param {$ui.SelectableOwnValueChangeEvent} event
   * @ignore
   */
  onSelectableOwnValueChange: function (event) {
    var selectablesByOwnValue = this.selectablesByOwnValue,
        selectable = event.sender;

    delete selectablesByOwnValue[event.ownValueBefore];
    selectablesByOwnValue[event.ownValueAfter] = selectable;
  }
})
.build();
