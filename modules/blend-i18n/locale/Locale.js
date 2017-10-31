"use strict";

/**
 * @function $i18n.Locale.create
 * @param {Object} properties
 * @param {$entity.DocumentKey} properties.localeKey
 * @returns {$i18n.Locale}
 */

/**
 * @class $i18n.Locale
 */
$i18n.Locale = $oop.getClass('$i18n.Locale')
.cache(function (properties) {
  var localeKey = properties && properties.localeKey;
  return localeKey && localeKey.toString();
})
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
  _resolveGetPluralIndex: function () {
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
   * Resolves multiplicity to a plural index, using the locale's *plural
   * formula*. Defaults to 0 plural index.
   * @param {number} multiplicity
   * @returns {number}
   */
  getPluralIndex: function (multiplicity) {
    if (!this._getPluralIndex) {
      this._resolveGetPluralIndex();
    }
    return this._getPluralIndex ?
        this._getPluralIndex(multiplicity) :
        0;
  },

  /**
   * Retrieves translation for specified `originalString`, `context`, and
   * `multiplicity` according to the current locale.
   * @param {string} originalString
   * @param {string} context
   * @param {number} multiplicity
   * @returns {string}
   */
  getTranslation: function (originalString, context, multiplicity) {
    var translationIndex = $i18n.TranslationIndex.create(),
        localeId = this.localeKey.documentId,
        pluralIndex = this.getPluralIndex(multiplicity);

    // when specified translation is not found,
    // falling back to default context
    // then falling back to original string
    return translationIndex.getTranslation(localeId, originalString, context, pluralIndex) ||
        translationIndex.getTranslation(localeId, originalString, null, pluralIndex) ||
        originalString;
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
