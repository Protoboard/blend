"use strict";

/**
 * @class $oop.BlenderIndex
 */
$oop.BlenderIndex = $oop.createObject(Object.prototype, /** @lends $oop.BlenderIndex */{
  /**
   * @param {Array.<$oop.ClassBuilder>} mixinBuilders
   * @return {Array.<$oop.ClassBuilder>}
   * @private
   * @todo Refactor into iterative for performance.
   */
  _normalizeMixins: function (mixinBuilders) {
    var result = [],
        lookup = {};
    mixinBuilders.forEach(function (mixinBuilder) {
      mixinBuilder.contributors
      .forEach(function (mixinBuilder) {
        if (!lookup[mixinBuilder.classId]) {
          result.push(mixinBuilder);
          lookup[mixinBuilder.classId] = 1;
        }
      });
    });
    return result;
  },

  /**
   * @param {$oop.Class} Class
   * @param {Array.<$oop.ClassBuilder>} mixinBuilders
   * @return {$oop.BlenderIndex}
   */
  addClassForMixins: function (Class, mixinBuilders) {
    var classByMixinIds = $oop.classByMixinIds,
        normalizedMixins = this._normalizeMixins(mixinBuilders),
        mixinHash = normalizedMixins.map($oop.getClassBuilderId).join(','),
        ClassBefore = classByMixinIds[mixinHash];

    if (!ClassBefore) {
      classByMixinIds[mixinHash] = Class;
    }

    return this;
  },

  /**
   * @param {$oop.Class} Class
   * @return {$oop.BlenderIndex}
   */
  addClass: function (Class) {
    var mixinBuilders = Class.__builder.contributors;
    if (mixinBuilders.length) {
      this.addClassForMixins(Class, mixinBuilders);
    }
    return this;
  },

  /**
   * @param {Array.<$oop.ClassBuilder>} mixinBuilders
   * @return {$oop.Class}
   */
  getClassForMixins: function (mixinBuilders) {
    var normalizedMixins = this._normalizeMixins(mixinBuilders),
        mixinHash = normalizedMixins.map($oop.getClassBuilderId).join(',');
    return $oop.classByMixinIds[mixinHash];
  }
});

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * Classes (declared or ad-hoc) indexed by the serialized class IDs of the
   * mixins they're composed of. Used internally by `$oop.BlenderIndex`.
   * @type {Object.<string,$oop.Class>}
   */
  classByMixinIds: {}
});
