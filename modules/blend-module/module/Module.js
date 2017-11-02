"use strict";

/**
 * @function $module.Module.create
 * @param {Object} properties
 * @param {string} properties.moduleId
 * @returns {$module.Module}
 */

/**
 * @class $module.Module
 * @extends $event.EventSender
 * @extends $event.EventListener
 * @todo Add manifest
 */
$module.Module = $oop.getClass('$module.Module')
.cache(function (properties) {
  return properties && properties.moduleId;
})
.blend($event.EventSender)
.blend($event.EventListener)
.define(/** @lends $module.Module# */{
  /**
   * @member {string} $module.Module#moduleId
   */

  /**
   * @memberOf $module.Module
   * @param moduleId
   * @returns {$module.Module}
   */
  fromModuleId: function (moduleId) {
    return this.create({
      moduleId: moduleId
    });
  },

  /** @ignore */
  init: function () {
    $assert.isString(this.moduleId, "Invalid module ID");

    var listeningPath = $data.Path.fromComponentsToString([
      'module', this.moduleId]);

    this
    .setListeningPath(listeningPath)
    .addTriggerPath(listeningPath)
    .addTriggerPath('module');
  },

  /**
   * Marks module as available.
   * @returns {$module.Module}
   */
  markAsAvailable: function () {
    $module.ModuleEnvironment.create().markModuleAsAvailable(this);
    return this;
  },

  /**
   * Marks module as unavailable.
   * @returns {$module.Module}
   */
  markAsUnavailable: function () {
    $module.ModuleEnvironment.create().markModuleAsUnavailable(this);
    return this;
  },

  /**
   * Tells whether current module is available.
   * @returns {boolean}
   */
  isAvailable: function () {
    return $module.ModuleEnvironment.create().isModuleAvailable(this);
  },

  /**
   * @memberOf $module.Module
   * @param {$entity.EntityChangeEvent} event
   * @ignore
   */
  onAvailableModulesChange: function (event) {
    event.propertiesRemoved
    .forEach(function (moduleId) {
      $module.Module.fromModuleId(moduleId)
      .trigger($module.EVENT_MODULE_UNAVAILABLE);
    });

    event.propertiesAdded
    .forEach(function (moduleId) {
      $module.Module.fromModuleId(moduleId)
      .trigger($module.EVENT_MODULE_AVAILABLE);
    });
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$module.Module}
   */
  toModule: function () {
    return $module.Module.fromModuleId(this.valueOf());
  }
});

$event.EventSpace.create()
.on($entity.EVENT_ENTITY_CHANGE,
    'entity.document._moduleEnvironment..availableModules',
    $module.Module.__classId,
    $module.Module.onAvailableModulesChange);