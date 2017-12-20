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
 * @implements $utils.Stringifiable
 */
$entity.ItemKey = $oop.createClass('$entity.ItemKey')
.blend($entity.EntityKey)
.blend($entity.ValueKey)
.implement($utils.Stringifiable)
.define(/** @lends $entity.ItemKey# */{
  /**
   * Identifies the collection field the item belongs to.
   * @todo Somehow this should be cached for items belonging to the same field.
   * @member {$entity.CollectionFieldKey} $entity.ItemKey#fieldKey
   */

  /**
   * Identifies the item in the context of the containing field.
   * @member {string} $entity.ItemKey#itemId
   */

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
   * @memberOf $entity.ItemKey
   * @param {string} itemRef
   * @param {Object} [properties]
   * @returns {$entity.ItemKey}
   */
  fromString: function (itemRef, properties) {
    var components = $utils.safeSplit(itemRef, '/')
    .map(function (component) {
      return $utils.unescape(component, '/');
    });
    return this.create({
      parentKey: $entity.CollectionFieldKey.fromComponents(
          components[0], components[1], components[2]),
      entityName: components[3]
    }, properties);
  },

  /** @ignore */
  spread: function () {
    var entityPath = this._entityPath,
        components;

    if (entityPath &&
        (!this.parentKey || this.entityName === undefined)
    ) {
      // we have entity path but not all key components
      components = entityPath.components;
      this.parentKey = $entity.CollectionFieldKey.fromComponents(
          components[1], components[2], components[3]);
      this.entityName = components[4];
    }
  },

  /**
   * @param {$entity.ItemKey} itemKey
   * @returns {boolean}
   */
  equals: function equals(itemKey) {
    return equals.returned &&
        this.parentKey.equals(itemKey.parentKey) &&
        this.entityName === itemKey.entityName;
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
   * @return {$entity.CollectionFieldKey}
   */
  getParentKey: function () {
    return this.parentKey;
  },

  /**
   * @return {string}
   */
  getEntityName: function () {
    return this.entityName;
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
  var entityPath = properties._entityPath,
      components = entityPath && entityPath.components;
  return components &&
      components.length === 5 &&
      components[0] === 'document';
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.ItemKey}
   */
  toItemKey: function (properties) {
    return $entity.ItemKey.fromString(this.valueOf(), properties);
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
