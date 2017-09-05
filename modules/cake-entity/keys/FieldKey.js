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
    var eventPath = this.getEntityPath().unshift('entity'),
        documentKey = this.documentKey;

    this.listeningPath = eventPath;

    // todo This could be the id of a meta document key
    var metaId = $utils.escape(documentKey.documentType, '/') + '/' +
        $utils.escape(this.fieldName, '/');

    this.triggerPaths = [
      eventPath, // signals that the field has changed
      // todo Should come from a cached meta key of sorts.
      $data.Path.fromComponents(['entity-meta', 'field', metaId]),
      $data.Path.fromComponents(['entity-meta', 'field'])
    ];
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
  getMetaKey: function () {
    return $entity.MetaKey.fromMetaComponents('field', [
      this.documentKey.documentType,
      this.fieldName
    ]);
  },

  /**
   * @inheritDoc
   * @returns {$data.Path}
   */
  getEntityPath: function () {
    var documentKey = this.documentKey;
    return $data.Path.fromComponents([
      'document',
      String(documentKey.documentType),
      String(documentKey.documentId),
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
