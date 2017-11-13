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
 * @mixes $utils.StringifyCached
 */
$entity.AttributeDocumentKey = $oop.getClass('$entity.AttributeDocumentKey')
.blend($oop.getClass('$entity.DocumentKey'))
.blend($oop.getClass('$utils.StringifyCached'))
.define(/** @lends $entity.AttributeDocumentKey# */{
  /**
   * @memberOf $entity.AttributeDocumentKey
   * @param {string} documentType
   * @param {Array.<string>} components
   * @param {Object} [properties]
   * @returns {$entity.AttributeDocumentKey}
   */
  fromDocumentIdComponents: function (documentType, components, properties) {
    return this.create({
      documentType: documentType,
      documentId: components
      .map(function (component) {
        return $utils.escape(component, '/');
      })
      .join('/')
    }, properties);
  }
});

$oop.getClass('$entity.DocumentKey')
.forwardBlend($utils.StringifyCached, function (properties) {
  return $utils.matchesPrefix(properties.documentType, '__');
});
