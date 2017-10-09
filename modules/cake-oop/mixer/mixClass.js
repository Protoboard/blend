"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * Classes (declared or ad-hoc) indexed by the serialized class IDs of the
   * mixins they're composed of.
   * @type {object}
   */
  classesByMixinId: {},

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
