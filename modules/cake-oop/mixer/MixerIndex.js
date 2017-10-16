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
    .sort()
    .join(',');
  },

  /**
   * Compare function to be used in sorting arrays of classes. Places
   * declared classes first, ad-hoc classes (with UUID as ID) last.
   * @param {$oop.Class} MixinA
   * @param {$oop.Class} MixinB
   * @returns {number}
   * @private
   */
  _compareMixins: function (MixinA, MixinB) {
    var RE_UUID = $oop.RE_UUID,
        classIdA = MixinA.__classId,
        classIdB = MixinB.__classId;
    return RE_UUID.test(classIdA) && !RE_UUID.test(classIdB) ? 1 :
        RE_UUID.test(classIdB) && !RE_UUID.test(classIdA) ? -1 :
            0;
  },

  /**
   * @param {Array.<$oop.Class>} mixinHash
   * @private
   */
  _updateClassOrderForMixins: function (mixinHash) {
    var classes = $oop.getSafeQuickList($oop.classByMixinIds, mixinHash);
    classes.list
    .sort(this._compareMixins);
  },

  /**
   * @param mixinHash
   * @private
   */
  _updateClassLookupForMixins: function (mixinHash) {
    var classes = $oop.getSafeQuickList($oop.classByMixinIds, mixinHash);
    classes.lookup = classes.list
    .reduce(function (lookup, Class, i) {
      lookup[Class.__classId] = i;
      return lookup;
    }, {});
  },

  /**
   * Adds Class to index, associating it with the specified list of mixins.
   * @param {$oop.Class} Class
   * @param {Array.<$oop.Class>} mixins
   * @returns {$oop.MixerIndex}
   */
  setClassForMixins: function (Class, mixins) {
    var classId = Class.__classId,
        mixinHash = this._getHashForMixins(mixins),
        classesForMixins = $oop.getSafeQuickList($oop.classByMixinIds, mixinHash),
        classList = classesForMixins.list,
        classLookup = classesForMixins.lookup;

    // adding class to index and updating order
    if (!hOP.call(classLookup, classId)) {
      classList.push(Class);
      this._updateClassOrderForMixins(mixinHash);
      this._updateClassLookupForMixins(mixinHash);
    }

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
   * Removes the class that is associated with the specified mixins from the
   * index.
   * @param {$oop.Class} Class
   * @param {Array.<$oop.Class>} mixins
   * @returns {$oop.MixerIndex}
   */
  deleteClassForMixins: function (Class, mixins) {
    var classId = Class.__classId,
        mixinHash = this._getHashForMixins(mixins),
        classesForMixins = $oop.classByMixinIds[mixinHash],
        classList = classesForMixins && classesForMixins.list,
        classLookup = classesForMixins && classesForMixins.lookup;

    // removing class from index and updating order
    if (classLookup && hOP.call(classLookup, classId)) {
      classList.splice(classLookup[classId], 1);
      if (classList.length) {
        this._updateClassLookupForMixins(mixinHash);
      } else {
        delete $oop.classByMixinIds[mixinHash];
      }
    }

    return this;
  },

  /**
   * Removes Class from index, based on its own mixins.
   * @param {$oop.Class} Class
   * @returns {$oop.MixerIndex}
   */
  deleteClass: function (Class) {
    var mixins = Class.__mixins.downstream.list;
    if (mixins.length) {
      this.deleteClassForMixins(Class, mixins);
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
  classByMixinIds: {}
});
