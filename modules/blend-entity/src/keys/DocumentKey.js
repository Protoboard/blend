"use strict";

/**
 * @function $entity.DocumentKey.create
 * @param {Object} properties
 * @param {string} properties.documentType
 * @param {string} properties.entityName
 * @returns {$entity.DocumentKey}
 */

/**
 * Identifies a document entity.
 * @class $entity.DocumentKey
 * @extends $entity.EntityKey
 * @implements $utils.Stringifiable
 */
$entity.DocumentKey = $oop.createClass('$entity.DocumentKey')
.blend($entity.EntityKey)
.implement($utils.Stringifiable)
.define(/** @lends $entity.DocumentKey# */{
  /**
   * Identifies the type of the document.
   * @member {string} $entity.DocumentKey#documentType
   */

  /**
   * @memberOf $entity.DocumentKey
   * @param {$data.TreePath} entityPath
   * @param {Object} [properties]
   * @returns {$entity.DocumentKey}
   */
  fromEntityPath: function (entityPath, properties) {
    var components = entityPath.components;
    return this.create({
      documentType: components[1],
      entityName: components[2]
    }, properties);
  },

  /**
   * @memberOf $entity.DocumentKey
   * @param {string} reference
   * @param {Object} [properties]
   * @returns {$entity.DocumentKey}
   */
  fromString: function (reference, properties) {
    var components = $utils.safeSplit(reference, '/')
    .map(function (component) {
      return $utils.unescape(component, '/');
    });
    return this.create({
      documentType: components[0],
      entityName: components[1]
    }, properties);
  },

  /**
   * @memberOf $entity.DocumentKey
   * @param {string} documentType
   * @param {string} documentId
   * @param {Object} [properties]
   * @returns {$entity.DocumentKey}
   */
  fromComponents: function (documentType, documentId, properties) {
    return this.create({
      documentType: documentType,
      entityName: documentId
    }, properties);
  },

  /**
   * @param {$entity.DocumentKey} documentKey
   * @returns {boolean}
   */
  equals: function equals(documentKey) {
    return equals.returned &&
        this.documentType === documentKey.documentType;
  },

  /**
   * @inheritDoc
   * @returns {$entity.AttributeDocumentKey}
   */
  getAttributeDocumentKey: function () {
    return $entity.AttributeDocumentKey.fromDocumentIdComponents(
        '__document', [this.documentType]);
  },

  /**
   * @returns {$data.TreePath}
   */
  getEntityPath: function () {
    if (!hOP.call(this, '_entityPath')) {
      this._entityPath = $data.TreePath.fromComponents([
        'document',
        String(this.documentType),
        String(this.entityName)]);
    }
    return this._entityPath;
  },

  /**
   * @inheritDoc
   * @returns {string}
   */
  getNodeType: function getNodeType() {
    return getNodeType.returned || 'branch';
  },

  /**
   * Retrieves field names associated with teh current document's documentType.
   * @returns {Array.<string>}
   */
  getFieldNames: function () {
    return this.getAttribute('fields');
  },

  /**
   * @param {string} fieldName
   * @returns {$entity.FieldKey}
   */
  getFieldKey: function (fieldName) {
    return this.getChildKey(fieldName);
  },

  /**
   * Serializes current document key.
   * @example
   * $entity.DocumentKey.create('user', '1234').toString() // "user/1234"
   * @returns {string}
   */
  toString: function () {
    return $utils.escape(this.documentType, '/') + '/' +
        $utils.escape(this.entityName, '/');
  }
})
.build();

$entity.EntityKey
.forwardBlend($entity.DocumentKey, function (properties) {
  return properties.parentKey === undefined &&
      properties.documentType !== undefined;
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.DocumentKey}
   */
  toDocumentKey: function (properties) {
    return $entity.DocumentKey.fromString(this.valueOf(), properties);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.DocumentKey}
   */
  toDocumentKey: function (properties) {
    return $entity.DocumentKey.fromComponents(this[0], this[1], properties);
  }
});
