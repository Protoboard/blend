"use strict";

/**
 * @function $entity.FieldKey.create
 * @param {Object} properties
 * @param {$entity.DocumentKey} properties.documentKey
 * @param {string} properties.fieldName
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
   * @member {$entity.DocumentKey} $entity.FieldKey#documentKey
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
      documentKey: $entity.DocumentKey.fromComponents(documentType, documentId),
      fieldName: fieldName
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
      documentKey: $entity.DocumentKey.fromComponents(components[0], components[1]),
      fieldName: components[2]
    }, properties);
  },

  /** @ignore */
  spread: function () {
    var entityPath = this._entityPath,
        components;

    if (entityPath &&
        (!this.documentKey || this.fieldName === undefined)
    ) {
      // we have entity path but not all key components
      components = entityPath.components;
      this.documentKey = $entity.DocumentKey.fromComponents(components[1], components[2]);
      this.fieldName = components[3];
    }
  },

  /**
   * @param {$entity.FieldKey} fieldKey
   * @returns {boolean}
   */
  equals: function equals(fieldKey) {
    return equals.returned &&
        this.documentKey.equals(fieldKey.documentKey) &&
        this.fieldName === fieldKey.fieldName;
  },

  /**
   * @inheritDoc
   * @returns {$entity.DocumentKey}
   */
  getAttributeDocumentKey: function () {
    return $entity.AttributeDocumentKey.fromDocumentIdComponents('__field', [
      this.documentKey.documentType,
      this.fieldName
    ]);
  },

  /**
   * @inheritDoc
   * @param childId
   * @returns {$entity.ItemKey}
   */
  getChildKey: function (childId) {
    var documentKey = this.documentKey;
    return $entity.ItemKey.fromComponents(
        documentKey.documentType,
        documentKey.documentId,
        this.fieldName,
        childId
    );
  },

  /**
   * @return {$entity.DocumentKey}
   */
  getParentKey: function () {
    return this.documentKey;
  },

  /**
   * @return {string}
   */
  getEntityId: function () {
    return this.fieldName;
  },

  /**
   * @inheritDoc
   * @returns {$data.TreePath}
   */
  getEntityPath: function () {
    var documentKey = this.documentKey;
    if (!hOP.call(this, '_entityPath')) {
      this._entityPath = $data.TreePath.fromComponents([
        'document',
        String(documentKey.documentType),
        String(documentKey.documentId),
        String(this.fieldName)]);
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
    var documentKey = this.documentKey;
    return [
      $utils.escape(documentKey.documentType, '/'),
      $utils.escape(documentKey.documentId, '/'),
      $utils.escape(this.fieldName, '/')
    ].join('/');
  }
})
.build();

$entity.FieldKey
.forwardBlend($utils.StringifyCached, function (properties) {
  return $utils.StringifyCached.mixedBy(properties.documentKey);
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
