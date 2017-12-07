"use strict";

/**
 * @function $i18n.LocaleDocument.create
 * @param {object} properties
 * @param {$entity.DocumentKey} properties.entityKey
 * @returns {$i18n.LocaleDocument}
 */

/**
 * @class $i18n.LocaleDocument
 * @extends $entity.Document
 */
$i18n.LocaleDocument = $oop.createClass('$i18n.LocaleDocument')
.blend($entity.Document)
.define(/** @lends $i18n.LocaleDocument# */{
  /**
   * Sets name of current locale.
   * @param {string} localeName
   * @returns {$i18n.LocaleDocument}
   */
  setLocaleName: function (localeName) {
    this.getField('localeName').setNode(localeName);
    return this;
  },

  /**
   * Retrieves name of current locale.
   * @returns {string}
   */
  getLocaleName: function () {
    return this.getField('localeName').getNode();
  },

  /**
   * Sets country code for current locale.
   * @param {string} countryCode
   * @returns {$i18n.LocaleDocument}
   */
  setCountryCode: function (countryCode) {
    this.getField('countryCode').setNode(countryCode);
    return this;
  },

  /**
   * Retrieves country code associated with current locale.
   * @returns {string}
   */
  getCountryCode: function () {
    return this.getField('countryCode').getNode();
  },

  /**
   * Sets language code for current locale.
   * @param {string} languageCode
   * @returns {$i18n.LocaleDocument}
   */
  setLanguageCode: function (languageCode) {
    this.getField('languageCode').setNode(languageCode);
    return this;
  },

  /**
   * Retrieves language code associated with current locale.
   * @returns {*}
   */
  getLanguageCode: function () {
    return this.getField('languageCode').getNode();
  },

  /**
   * Sets plural formula for current locale.
   * @param {string} pluralFormula
   * @returns {$i18n.LocaleDocument}
   */
  setPluralFormula: function (pluralFormula) {
    $assert.isPluralFormula(pluralFormula, "Invalid plural formula");
    this.getField('pluralFormula').setNode(pluralFormula);
    return this;
  },

  /**
   * Retrieves plural formula associated with current locale.
   * @returns {string}
   */
  getPluralFormula: function () {
    return this.getField('pluralFormula').getNode();
  },

  /**
   * Adds translation key to translation references for the current locale.
   * @param {$entity.DocumentKey} translationKey
   * @returns {$i18n.LocaleDocument}
   */
  addTranslationKey: function (translationKey) {
    var translationRef = translationKey.toString();
    this.getField('translations').getItem(translationRef).setNode(1);
    return this;
  },

  /**
   * Tells whether the specified translation is part of the current locale.
   * @param {$entity.DocumentKey} translationKey
   * @returns {string}
   */
  hasTranslationKey: function (translationKey) {
    var translationRef = translationKey.toString();
    return this.getField('translations').getNode(translationRef);
  }
})
.build();

$entity.Document
.forwardBlend($i18n.LocaleDocument, function (properties) {
  var documentKey = properties && properties.entityKey;
  return documentKey && documentKey.documentType === '_locale';
});

$oop.copyProperties($i18n, /** @lends $i18n */{
  /**
   * @type {RegExp}
   * @constant
   * @link http://localization-guide.readthedocs.org/en/latest/l10n/pluralforms.html
   */
  RE_PLURAL_FORMULA: /^\s*nplurals\s*=\s*\d+;\s*plural\s*=\s*[()n\s\d!><=?:&|%]+\s*;\s*$/
});

$oop.copyProperties($assert, /** @lends $assert */{
  /**
   * @param {string} expr
   * @param {string} [message]
   * @returns {$assert}
   */
  isPluralFormula: function (expr, message) {
    return $assert.assert(
        $i18n.RE_PLURAL_FORMULA.test(expr), message);
  },

  /**
   * @param {string} [expr]
   * @param {string} [message]
   * @returns {$assert}
   */
  isPluralFormulaOptional: function (expr, message) {
    return $assert.assert(
        expr === undefined ||
        $i18n.RE_PLURAL_FORMULA.test(expr), message);
  }
});
