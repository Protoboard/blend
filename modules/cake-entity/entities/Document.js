"use strict";

/**
 * @function $entity.Document.create
 * @returns {$entity.Document}
 */

/**
 * @class $entity.Document
 * @extends $entity.Entity
 */
$entity.Document = $oop.getClass('$entity.Document')
.mix($oop.getClass('$entity.Entity'))
.define(/** @lends $entity.Document# */{
  /**
   * @inheritDoc
   * @member {$entity.DocumentKey} $entity.Document#entityKey
   */

  /**
   * @param {string} documentType
   * @param {string} documentId
   * @returns {$entity.Document}
   */
  fromComponents: function (documentType, documentId) {
    return this.create({
      entityKey: $entity.DocumentKey.fromComponents(documentType, documentId)
    });
  },

  /**
   * @param {string} documentRef
   * @returns {$entity.Document}
   */
  fromString: function (documentRef) {
    return this.create({
      entityKey: $entity.DocumentKey.fromString(documentRef)
    });
  },

  /** @ignore */
  spread: function () {
    var documentKey = this.entityKey,
        metaKey = documentKey.getMetaKey(),
        documentEventPath = documentKey.getEntityPath().clone()
        .unshift('entity'),
        metaEventPath = metaKey.getEntityPath().clone().unshift('entity');

    this.listeningPath = documentEventPath;

    this.triggerPaths = [
      documentEventPath,
      // todo We'll need document type meta field's path here
      metaEventPath
    ];
  },

  /**
   * Retrieves a `Field` entity belonging to the current document, for the
   * specified `fieldName`.
   * @param {string} fieldName
   * @returns {$entity.FieldKey}
   */
  getField: function (fieldName) {
    return $entity.Field.fromEntityKey(this.entityKey.getFieldKey(fieldName));
  }
});

$oop.getClass('$entity.Entity')
.forwardTo($oop.getClass('$entity.Document'), function (properties) {
  return $entity.DocumentKey.mixedBy(properties.entityKey);
});

$oop.getClass('$entity.DocumentKey')
.delegate(/** @lends $entity.DocumentKey# */{
  /**
   * @returns {$entity.Document}
   */
  toDocument: function () {
    return $entity.Document.fromEntityKey(this);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$entity.Document}
   */
  toDocument: function () {
    return $entity.Document.fromString(this.valueOf());
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$entity.Document}
   */
  toDocument: function () {
    return $entity.Document.fromComponents(this[0], this[1]);
  }
});
