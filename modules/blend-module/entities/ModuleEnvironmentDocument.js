"use strict";

/**
 * @function $module.ModuleEnvironmentDocument.create
 * @param {object} properties
 * @param {$entity.DocumentKey} properties.entityKey
 * @returns {$module.ModuleEnvironmentDocument}
 */

/**
 * @class $module.ModuleEnvironmentDocument
 * @extends {$entity.Document}
 */
$module.ModuleEnvironmentDocument = $oop.getClass('$module.ModuleEnvironmentDocument')
.blend($entity.Document)
.define(/** @lends $module.ModuleEnvironmentDocument# */{
  /**
   * @param {string} moduleId
   * @returns {$module.ModuleEnvironmentDocument}
   */
  addToAvailableModules: function (moduleId) {
    this.getField('availableModules').getItem(moduleId).setNode(1);
    return this;
  },

  /**
   * @param {string} moduleId
   * @returns {$module.ModuleEnvironmentDocument}
   */
  removeFromAvailableModules: function (moduleId) {
    this.getField('availableModules').getItem(moduleId).deleteNode();
    return this;
  },

  /**
   * @param {string} moduleId
   * @returns {boolean}
   */
  isInAvailableModules: function (moduleId) {
    return !!this.getField('availableModules').getItem(moduleId).getNode();
  }
});

$entity.Document
.forwardBlend($module.ModuleEnvironmentDocument, function (properties) {
  var documentKey = properties && properties.entityKey;
  return documentKey && documentKey.documentType === '_moduleEnvironment';
});
