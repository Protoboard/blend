"use strict";

/**
 * @class $oop.ClassMixer
 */
$oop.ClassMixer = $oop.createObject(Object.prototype, /** @lends $oop.ClassMixer */{
  /**
   * @param {Array.<$oop.Class>} Mixins
   * @returns {string}
   * @private
   */
  _getHashForMixins: function (Mixins) {
    return Mixins
    .map(function (Mixin) {
      return Mixin.__classId.replace(/\./g, '\\.');
    })
    // todo Should mixin order matter? Ie. mixClass(A,B) !== mixClass(B,A)
    .sort()
    .join('.');
  },

  /**
   * @param {string} mixinsHash
   * @returns {$oop.Class}
   * @private
   */
  _getFirstClass: function (mixinsHash) {
    var classes = $oop.classesByMixinId[mixinsHash],
        classId;

    if (classes) {
      for (classId in classes) {
        if (hOP.call(classes, classId)) {
          return classes[classId];
        }
      }
    }
  },

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
   * @param {string} mixinHash
   * @param {$oop.Class} Class
   * @private
   */
  _addClassToLookup: function (mixinHash, Class) {
    var classesByMixinId = $oop.classesByMixinId,
        classLookup = classesByMixinId[mixinHash];
    if (!classLookup) {
      classesByMixinId[mixinHash] = classLookup = {};
    }
    classLookup[Class.__classId] = Class;
  },

  /**
   * Creates or retrieves an ad-hoc class that is made up of the specified
   * mixins.
   * @param {...$oop.Class} Mixin
   * @returns {$oop.Class}
   */
  mixClass: function (Mixin) {
    var classesByMixinId = $oop.classesByMixinId,
        Mixins = slice.call(arguments),
        mixinsHash = this._getHashForMixins(Mixins),
        Class = this._getFirstClass(mixinsHash);

    if (!classesByMixinId[mixinsHash]) {
      // finding an existing matching class
      Class = this._findFirstMatchingClass(Mixins);

      if (!Class) {
        // creating ad-hoc class and adding mixins
        Class = $oop.getClass($oop.generateUuid());
        Mixins.forEach(function (Mixin) {
          Class.mix(Mixin);
        });
      }

      // todo This should happen in $oop.Class#mixOnly()
      this._addClassToLookup(mixinsHash, Class);
    }

    return Class;
  }
});

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
