"use strict";

/**
 * @function $widgets.DataText.create
 * @param {Object} properties
 * @param {$entity.ValueKey} properties.textKey
 * @returns {$widgets.DataText}
 */

/**
 * @class $widgets.DataText
 * @extends $widgets.Text
 * @todo Use textEntity as textString?
 */
$widgets.DataText = $oop.getClass('$widgets.DataText')
.blend($oop.getClass('$widgets.Text'))
.define(/** @lends $widgets.DataText# */{
  /**
   * @member {$entity.ValueKey|$entity.ItemKey} $widgets.DataText#textKey
   */

  /**
   * @memberOf $widgets.DataText
   * @param {$entity.ValueKey} textKey
   * @param {Object} [properties]
   */
  fromTextKey: function (textKey, properties) {
    return this.create({
      textKey: textKey
    }, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOf(
        this.textKey, $entity.ValueKey, "Invalid textKey");
  },

  /** @ignore */
  onAttach: function () {
    this.syncToTextEntity();
    this.on(
        $entity.EVENT_ENTITY_CHANGE,
        this.textKey.toEntity(),
        this.onTextEntityChange);
  },

  /**
   * @param {$entity.ValueKey} textKey
   * @returns {$widgets.DataText}
   */
  setTextKey: function (textKey) {
    var textKeyBefore = this.textKey;
    if (!textKeyBefore.equals(textKey)) {
      this.off(
          $entity.EVENT_ENTITY_CHANGE,
          textKeyBefore.toEntity());

      this.textKey = textKey;

      this.syncToTextEntity();
      this.on(
          $entity.EVENT_ENTITY_CHANGE,
          textKey.toEntity(),
          this.onTextEntityChange);
    }
    return this;
  },

  /**
   */
  syncToTextEntity: function () {
    this.setTextString(this.textKey.toEntity().getNode());
  },

  /** @ignore */
  onTextEntityChange: function () {
    this.syncToTextEntity();
  }
});
