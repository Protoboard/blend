"use strict";

/**
 * @function $entity.FieldKey.create
 * @param {Object} properties
 * @param {$entity.DocumentKey} properties.parentKey
 * @param {string} properties.entityName
 * @returns {$entity.FieldKey}
 */

/**
 * Identifies a field entity.
 * @class $entity.FieldKey
 * @extends $entity.EntityKey
 * @mixes $entity.ValueKey
 * @implements $utils.Stringifiable
 * @todo Cache attributeDocumentKey, nodeType, nodeTypeKey
 */
$entity.FieldKey = $oop.createClass('$entity.FieldKey')
.blend($entity.EntityKey)
.blend($entity.ValueKey)
.implement($utils.Stringifiable)
.define(/** @lends $entity.FieldKey# */{
  /**
   * @memberOf $entity.FieldKey
   * @param {$data.TreePath} entityPath
   * @param {Object} [properties]
   * @returns {$entity.FieldKey}
   */
  fromEntityPath: function (entityPath, properties) {
    var components = entityPath.components;
    return this.create({
      parentKey: $entity.DocumentKey.fromComponents(components[1], components[2]),
      entityName: components[3]
    }, properties);
  },

  /**
   * @memberOf $entity.FieldKey
   * @param {string} reference
   * @param {Object} [properties]
   * @returns {$entity.FieldKey}
   */
  fromString: function (reference, properties) {
    var components = $utils.safeSplit(reference, '/')
    .map(function (component) {
      return $utils.unescape(component, '/');
    });
    return this.create({
      parentKey: $entity.DocumentKey.fromComponents(components[0], components[1]),
      entityName: components[2]
    }, properties);
  },

  /**
   * @memberOf $entity.FieldKey
   * @param {string} documentType
   * @param {string} documentId
   * @param {string} fieldName
   * @param {Object} [properties]
   * @returns {$entity.FieldKey}
   */
  fromComponents: function (documentType, documentId, fieldName, properties) {
    return this.create({
      parentKey: $entity.DocumentKey.fromComponents(documentType, documentId),
      entityName: fieldName
    }, properties);
  },

  /**
   * @inheritDoc
   * @returns {$entity.DocumentKey}
   */
  getAttributeDocumentKey: function () {
    return $entity.AttributeDocumentKey.fromDocumentIdComponents('__field', [
      this.parentKey.documentType,
      this.entityName
    ]);
  },

  /**
   * @returns {$data.TreePath}
   */
  getEntityPath: function () {
    var documentKey = this.parentKey;
    if (!hOP.call(this, '_entityPath')) {
      this._entityPath = $data.TreePath.fromComponents([
        'document',
        String(documentKey.documentType),
        String(documentKey.entityName),
        String(this.entityName)]);
    }
    return this._entityPath;
  },

  /**
   * @param {string} itemId
   * @returns {$entity.ItemKey}
   */
  getItemKey: function (itemId) {
    return this.getChildKey(itemId);
  },

  /**
   * Serializes current field key.
   * @example
   * $entity.FieldKey.fromComponents('user', '1234', 'name').toString()
   * // "user/1234/name"
   * @returns {string}
   */
  toString: function () {
    var documentKey = this.parentKey;
    return [
      $utils.escape(documentKey.documentType, '/'),
      $utils.escape(documentKey.entityName, '/'),
      $utils.escape(this.entityName, '/')
    ].join('/');
  }
})
.build();

$entity.FieldKey
.forwardBlend($utils.StringifyCached, function (properties) {
  return $utils.StringifyCached.mixedBy(properties.parentKey);
});

$entity.EntityKey
.forwardBlend($entity.FieldKey, function (properties) {
  return $entity.DocumentKey.mixedBy(properties.parentKey);
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.FieldKey}
   */
  toFieldKey: function (properties) {
    return $entity.FieldKey.fromString(this.valueOf(), properties);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.FieldKey}
   */
  toFieldKey: function (properties) {
    return $entity.FieldKey.fromComponents(
        this[0], this[1], this[2], properties);
  }
});
