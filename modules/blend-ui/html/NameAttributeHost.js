"use strict";

/**
 * Manifests "disabled" state in "disabled" HTML attribute.
 * @mixin $ui.NameAttributeHost
 * @extend $widget.HtmlWidget
 * @augments $ui.Disableable
 */
$ui.NameAttributeHost = $oop.getClass('$ui.NameAttributeHost')
.blend($widget.HtmlWidget)
.expect($oop.getClass('$ui.Disableable'))
.define(/** @lends $ui.NameAttributeHost# */{
  /** @ignore */
  init: function () {
    this._syncNameAttribute();
  },

  /**
   * @protected
   */
  _syncNameAttribute: function () {
    this.setAttribute('name', this.nodeName);
  },

  /**
   * @param {string} nodeName
   * @returns {$ui.NameAttributeHost}
   */
  setNodeName: function setNodeName(nodeName) {
    var nodeNameBefore = setNodeName.shared.nodeNameBefore;
    if (nodeName !== nodeNameBefore) {
      this._syncNameAttribute();
    }
    return this;
  }
});

