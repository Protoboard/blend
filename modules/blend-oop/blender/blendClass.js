"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
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
