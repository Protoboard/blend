"use strict";

/**
 * Maintains a lookup of `Selectable` children by their ownValue property.
 * @mixin $ui.SelectableHost
 * @augments $ui.Inputable
 */
$ui.SelectableHost = $oop.getClass('$ui.SelectableHost')
.expect($oop.getClass('$ui.Inputable'))
.define(/** @lends $ui.SelectableHost# */{
  /**
   * Associates ownValue's of Selectable child widgets with child widgets.
   * @member {Object} $ui.SelectableHost#selectablesByOwnValue
   */

  /** @ignore */
  defaults: function () {
    // todo Initialize based on childNodes?
    this.selectablesByOwnValue = this.selectablesByOwnValue || {};
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
    var childNodeBefore = removeChildNode.shared.childNodeBefore;
    if (childNodeBefore) {
      delete this.selectablesByOwnValue[childNodeBefore.ownValue];
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
});
