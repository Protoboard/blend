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
   * @param {Object} translationNode
   * @param {string} localeId
   * @private
   */
  _addTranslationNode: function (translationNode, localeId) {
    var that = this,
        originalString = translationNode.originalString,
        context = translationNode.context;

    // cycling through all plural forms for translation
    $data.Collection.fromData(translationNode.pluralForms)
    .forEachItem(function (translatedString, pluralIndex) {
      // adding translation in index
      that.addTranslation(
          localeId,
          originalString,
          context,
          pluralIndex,
          translatedString);
    });
  },

  /**
   * Initializes index based on current contents of locale and translation
   * documents.
   * @private
   */
  _initTranslationIndex: function () {
    var that = this,
        localeDocumentsPath = $data.TreePath.fromString('document._locale');

    // cycling through all locale documents
    $entity.entities.getNodeWrapped(localeDocumentsPath)
    .asCollection()
    .forEachItem(function (localeNode, localeId) {
      // cycling through all translations for locale
      $data.Collection.fromData(localeNode.translations)
      .mapValues(function (placeholder, translationRef) {
        var translationKey = $entity.DocumentKey.fromString(translationRef),
            translationDocument = $entity.Document.fromEntityKey(translationKey);
        return translationDocument.getNode();
      })
      .filterByValueType(Object)
      .forEachItem(function (translationNode) {
        that._addTranslationNode(translationNode, localeId);
      });
    });
  },

  /**
   * Associates and stores translation with the specified `localeId`,
   * `originalString`, `context`, and `pluralIndex`.
   * @param {string} localeId
   * @param {string} originalString
   * @param {string} [context='']
   * @param {number} [pluralIndex=0]
   * @param {string} translatedString
   * @returns {$i18n.TranslationIndex}
   */
  addTranslation: function (localeId, originalString, context, pluralIndex,
      translatedString
  ) {
    context = context || '';
    pluralIndex = pluralIndex || 0;
    var indexPath = $data.TreePath.fromComponents([
      '_translation', localeId, originalString, context, pluralIndex]);
    $entity.index.setNode(indexPath, translatedString);
    return this;
  },

  /**
   * Retrieves translation for the specified `localeId`, `originalString`,
   * `context`, and `pluralIndex`.
   * @param {string} localeId
   * @param {string} originalString
   * @param {string} [context='']
   * @param {number} [pluralIndex=0]
   * @returns {*}
   */
  getTranslation: function (localeId, originalString, context, pluralIndex) {
    context = context || '';
    pluralIndex = pluralIndex || 0;
    var indexPath = $data.TreePath.fromComponents([
      '_translation', localeId, originalString, context, pluralIndex]);
    return $entity.index.getNode(indexPath);
  },

  /**
   * @param {$entity.EntityChangeEvent} event
   * @ignore
   */
  onTranslationsFieldChange: function (event) {
    var that = this,
        translationsFieldKey = event.sender.entityKey,
        localeKey = translationsFieldKey.documentKey,
        localeId = localeKey.documentId;

    // adding translation documents to index for valid translation references
    event.propertiesAdded
    .map(function (translationRef) {
      return $entity.Document.fromString(translationRef).getNode();
    })
    .filter(function (translationNode) {
      return !!translationNode;
    })
    .forEach(function (translationNode) {
      that._addTranslationNode(translationNode, localeId);
    });
  }
});

$event.EventSpace.create()
.on($entity.EVENT_ENTITY_CHANGE,
    $entity.FieldAttributePath.fromAttributeRef('_locale/translations')
    .unshift('entity').toString(),
    $i18n.TranslationIndex.__classId,
    function (event) {
      return $i18n.TranslationIndex.create().onTranslationsFieldChange(event);
    });
