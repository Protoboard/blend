"use strict";

/**
 * @mixin $ui.HtmlOption
 * @extends $ui.HtmlText
 * @mixes $ui.DisabledAttributeHost
 * @augments $ui.Option
 */
$ui.HtmlOption = $oop.getClass('$ui.HtmlOption')
.blend($oop.getClass('$ui.HtmlText'))
.blend($oop.getClass('$ui.DisabledAttributeHost'))
.expect($oop.getClass('$ui.Option'))
.define(/** @lends $ui.HtmlOption# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'option';
  },

  /** @ignore */
  init: function () {
    this._syncValueAttribute();
    this._syncSelectedAttribute();
  },

  /**
   * @protected
   */
  _syncValueAttribute: function () {
    var ownValue = this.ownValue;
    if (ownValue !== undefined) {
      this.setAttribute('value', ownValue);
    } else {
      this.deleteAttribute('value');
    }
  },

  /**
   * @protected
   */
  _syncSelectedAttribute: function () {
    if (this.isSelected()) {
      this.setAttribute('selected', 'selected');
    } else {
      this.deleteAttribute('selected');
    }
  },

  /**
   * @param {*} ownValue
   * @returns {$ui.HtmlOption}
   */
  setOwnValue: function setOwnValue(ownValue) {
    var ownValueBefore = setOwnValue.shared.ownValueBefore;
    if (ownValue !== ownValueBefore) {
      this._syncValueAttribute();
    }
    return this;
  },

  /**
   * @returns {$ui.HtmlOption}
   */
  select: function select() {
    var selectedStateBefore = select.shared.selectedStateBefore;
    if (!selectedStateBefore) {
      this._syncSelectedAttribute();
    }
    return this;
  },

  /**
   * @returns {$ui.HtmlOption}
   */
  deselect: function deselect() {
    var selectedStateBefore = deselect.shared.selectedStateBefore;
    if (selectedStateBefore) {
      this._syncSelectedAttribute();
    }
    return this;
  }
});

$oop.getClass('$ui.Option')
.forwardBlend($ui.HtmlOption, $widget.isHtml);
