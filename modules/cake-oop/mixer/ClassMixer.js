"use strict";

/**
 * @class $oop.ClassMixer
 */
$oop.ClassMixer = $oop.createObject(Object.prototype, /** @lends $oop.ClassMixer */{
  /**
   * @param {Array.<$oop.Class>} Mixins
   * @returns {$oop.Class}
   * @private
   */
  _findFirstMatchingClass: function (Mixins) {
    var classByClassId = $oop.classByClassId,
        classIds = Object.keys(classByClassId);

    return classIds
    // todo We could avoid this map with a global `classes` array.
    .map($oop.getClass)
    .filter(function (Class) {
      return Mixins.every(function (Mixin) {
        return Mixin.mixedBy(Class);
      });
    })[0];
  },

  /**
   * Creates or retrieves an ad-hoc class that is made up of the specified
   * mixins.
   * @param {...$oop.Class} Mixin
   * @returns {$oop.Class}
   */
  mixClass: function (Mixin) {
    var mixins = slice.call(arguments),
        ClassByMixinsIndex = $oop.ClassByMixinsIndex,
        Class = ClassByMixinsIndex.getClassForMixins(mixins);

    if (!Class) {
      // finding an existing matching class
      Class = this._findFirstMatchingClass(mixins);
      if (Class) {
        ClassByMixinsIndex.addClassForMixins(Class, mixins);
      }
    }

    if (!Class) {
      // creating ad-hoc class and adding mixins
      Class = $oop.getClass($oop.generateUuid());
      mixins.forEach(function (Mixin) {
        Class.mix(Mixin);
      });
      ClassByMixinsIndex.addClass(Class);
    }

    return Class;
  }
});
