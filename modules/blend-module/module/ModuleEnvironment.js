"use strict";

/**
 * @function $module.ModuleEnvironment.create
 * @returns {$module.ModuleEnvironment}
 */

/**
 * @class $module.ModuleEnvironment
 * @extends $event.EventListener
 */
$module.ModuleEnvironment = $oop.getClass('$module.ModuleEnvironment')
.blend($oop.Singleton)
.blend($event.EventListener)
.define(/** @lends $module.ModuleEnvironment# */{
  /**
   * @member {$entity.DocumentKey} $i18n.LocaleEnvironment#moduleEnvironmentKey
   */

  /** @ignore */
  init: function () {
    this.moduleEnvironmentKey = $entity.DocumentKey.fromString('_moduleEnvironment/');

    this
    .setListeningPath('module');
  },

  /**
   * @param {$module.Module} module
   * @returns {$module.ModuleEnvironment}
   */
  markModuleAsAvailable: function (module) {
    this.moduleEnvironmentKey.toDocument()
    .addToAvailableModules(module.moduleId);
    return this;
  },

  /**
   * @param {$module.Module} module
   * @returns {$module.ModuleEnvironment}
   */
  markModuleAsUnavailable: function (module) {
    this.moduleEnvironmentKey.toDocument()
    .removeFromAvailableModules(module.moduleId);
    return this;
  },

  /**
   * @param {$module.Module} module
   * @returns {boolean}
   */
  isModuleAvailable: function (module) {
    return this.moduleEnvironmentKey.toDocument()
    .isInAvailableModules(module.moduleId);
  }
});
