"use strict";

/**
 * @class $oop.ClassByMixinsIndex
 */
$oop.ClassByMixinsIndex = $oop.createObject(Object.prototype, /** @lends $oop.ClassByMixinsIndex */{
  /**
   * @param {Array.<$oop.Class>} mixins
   * @returns {string}
   * @private
   */
  _getHashForMixins: function (mixins) {
    return mixins
    .map(function (Mixin) {
      return Mixin.__classId.replace(/\,/g, '\\,');
    })
    // todo Should mixin order matter? Ie. mixClass(A,B) !== mixClass(B,A)
    .sort()
    .join(',');
  },

  /**
   * @param {string} mixinsHash
   * @returns {$oop.Class}
   * @private
   */
  _getFirstClass: function (mixinsHash) {
    var classLookup = $oop.classByMixinIds[mixinsHash],
        classId;

    if (classLookup) {
      for (classId in classLookup) {
        if (hOP.call(classLookup, classId)) {
          return classLookup[classId];
        }
      }
    }
  },

  /**
   * Adds Class to index, associating it with the specified list of mixins.
   * @param {$oop.Class} Class
   * @param {Array.<$oop.Class>} mixins
   * @returns {$oop.ClassByMixinsIndex}
   * @todo Rename to set...
   */
  addClassForMixins: function (Class, mixins) {
    var mixinHash = this._getHashForMixins(mixins),
        classByMixinIds = $oop.classByMixinIds,
        classLookup = classByMixinIds[mixinHash];
    if (!classLookup) {
      classByMixinIds[mixinHash] = classLookup = {};
    }
    classLookup[Class.__classId] = Class;
    return this;
  },

  /**
   * Adds Class to index, based on its own mixins.
   * @param {$oop.Class} Class
   * @returns {$oop.ClassByMixinsIndex}
   * @todo Rename to set...
   */
  addClass: function (Class) {
    var mixins = Class.__mixins.downstream.list;
    if (mixins.length) {
      this.addClassForMixins(Class, mixins);
    }
    return this;
  },

  /**
   * Retrieves a Class from the index matching the specified list of mixins.
   * @param {Array.<$oop.Class>} mixins
   * @returns {$oop.Class}
   */
  getClassForMixins: function (mixins) {
    var mixinHash = this._getHashForMixins(mixins);
    return this._getFirstClass(mixinHash);
  }
});

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * Classes (declared or ad-hoc) indexed by the serialized class IDs of the
   * mixins they're composed of.
   * @type {object}
   */
  classByMixinIds: {}
});
