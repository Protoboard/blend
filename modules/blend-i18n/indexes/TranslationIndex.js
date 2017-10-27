"use strict";

/**
 * @function $i18n.TranslationIndex.create
 * @returns {$i18n.TranslationIndex}
 */

/**
 * Maintains a lookup of translations indexed by locale, original strings,
 * context, and plural information.
 * @class $i18n.TranslationIndex
 */
$i18n.TranslationIndex = $oop.getClass('$i18n.TranslationIndex')
.blend($oop.Singleton)
.define(/** @lends $i18n.TranslationIndex# */{
  /** @ignore */
  init: function () {
    this._initTranslationIndex();
  },

  /**
   * Initializes index based on current contents of locale and translation
   * documents.
   * @private
   */
  _initTranslationIndex: function () {
    var that = this,
        localeDocumentsPath = $data.Path.fromString('document._locale');

    // cycling through all locale documents
    $entity.entities.getNodeWrapped(localeDocumentsPath)
    .asCollection()
    .forEachItem(function (localeNode) {
      var localeName = localeNode.localeName;

      // cycling through all translations for locale
      $data.StringSet.fromData(localeNode.translations)
      .forEachItem(function (translationRef) {
        var translationKey = $entity.DocumentKey.fromString(translationRef),
            translationDocument = $entity.Document.fromEntityKey(translationKey),
            translationNode = translationDocument.getNode(),
            originalString = translationNode.originalString,
            context = translationNode.context;

        // cycling through all plural forms for translation
        $data.Collection.fromData(translationNode.pluralForms)
        .forEachItem(function (translatedString, pluralIndex) {
          // adding translation in index
          that.addTranslation(
              localeName,
              originalString,
              context,
              pluralIndex,
              translatedString);
        });
      });
    });
  },

  /**
   * Associates and stores translation with the specified `localeName`,
   * `originalString`, `context`, and `pluralIndex`.
   * @param {string} localeName
   * @param {string} originalString
   * @param {string} [context='']
   * @param {number} [pluralIndex=0]
   * @param {string} translatedString
   * @returns {$i18n.TranslationIndex}
   */
  addTranslation: function (localeName, originalString, context, pluralIndex,
      translatedString
  ) {
    context = context || '';
    pluralIndex = pluralIndex || 0;
    var indexPath = $data.Path.fromComponents([
      '_translation', localeName, originalString, context, pluralIndex]);
    $entity.index.setNode(indexPath, translatedString);
    return this;
  },

  /**
   * Retrieves translation for the specified `localeName`, `originalString`,
   * `context`, and `pluralIndex`.
   * @param {string} localeName
   * @param {string} originalString
   * @param {string} [context='']
   * @param {number} [pluralIndex=0]
   * @returns {*}
   */
  getTranslation: function (localeName, originalString, context, pluralIndex) {
    context = context || '';
    pluralIndex = pluralIndex || 0;
    var indexPath = $data.Path.fromComponents([
      '_translation', localeName, originalString, context, pluralIndex]);
    return $entity.index.getNode(indexPath);
  }
});
