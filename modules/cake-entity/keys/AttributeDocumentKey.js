"use strict";

/**
 * @function $entity.AttributeDocumentKey.create
 * @param {Object} properties
 * @param {string} properties.documentType
 * @param {string} properties.documentId
 * @returns {$entity.AttributeDocumentKey}
 */

/**
 * Identifies an attribute document entity.
 * @class $entity.AttributeDocumentKey
 * @extends $entity.DocumentKey
 * @mixes $entity.CachedStringifiable
 */
$entity.AttributeDocumentKey = $oop.getClass('$entity.AttributeDocumentKey')
.mix($oop.getClass('$entity.DocumentKey'))
.mix($oop.getClass('$entity.CachedStringifiable'))
.define(/** @lends $entity.AttributeDocumentKey# */{
  /**
   * @memberOf $entity.AttributeDocumentKey
   * @param {string} documentType
   * @param {Array.<string>} components
   * @returns {$entity.CachedStringifiable}
   */
  fromMetaComponents: function (documentType, components) {
    return this.create({
      documentType: documentType,
      documentId: components
      .map(function (component) {
        return $utils.escape(component, '/');
      })
      .join('/')
    });
  }
});

$oop.getClass('$entity.DocumentKey')
.forwardTo($entity.AttributeDocumentKey, function (properties) {
  return $utils.matchesPrefix(properties.documentType, '__');
});
