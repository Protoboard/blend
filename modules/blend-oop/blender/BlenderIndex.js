"use strict";

/**
 * @class $oop.BlenderIndex
 */
$oop.BlenderIndex = $oop.createObject(Object.prototype, /** @lends $oop.BlenderIndex */{
  /**
   * @param {$oop.Class} Class
   * @param {Array.<$oop.ClassBuilder>} mixinBuilders
   * @return {$oop.BlenderIndex}
   */
  addClassForMixins: function (Class, mixinBuilders) {
    var classByMixinIds = $oop.classByMixinIds,
        mixinHash = mixinBuilders.map($oop.getClassBuilderId).join(','),
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
    var mixins = Class.__builder.mixins.downstream.list;
    if (mixins.length) {
      this.addClassForMixins(Class, mixins);
    }
    return this;
  },

  /**
   * @param {Array.<$oop.ClassBuilder>} mixinBuilders
   * @return {$oop.Class}
   */
  getClassForMixins: function (mixinBuilders) {
    var mixinHash = mixinBuilders.map($oop.getClassBuilderId).join(',');
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
