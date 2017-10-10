"use strict";

/**
 * Maintains an index of classes and mixins, with the intent of providing quick
 * access to classes based on (a subset of) their mixins. Used internally by
 * `$oop.ClassMixer`.
 * @class $oop.MixerIndex
 * @ignore
 */
$oop.MixerIndex = $oop.createObject(Object.prototype, /** @lends $oop.MixerIndex */{
  /**
   * @param {Array.<$oop.Class>} mixins
   * @returns {string}
   * @private
   */
  _getHashForMixins: function (mixins) {
    return mixins
    .map($oop.getClassId)
    .map($oop.escapeCommas)
    // todo Should mixin order matter? Ie. mixClass(A,B) !== mixClass(B,A)
    .sort()
    .join(',');
  },

  /**
   * @param {Array.<$oop.Class>} mixinHash
   * @private
   */
  _updateClassOrderForMixins: function (mixinHash) {
    //console.log("updating class list order for", mixinHash);
    var classes = $oop.getSafeIndexEntry($oop.classByMixinIds, mixinHash),
        classList = classes.list;

    // making sure list[0] is best choice
    // sorting on each insert makes it slow, but allows for fast access,
    // which is what we rely on at instantiation time
    // todo Declared classes should take precedence over ad-hoc.
    classList.sort(function (ClassA, ClassB) {
      var mixinCountA = ClassA.__mixins.downstream.list.length,
          mixinCountB = ClassB.__mixins.downstream.list.length;
      return mixinCountA > mixinCountB ? 1 :
          mixinCountA < mixinCountB ? -1 : 0;
    });
  },

  /**
   * Adds Class to index, associating it with the specified list of mixins.
   * @param {$oop.Class} Class
   * @param {Array.<$oop.Class>} mixins
   * @returns {$oop.MixerIndex}
   */
  setClassForMixins: function (Class, mixins) {
    var that = this,
        classId = Class.__classId,
        mixinHash = this._getHashForMixins(mixins),
        classesForMixins = $oop.getSafeIndexEntry($oop.classByMixinIds, mixinHash),
        mixinsForClass = $oop.getSafeIndexEntry($oop.mixinsByClassId, classId),
        classList = classesForMixins.list,
        classLookup = classesForMixins.lookup,
        mixinList = mixinsForClass.list,
        mixinLookup = mixinsForClass.lookup;

    if (!hOP.call(classLookup, classId)) {
      classList.push(Class);
      classLookup[classId] = true;
    }

    if (!hOP.call(mixinLookup, mixinHash)) {
      mixinList.push(mixinHash);
      mixinLookup[mixinHash] = true;
    }

    mixinList.forEach(function (mixinHash) {
      that._updateClassOrderForMixins(mixinHash);
    });

    return this;
  },

  /**
   * Adds Class to index, based on its own mixins.
   * @param {$oop.Class} Class
   * @returns {$oop.MixerIndex}
   */
  setClass: function (Class) {
    var mixins = Class.__mixins.downstream.list;
    if (mixins.length) {
      this.setClassForMixins(Class, mixins);
    }
    return this;
  },

  /**
   * Retrieves a Class from the index matching the specified list of mixins.
   * @param {Array.<$oop.Class>} mixins
   * @returns {$oop.Class}
   */
  getClassForMixins: function (mixins) {
    var mixinHash = this._getHashForMixins(mixins),
        classes = $oop.classByMixinIds[mixinHash];
    return classes && classes.list[0];
  }
});

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * Classes (declared or ad-hoc) indexed by the serialized class IDs of the
   * mixins they're composed of. Used internally by `$oop.MixerIndex`.
   * @type {$oop.QuickListLookup}
   * @ignore
   */
  classByMixinIds: {},

  /**
   * Mixin hashes indexed by class ID of mixer classes. Inverse of
   * `$oop.classByMixinIds`. Used internally by `$oop.MixerIndex`.
   * @type {$oop.QuickListLookup}
   * @ignore
   */
  mixinsByClassId: {}
});
