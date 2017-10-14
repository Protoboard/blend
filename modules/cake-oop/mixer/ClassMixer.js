"use strict";

/**
 * Implements ad-hoc mixing of classes. Used internally by `$oop.Class`.
 * @class $oop.ClassMixer
 * @see $oop.mixClass
 * @ignore
 */
$oop.ClassMixer = $oop.createObject(Object.prototype, /** @lends $oop.ClassMixer */{
  /**
   * @param {$oop.Class} Class
   * @param {Array.<$oop.Class>} mixins
   * @returns {boolean}
   * @private
   * @todo Check performance impact.
   */
  _classMatchesMixins: function (Class, mixins) {
    var
        mixinsA = Class.__mixins.downstream.list
        .map($oop.getClassId)
        .sort(),
        mixinsB = mixins
        .reduce(function (result, Mixin) {
          Mixin.__mixins.downstream.list
          .concat([Mixin])
          .forEach(function (Mixin) {
            var mixinId = Mixin.__classId;
            if (result.indexOf(mixinId) === -1) {
              result.push(Mixin.__classId);
            }
          });
          return result;
        }, [])
        .sort(),
        mixinCount, i;

    // checking if 2 sets of mixins are the same
    if (mixinsA.length === mixinsB.length) {
      mixinCount = mixinsA.length;
      for (i = 0; i < mixinCount; i++) {
        if (mixinsA[i] !== mixinsB[i]) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  },

  /**
   * Searches global class registry and returns a list of classes that are
   * exact matches for the specified list of mixins.
   * @param {Array.<$oop.Class>} mixins
   * @returns {Array.<$oop.Class>}
   * @private
   */
  _findMatchingClasses: function (mixins) {
    var that = this,
        classByClassId = $oop.classByClassId,
        classIds = Object.keys(classByClassId);

    return classIds
    // todo We could avoid this map with a global `classes` array.
    .map($oop.getClass)
    .filter(function (Class) {
      return that._classMatchesMixins(Class, mixins);
    });
  },

  /**
   * Creates or retrieves an ad-hoc class that is made up of the specified
   * mixins.
   * @param {...$oop.Class} Mixin
   * @returns {$oop.Class}
   * @todo Change variable argument list to array?
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
