"use strict";

/**
 * @function $i18n.ModuleLocaleIndex.create
 * @returns {$i18n.ModuleLocaleIndex}
 */

/**
 * Maintains associations between modules and locales.
 * @class $i18n.ModuleLocaleIndex
 */
$i18n.ModuleLocaleIndex = $oop.getClass('$i18n.ModuleLocaleIndex')
.blend($oop.Singleton)
.define(/** @lends $i18n.ModuleLocaleIndex# */{
  /**
   * @param {string} moduleId
   * @param {string} localeId
   * @returns {$i18n.ModuleLocaleIndex}
   */
  addLocaleForModule: function (moduleId, localeId) {
    $entity.index
    .setNode($data.TreePath.fromComponents([
      '_localesByModule', moduleId, localeId]), 1)
    .setNode($data.TreePath.fromComponents([
      '_modulesByLocale', localeId, moduleId]), 1);
    return this;
  },

  /**
   * Retrieves a list of module IDs associated with the specified `localeId`.
   * @param {string} localeId
   * @returns {Array.<string>}
   */
  getModuleIdsForLocale: function (localeId) {
    return $entity.index
    .getNodeWrapped($data.TreePath.fromComponents([
      '_modulesByLocale', localeId]))
    .asCollection()
    .getKeys();
  },

  /**
   * Retrieves a list of locale IDs associated with the specified `moduleId`.
   * @param {string} moduleId
   * @returns {Array.<string>}
   */
  getLocaleIdsForModule: function (moduleId) {
    return $entity.index
    .getNodeWrapped($data.TreePath.fromComponents([
      '_localesByModule', moduleId]))
    .asCollection()
    .getKeys();
  }
});
