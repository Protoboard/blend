"use strict";

/**
 * @function $i18n.Locale.create
 * @param {Object} properties
 * @param {$entity.DocumentKey} properties.localeKey
 * @returns {$i18n.Locale}
 */

/**
 * @class $i18n.Locale
 * @extends $event.EventListener
 * @extends $event.EventSender
 */
$i18n.Locale = $oop.getClass('$i18n.Locale')
.cache(function (properties) {
  var localeKey = properties && properties.localeKey;
  return localeKey && localeKey.toString();
})
.blend($event.EventListener)
.blend($event.EventSender)
.define(/** @lends $i18n.Locale# */{
  /**
   * @member {$entity.DocumentKey} $i18n.Locale#localeKey
   */

  /**
   * @memberOf $i18n.Locale
   * @param {$entity.DocumentKey} localeKey
   * @returns {$i18n.Locale}
   */
  fromLocaleKey: function (localeKey) {
    return this.create({localeKey: localeKey});
  },

  /**
   * @memberOf $i18n.Locale
   * @param {string} localeId
   * @returns {$i18n.Locale}
   */
  fromLocaleId: function (localeId) {
    var localeKey = $entity.DocumentKey.fromComponents('_locale', localeId);
    return this.create({localeKey: localeKey});
  },

  /** @ignore */
  init: function () {
    $assert.isDocumentKey(this.localeKey, "Invalid locale key");

    var listeningPath = $data.Path.fromComponentsToString([
      'locale', this.localeKey.documentId]);

    this
    .setListeningPath(listeningPath)
    .addTriggerPath(listeningPath)
    .addTriggerPath('locale');
  },

  /**
   * @function $i18n.Locale#_getPluralIndex
   * @param {number} n
   * @returns {number}
   * @private
   */

  /**
   * @private
   */
  _compileGetPluralIndex: function () {
    /*jshint evil:true*/
    var localeDocument = this.localeKey.toDocument(),
        pluralFormula = localeDocument.getPluralFormula();

    if (pluralFormula) {
      eval([
        //@formatter:off
        'this._getPluralIndex = function (n) {',
          'var nplurals, plural;',
          pluralFormula,
          'return Number(plural);',
        '}'
        //@formatter:on
      ].join('\n'));
    }
  },

  /**
   * Resolves count to a plural index, using the locale's *plural
   * formula*. Defaults to 0 plural index.
   * @param {number} count
   * @returns {number}
   */
  getPluralIndex: function (count) {
    if (!this._getPluralIndex) {
      this._compileGetPluralIndex();
    }
    return this._getPluralIndex ?
        this._getPluralIndex(count) :
        0;
  },

  /**
   * Retrieves translation for specified `originalString`, `context`, and
   * `count` according to the current locale.
   * @param {string} originalString
   * @param {string} context
   * @param {number} count
   * @returns {string}
   */
  getTranslation: function (originalString, context, count) {
    var translationIndex = $i18n.TranslationIndex.create(),
        localeId = this.localeKey.documentId,
        pluralIndex = this.getPluralIndex(count);

    // when specified translation is not found,
    // falling back to default context
    // then falling back to original string
    return translationIndex.getTranslation(localeId, originalString, context, pluralIndex) ||
        translationIndex.getTranslation(localeId, originalString, null, pluralIndex) ||
        originalString;
  },

  /**
   * Retrieves list of modules that have translations for current locale.
   * @returns {Array.<$module.Module>}
   */
  getModules: function () {
    var localeId = this.localeKey.documentId;

    return $i18n.ModuleLocaleIndex.create()
    .getModuleIdsForLocale(localeId)
    .map(function (moduleId) {
      return $module.Module.fromModuleId(moduleId);
    });
  },

  /**
   * Sets current locale as active locale.
   * @returns {$i18n.Locale}
   */
  setAsActiveLocale: function () {
    $i18n.LocaleEnvironment.create().setActiveLocale(this);
    return this;
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$i18n.Locale}
   */
  toLocale: function () {
    return $i18n.Locale.fromLocaleId(this.valueOf());
  }
});
