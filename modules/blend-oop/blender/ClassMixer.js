"use strict";

/**
 * @class $oop.ClassMixer
 * @todo Rename to ClassBlender once current ClassBlender is demised.
 */
$oop.ClassMixer = $oop.createObject(Object.prototype, /** @lends $oop.ClassMixer */{
  /**
   * @param {$oop.Klass} Class
   * @param {Array.<$oop.ClassBuilder>} mixinBuilders
   * @private
   */
  _classMatchesMixins: function (Class, mixinBuilders) {
    var mixinsA = Class.__builder.mixins.downstream.list,
        mixinCountA = mixinsA.length,
        mixinCountB = mixinBuilders.length,
        i;

    if (mixinCountA === mixinCountB) {
      for (i = 0; i < mixinCountA; i++) {
        if (mixinsA[i] !== mixinBuilders[i]) {
          return false;
        }
      }
    } else {
      return false;
    }

    return true;
  },

  /**
   * @param {Array.<$oop.ClassBuilder>} mixinBuilders
   * @return {Array.<$oop.Klass>}
   * @private
   */
  _findMatchingClass: function (mixinBuilders) {
    var classes = $oop.klasses,
        classCount = classes.length,
        i, Class;
    for (i = 0; i < classCount; i++) {
      Class = classes[i];
      if (this._classMatchesMixins(Class, mixinBuilders)) {
        return Class;
      }
    }
  },

  /**
   * @param {Array.<$oop.Klass>} mixins
   * @return {$oop.Klass}
   * @private
   */
  _blendClass: function (mixins) {
    var classBuilder = $oop.createClass($oop.generateUuid()),
        mixinCount = mixins.length,
        i;
    for (i = 0; i < mixinCount; i++) {
      classBuilder.blend(mixins[i]);
    }
    return classBuilder.build();
  },

  /**
   * @param {Array.<$oop.Klass>} mixins
   * @return {$oop.Klass}
   * @todo Rename to blendClass ASAP
   */
  mixClass: function (mixins) {
    var mixinBuilders = mixins.map(function (Mixer) {
      return Mixer.__builder;
    });

    return $oop.MixerIndex.getClassForMixins(mixinBuilders) ||
        this._findMatchingClass(mixinBuilders) ||
        this._blendClass(mixins);
  }
});
