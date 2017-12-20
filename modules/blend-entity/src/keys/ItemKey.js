"use strict";

/**
 * @function $entity.ItemKey.create
 * @param {Object} properties
 * @param {$entity.parentKey} properties.parentKey
 * @param {string} properties.entityName
 * @returns {$entity.ItemKey}
 */

/**
 * Identifies a collection item entity.
 * @class $entity.ItemKey
 * @extends $entity.EntityKey
 * @mixes $entity.ValueKey
 */
$entity.ItemKey = $oop.createClass('$entity.ItemKey')
.blend($entity.EntityKey)
.blend($entity.ValueKey)
.define(/** @lends $entity.ItemKey# */{
  /**
   * @memberOf $entity.DocumentKey
   * @param {$data.TreePath} entityPath
   * @param {Object} [properties]
   * @returns {$entity.DocumentKey}
   */
  fromEntityPath: function (entityPath, properties) {
    var components = entityPath.components;
    return this.create({
      parentKey: $entity.CollectionFieldKey.fromComponents(
          components[1], components[2], components[3]),
      entityName: components[4]
    }, properties);
  },

  /**
   * @memberOf $entity.ItemKey
   * @param {string} reference
   * @param {Object} [properties]
   * @returns {$entity.ItemKey}
   */
  fromReference: function (reference, properties) {
    var components = $utils.safeSplit(reference, '/')
    .map(function (component) {
      return $utils.unescape(component, '/');
    });
    return this.create({
      parentKey: $entity.CollectionFieldKey.fromComponents(
          components[0], components[1], components[2]),
      entityName: components[3]
    }, properties);
  },

  /**
   * @memberOf $entity.ItemKey
   * @param {string} documentType
   * @param {string} documentId
   * @param {string} fieldName
   * @param {string} itemId
   * @param {Object} [properties]
   * @returns {$entity.ItemKey}
   */
  fromComponents: function (documentType, documentId, fieldName, itemId,
      properties
  ) {
    return this.create({
      parentKey: $entity.CollectionFieldKey.fromComponents(
          documentType, documentId, fieldName),
      entityName: itemId
    }, properties);
  },

  /**
   * @inheritDoc
   * @returns {$entity.DocumentKey}
   */
  getAttributeDocumentKey: function () {
    var fieldKey = this.parentKey;
    return $entity.AttributeDocumentKey.fromDocumentIdComponents('__field', [
      fieldKey.parentKey.documentType,
      fieldKey.entityName
    ]);
  },

  /**
   * @inheritDoc
   * @returns {$data.TreePath}
   */
  getEntityPath: function () {
    var fieldKey = this.parentKey,
        documentKey = fieldKey.parentKey;
    if (!hOP.call(this, '_entityPath')) {
      this._entityPath = $data.TreePath.fromComponents([
        'document',
        String(documentKey.documentType),
        String(documentKey.entityName),
        String(fieldKey.entityName),
        String(this.entityName)]);
    }
    return this._entityPath;
  },

  /**
   * @returns {string}
   */
  getIdType: function () {
    return this.getAttribute('itemIdType');
  },

  /**
   * @returns {string}
   */
  getValueType: function getValueType() {
    return getValueType.returned || this.getAttribute('itemValueType');
  },

  /**
   * Serializes current field key.
   * @example
   * $entity.ItemKey.fromComponents('user', '1234', 'name').toString()
   * // "user/1234/name"
   * @returns {string}
   */
  toString: function () {
    var fieldKey = this.parentKey,
        documentKey = fieldKey.parentKey;
    return [
      $utils.escape(documentKey.documentType, '/'),
      $utils.escape(documentKey.entityName, '/'),
      $utils.escape(fieldKey.entityName, '/'),
      $utils.escape(this.entityName, '/')
    ].join('/');
  }
})
.build();

$entity.ItemKey
.forwardBlend($utils.StringifyCached, function (properties) {
  return $utils.StringifyCached.mixedBy(properties.parentKey);
});

$entity.EntityKey
.forwardBlend($entity.ItemKey, function (properties) {
  return $entity.CollectionFieldKey.mixedBy(properties.parentKey);
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.ItemKey}
   */
  toItemKey: function (properties) {
    return $entity.ItemKey.fromReference(this.valueOf(), properties);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.ItemKey}
   */
  toItemKey: function (properties) {
    return $entity.ItemKey.fromComponents(
        this[0], this[1], this[2], this[3], properties);
  }
});
