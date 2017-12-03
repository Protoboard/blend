"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * Creates or retrieves an ad-hoc class that is made up of the specified
   * mixins.
   * @param {Array.<$oop.Class>} mixins
   * @returns {$oop.Class}
   * @deprecated
   */
  blendClass: function (mixins) {
    return $oop.ClassBlender.blendClass(mixins);
  },

  /**
   * Creates or retrieves an ad-hoc class that is made up of the specified
   * mixins.
   * @param {Array.<$oop.Klass>} mixins
   * @returns {$oop.Klass}
   * @todo Rename to blendClass ASAP.
   */
  mixClass: function (mixins) {
    return $oop.ClassMixer.mixClass(mixins);
  }
});
