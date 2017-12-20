"use strict";

/**
 * @function $i18n.TranslationDocument.create
 * @param {object} properties
 * @param {$entity.DocumentKey} properties.entityKey
 * @returns {$i18n.TranslationDocument}
 */

/**
 * @class $i18n.TranslationDocument
 * @extends $entity.Document
 */
$i18n.TranslationDocument = $oop.createClass('$i18n.TranslationDocument')
.blend($entity.Document)
.define(/** @lends $i18n.TranslationDocument# */{
  /**
   * Sets original string for current translation.
   * @param {string} originalString
   * @returns {$i18n.TranslationDocument}
   */
  setOriginalString: function (originalString) {
    this.getField('originalString').setNode(originalString);
    return this;
  },

  /**
   * Retrieves original string for current translation.
   * @returns {string}
   */
  getOriginalString: function () {
    return this.getField('originalString').getNode();
  },

  /**
   * Sets plural form for the current translation and the specified
   * `pluralIndex`.
   * @param {number} pluralIndex
   * @param {string} pluralForm
   * @returns {$i18n.TranslationDocument}
   */
  setPluralForm: function (pluralIndex, pluralForm) {
    this.getField('pluralForms').getItem(pluralIndex).setNode(pluralForm);
    return this;
  },

  /**
   * Retrieves plural form for current translation at the specified
   * `pluralIndex`.
   * @returns {string}
   */
  getPluralForm: function (pluralIndex) {
    return this.getField('pluralForms').getItem(pluralIndex).getNode();
  },

  /**
   * Sets context for current translation.
   * @param {string} context
   * @returns {$i18n.TranslationDocument}
   */
  setContext: function (context) {
    this.getField('context').setNode(context);
    return this;
  },

  /**
   * Retrieves context associated with current translation.
   * @returns {string}
   */
  getContext: function () {
    return this.getField('context').getNode();
  }
})
.build();

$entity.Document
.forwardBlend($i18n.TranslationDocument, function (properties) {
  var documentKey = properties.entityKey;
  return documentKey && documentKey.documentType === '_translation';
});
