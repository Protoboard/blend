"use strict";

/**
 * @function $entity.FieldKey.create
 * @param {Object} properties
 * @param {string} properties.documentType
 * @param {string} properties.documentId
 * @param {string} properties.fieldName
 * @returns {$entity.FieldKey}
 */

/**
 * Identifies a field entity.
 * @class $entity.FieldKey
 * @extends $entity.EntityKey
 * @implements $utils.Stringifiable
 */
$entity.FieldKey = $oop.getClass('$entity.FieldKey')
.mix($oop.getClass('$entity.EntityKey'))
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
    var components = $utils.safeSplit(fieldRef, '/');
    return this.create({
      documentKey: $entity.DocumentKey.fromComponents(components[0], components[1]),
      fieldName: components[2]
    });
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
  getConfigKey: function () {
    // todo This could be the id of a meta document key
    var metaId = $utils.escape(this.documentKey.documentType, '/') + '/' +
        $utils.escape(this.fieldName, '/');
    return $entity.DocumentKey.fromComponents('field', metaId);
  },

  /**
   * @inheritDoc
   * @returns {$data.Path}
   */
  getEntityPath: function () {
    return $data.Path.fromComponents([
      'document',
      String(this.documentType),
      String(this.documentId),
      String(this.fieldName)]);
  },

  ///**
  // * @param {string} itemId
  // * @returns {$entity.ItemKey}
  // */
  //getItemKey: function (itemId) {
  //  var documentKey = this.documentKey;
  //  return $entity.ItemKey.create(
  //      documentKey.documentType,
  //      documentKey.documentId,
  //      this.fieldName,
  //      itemId
  //  );
  //},

  /**
   * Serializes current document key.
   * @example
   * $entity.FieldKey.create('user', '1234').toString() // "user/1234"
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
