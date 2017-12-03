"use strict";

/**
 * @class $oop.MixerIndex
 * @todo Rename to BlenderIndex once old BlenderIndex is demised.
 */
$oop.MixerIndex = $oop.createObject(Object.prototype, /** @lends $oop.MixerIndex */{
  /**
   * @param {$oop.Klass} Class
   * @param {Array.<$oop.ClassBuilder>} mixinBuilders
   * @return {$oop.MixerIndex}
   */
  addClassForMixins: function (Class, mixinBuilders) {
    var klassByMixinIds = $oop.klassByMixinIds,
        mixinHash = mixinBuilders.map($oop.getClassBuilderId).join(','),
        ClassBefore = klassByMixinIds[mixinHash];

    if (!ClassBefore) {
      klassByMixinIds[mixinHash] = Class;
    }

    return this;
  },

  /**
   * @param {$oop.Klass} Class
   * @return {$oop.MixerIndex}
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
   * @return {$oop.Klass}
   */
  getClassForMixins: function (mixinBuilders) {
    var mixinHash = mixinBuilders.map($oop.getClassBuilderId).join(',');
    return $oop.klassByMixinIds[mixinHash];
  }
});

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * Classes (declared or ad-hoc) indexed by the serialized class IDs of the
   * mixins they're composed of. Used internally by `$oop.MixerIndex`.
   * @type {Object.<string,$oop.Klass>}
   */
  klassByMixinIds: {}
});
