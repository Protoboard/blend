"use strict";

/**
 * @class $oop.ClassMixer
 */
$oop.ClassMixer = $oop.createObject(Object.prototype, /** @lends $oop.ClassMixer */{
  /**
   * @param {Array.<$oop.Class>} Mixins
   * @returns {Array.<$oop.Class>}
   * @private
   */
  _findMatchingClasses: function (Mixins) {
    var classByClassId = $oop.classByClassId,
        classIds = Object.keys(classByClassId);

    return classIds
    // todo We could avoid this map with a global `classes` array.
    .map($oop.getClass)
    .filter(function (Class) {
      return Mixins.every(function (Mixin) {
        return Mixin.mixedBy(Class);
      });
    });
  },

  /**
   * Creates or retrieves an ad-hoc class that is made up of the specified
   * mixins.
   * @param {...$oop.Class} Mixin
   * @returns {$oop.Class}
   */
  mixClass: function (Mixin) {
    var mixins = slice.call(arguments),
        MixerIndex = $oop.MixerIndex,
        Class = MixerIndex.getClassForMixins(mixins);

    if (!Class) {
      // finding an existing matching class
      this._findMatchingClasses(mixins)
      .forEach(function (Class) {
        // adding Class for this specific combination of mixins
        MixerIndex.setClassForMixins(Class, mixins);
      });
      Class = MixerIndex.getClassForMixins(mixins);
    }

    if (!Class) {
      // creating ad-hoc class and adding mixins
      Class = $oop.getClass($oop.generateUuid());
      mixins.forEach(function (Mixin) {
        Class.mix(Mixin);
      });
      MixerIndex.setClass(Class);
    }

    return Class;
  }
});
