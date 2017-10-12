"use strict";

/**
 * Implements ad-hoc mixing of classes. User internally by `$oop.Class`.
 * @class $oop.ClassMixer
 * @see $oop.mixClass
 * @ignore
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
   * Compare callback for determining mixin addition order.
   * @param {$oop.Class} MixinA
   * @param {$oop.Class} MixinB
   * @returns {number}
   * @private
   */
  _compareMixins: function (MixinA, MixinB) {
    return (MixinA.mixes(MixinB) || MixinA.expects(MixinB)) ? 1 :
        (MixinB.mixes(MixinA) || MixinB.expects(MixinA)) ? -1 :
            MixinA.__classId > MixinB.__classId ? 1 :
                MixinB.__classId > MixinA.__classId ? -1 :
                    0;
  },

  /**
   * Creates or retrieves an ad-hoc class that is made up of the specified
   * mixins.
   * @param {...$oop.Class} Mixin
   * @returns {$oop.Class}
   * @todo Change variable argument list to array?
   */
  mixClass: function (Mixin) {
    var
        mixins = slice.call(arguments)
        .sort(this._compareMixins),
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
