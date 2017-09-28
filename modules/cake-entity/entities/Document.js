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
        attributeDocumentKey = documentKey.getAttributeDocumentKey(),
        documentEventPath = documentKey.getEntityPath().clone()
        .unshift('entity'),
        attributeDocumentEventPath = attributeDocumentKey.getEntityPath()
        .clone().unshift('entity');

    this.listeningPath = documentEventPath;

    this.triggerPaths = [
      documentEventPath,
      attributeDocumentEventPath
    ];
  },

  /**
   * @returns {Array.<string>}
   * @todo Make it on demand.
   */
  getFieldNames: function () {
    var documentKey = this.entityKey,
        attributeDocument = $entity.DocumentKey
        .fromComponents('__document', documentKey.documentType)
        .toDocument();
    return attributeDocument.getField('fields').getNode();
  },

  /**
   * Spawns events for document entity change.
   * @param {$data.Tree} entitiesBefore
   * @param {$data.Tree} entitiesAfter
   * @returns {Array.<$entity.EntityChangeEvent>}
   */
  spawnEntityChangeEvents: function (entitiesBefore, entitiesAfter) {
    var document = this,
        fieldNames = this.getFieldNames();

    // delegating event spawning to fields
    return fieldNames
    .reduce(function (spawnedEvents, fieldName) {
      var events = document.getField(fieldName)
      .spawnEntityChangeEvents(entitiesBefore, entitiesAfter);
      return spawnedEvents.concat(events);
    }, []);
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

// caching Document if key is cached
// todo Remove as soon as forwards propagate
$entity.Document.forwardTo(
    $oop.mixClass($entity.Document, $oop.getClass('$entity.EntityKeyCached')),
    function (properties) {
      var entityKey = properties.entityKey;
      return $utils.StringifyCached.mixedBy(entityKey);
    });

$oop.getClass('$entity.Entity')
.forwardTo($entity.Document, function (properties) {
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
