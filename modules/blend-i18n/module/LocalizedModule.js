"use strict";

/**
 * @function $i18n.LocalizedModule.create
 * @param {Object} properties
 * @param {string} properties.moduleId
 * @returns {$i18n.LocalizedModule}
 */

/**
 * Application module that is associated with one or more locales, for which
 * the module has localized text.
 * @class $i18n.LocalizedModule
 * @extends $module.Module
 */
$i18n.LocalizedModule = $oop.createClass('$i18n.LocalizedModule')
.blend($module.Module)
.define(/** @lends $i18n.LocalizedModule# */{
  /**
   * Retrieves a list of locales in which the current module has translations.
   * @returns {Array.<$i18n.Locale>}
   */
  getLocales: function () {
    return $i18n.ModuleLocaleIndex.create()
    .getLocaleIdsForModule(this.moduleId)
    .map(function (localeId) {
      return $i18n.Locale.fromLocaleId(localeId);
    });
  }
})
.build();

$module.Module
.forwardBlend($i18n.LocalizedModule, function (properties) {
  var moduleId = properties && properties.moduleId;
  return $i18n.ModuleLocaleIndex.create()
  .getLocaleIdsForModule(moduleId).length;
});