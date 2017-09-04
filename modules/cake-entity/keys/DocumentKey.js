"use strict";

/**
 * @function $entity.DocumentKey.create
 * @returns {$entity.DocumentKey}
 */

/**
 * Identifies a document entity.
 * @class $entity.DocumentKey
 * @extends $entity.EntityKey
 * @implements $utils.Stringifiable
 */
$entity.DocumentKey = $oop.getClass('$entity.DocumentKey')
.mix($oop.getClass('$entity.EntityKey'))
.implement($utils.Stringifiable)
.define(/** @lends $entity.DocumentKey# */{
  /**
   * Identifies the type of the document.
   * @member {string} $entity.DocumentKey#documentType
   */

  /**
   * Identifies the document in the context of its document type.
   * @member {string} $entity.DocumentKey#documentId
   */

  /**
   * @memberOf $entity.DocumentKey
   * @param {string} documentType
   * @param {string} documentId
   * @returns {$entity.DocumentKey}
   */
  fromComponents: function (documentType, documentId) {
    return this.create({
      documentType: documentType,
      documentId: documentId
    });
  },

  /**
   * @memberOf $entity.DocumentKey
   * @param documentRef
   * @returns {$entity.DocumentKey}
   */
  fromString: function (documentRef) {
    var components = $utils.safeSplit(documentRef, '/');
    return this.create({
      documentType: components[0],
      documentId: components[1]
    });
  },

  /**
   * @param {$entity.DocumentKey} documentKey
   * @returns {boolean}
   */
  equals: function equals(documentKey) {
    return equals.returned &&
        this.documentType === documentKey.documentType &&
        this.documentId === documentKey.documentId;
  },

  /**
   * @inheritDoc
   * @returns {$entity.DocumentKey}
   */
  getConfigKey: function () {
    return $entity.DocumentKey.fromComponents('document', this.documentType);
  },

  /**
   * @inheritDoc
   * @returns {$data.Path}
   */
  getEntityPath: function () {
    return $data.Path.fromComponents([
      'document',
      String(this.documentType),
      String(this.documentId)]);
  },

  ///**
  // * @param {string} fieldName
  // * @returns {$entity.FieldKey}
  // */
  //getFieldKey: function (fieldName) {
  //  return $entity.FieldKey.create(
  //      this.documentType,
  //      this.documentId,
  //      fieldName
  //  );
  //},

  /**
   * Serializes current document key.
   * @example
   * $entity.DocumentKey.create('user', '1234').toString() // "user/1234"
   * @returns {string}
   */
  toString: function () {
    return $utils.escape(this.documentType, '/') + '/' +
        $utils.escape(this.documentId, '/');
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$entity.DocumentKey}
   */
  toDocumentKey: function () {
    return $entity.DocumentKey.fromString(this.valueOf());
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$entity.DocumentKey}
   */
  toDocumentKey: function () {
    return $entity.DocumentKey.fromComponents(this[0], this[1]);
  }
});
