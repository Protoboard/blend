"use strict";

/**
 * Manifests "disabled" state in "disabled" HTML attribute.
 * @mixin $widgets.NameAttributeHost
 * @extend $widget.HtmlWidget
 * @augments $widgets.Disableable
 */
$widgets.NameAttributeHost = $oop.getClass('$widgets.NameAttributeHost')
.blend($widget.HtmlWidget)
.expect($oop.getClass('$widgets.Disableable'))
.define(/** @lends $widgets.NameAttributeHost# */{
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
   * @returns {$widgets.NameAttributeHost}
   */
  setNodeName: function setNodeName(nodeName) {
    var nodeNameBefore = setNodeName.shared.nodeNameBefore;
    if (nodeName !== nodeNameBefore) {
      this._syncNameAttribute();
    }
    return this;
  }
});

