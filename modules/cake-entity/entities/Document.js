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

  /** @ignore */
  spread: function () {
    var documentKey = this.entityKey,
        metaKey = documentKey.getMetaKey(),
        documentEventPath = documentKey.getEntityPath().unshift('entity'),
        metaEventPath = metaKey.getEntityPath().unshift('entity');

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
