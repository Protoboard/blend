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
   * Identifies the document the field belongs to.
   * @member {$entity.DocumentKey} $entity.FieldKey#parentKey
   */

  /**
   * Identifies the field in the context of the containing document.
   * @member {string} $entity.FieldKey#fieldName
   */

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
   * @memberOf $entity.FieldKey
   * @param {string} fieldRef
   * @param {Object} [properties]
   * @returns {$entity.FieldKey}
   */
  fromString: function (fieldRef, properties) {
    var components = $utils.safeSplit(fieldRef, '/')
    .map(function (component) {
      return $utils.unescape(component, '/');
    });
    return this.create({
      parentKey: $entity.DocumentKey.fromComponents(components[0], components[1]),
      entityName: components[2]
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
      this.parentKey = $entity.DocumentKey.fromComponents(components[1], components[2]);
      this.entityName = components[3];
    }
  },

  /**
   * @param {$entity.FieldKey} fieldKey
   * @returns {boolean}
   */
  equals: function equals(fieldKey) {
    return equals.returned &&
        this.parentKey.equals(fieldKey.parentKey) &&
        this.entityName === fieldKey.entityName;
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
   * @inheritDoc
   * @param childId
   * @returns {$entity.ItemKey}
   */
  getChildKey: function (childId) {
    var documentKey = this.parentKey;
    return $entity.ItemKey.fromComponents(
        documentKey.documentType,
        documentKey.entityName,
        this.entityName,
        childId
    );
  },

  /**
   * @return {$entity.DocumentKey}
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
  var entityPath = properties._entityPath,
      components = entityPath && entityPath.components;
  return components &&
      components.length === 4 &&
      components[0] === 'document';
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
