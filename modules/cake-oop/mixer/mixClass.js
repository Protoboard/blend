"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * Creates or retrieves an ad-hoc class that is made up of the specified
   * mixins.
   * @param {...$oop.Class} Mixin
   * @returns {$oop.Class}
   */
  mixClass: function (Mixin) {
    return $oop.ClassMixer.mixClass.apply($oop.ClassMixer, arguments);
  }
});
