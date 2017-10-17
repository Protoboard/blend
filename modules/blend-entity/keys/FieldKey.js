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
$entity.FieldKey = $oop.getClass('$entity.FieldKey')
.blend($oop.getClass('$entity.EntityKey'))
.blend($oop.getClass('$entity.ValueKey'))
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
   * @returns {$entity.FieldKey}
   */
  fromComponents: function (documentType, documentId, fieldName) {
    return this.create({
      documentKey: $entity.DocumentKey.fromComponents(documentType, documentId),
      fieldName: fieldName
    });
  },

  /**
   * @memberOf $entity.FieldKey
   * @param {string} fieldRef
   * @returns {$entity.FieldKey}
   */
  fromString: function (fieldRef) {
    var components = $utils.safeSplit(fieldRef, '/')
    .map(function (component) {
      return $utils.unescape(component, '/');
    });
    return this.create({
      documentKey: $entity.DocumentKey.fromComponents(components[0], components[1]),
      fieldName: components[2]
    });
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
   * @inheritDoc
   * @returns {$data.Path}
   */
  getEntityPath: function () {
    var documentKey = this.documentKey;
    if (!hOP.call(this, '_entityPath')) {
      this._entityPath = $data.Path.fromComponents([
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
});

$entity.FieldKey
.forwardMix($oop.getClass('$utils.StringifyCached'), function (properties) {
  return $utils.StringifyCached.mixedBy(properties.documentKey);
});

$oop.getClass('$entity.EntityKey')
.forwardMix($entity.FieldKey, function (properties) {
  var entityPath = properties._entityPath,
      components = entityPath && entityPath.components;
  return components &&
      components.length === 4 &&
      components[0] === 'document';
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$entity.FieldKey}
   */
  toFieldKey: function () {
    return $entity.FieldKey.fromString(this.valueOf());
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$entity.FieldKey}
   */
  toFieldKey: function () {
    return $entity.FieldKey.fromComponents(this[0], this[1], this[2]);
  }
});

$oop.copyProperties($assert, /** @lends $assert */{
  /**
   * @param {$entity.FieldKey} expr
   * @param {string} [message]
   * @returns {$assert}
   */
  isFieldKey: function (expr, message) {
    return $assert.assert(
        $entity.FieldKey.mixedBy(expr), message);
  },

  /**
   * @param {$entity.FieldKey} [expr]
   * @param {string} [message]
   * @returns {$assert}
   */
  isFieldKeyOptional: function (expr, message) {
    return $assert.assert(
        expr === undefined ||
        $entity.FieldKey.mixedBy(expr), message);
  }
});
