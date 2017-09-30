"use strict";

/**
 * @function $entity.Field.create
 * @param {object} properties
 * @param {$entity.FieldKey} properties.entityKey
 * @returns {$entity.Field}
 */

/**
 * @class $entity.Field
 * @extends $entity.Entity
 */
$entity.Field = $oop.getClass('$entity.Field')
.mix($oop.getClass('$entity.Entity'))
.define(/** @lends $entity.Field# */{
  /**
   * @inheritDoc
   * @member {$entity.FieldKey} $entity.Field#entityKey
   */

  /**
   * @param {string} documentType
   * @param {string} documentId
   * @param {string} fieldName
   * @returns {$entity.Field}
   */
  fromComponents: function (documentType, documentId, fieldName) {
    return this.create({
      entityKey: $entity.FieldKey.fromComponents(documentType, documentId, fieldName)
    });
  },

  /**
   * @param {string} fieldRef
   * @returns {$entity.Field}
   */
  fromString: function (fieldRef) {
    return this.create({
      entityKey: $entity.FieldKey.fromString(fieldRef)
    });
  },

  /** @ignore */
  spread: function () {
    var fieldKey = this.entityKey,
        fieldEventPath = fieldKey.getEntityPath().clone().unshift('entity'),
        attributeDocumentKey = fieldKey.getAttributeDocumentKey(),
        attributeDocumentEventPath = attributeDocumentKey.getEntityPath()
        .clone().unshift('entity'),
        fieldTypeKey = fieldKey.getNodeTypeKey(),
        fieldTypePath = fieldTypeKey.getEntityPath().clone().unshift('entity');

    this.listeningPath = fieldEventPath;

    this.triggerPaths = [
      fieldEventPath,
      attributeDocumentEventPath,
      fieldTypePath
    ];
  },

  /** @ignore */
  getItem: function (itemId) {
    return $entity.Item.fromEntityKey(this.entityKey.getItemKey(itemId));
  }
});

$entity.Field
// caching Field if key is cached
// todo Remove as soon as forwards propagate
.forwardTo(
    $oop.mixClass($entity.Field, $oop.getClass('$entity.EntityKeyCached')),
    function (properties) {
      var entityKey = properties.entityKey;
      return $utils.StringifyCached.mixedBy(entityKey);
    })
// leaf node fields
.forwardTo(
    $oop.mixClass($entity.Field, $oop.getClass('$entity.SimpleEntityChangeEventSpawner')),
    function (properties) {
      var fieldKey = properties && properties.entityKey;
      return fieldKey && fieldKey.getNodeType() === 'leaf';
    });

$oop.getClass('$entity.Entity')
.forwardTo($entity.Field, function (properties) {
  return $entity.FieldKey.mixedBy(properties.entityKey);
});

$oop.getClass('$entity.FieldKey')
.delegate(/** @lends $entity.FieldKey# */{
  /**
   * @returns {$entity.Field}
   */
  toField: function () {
    return $entity.Field.fromEntityKey(this);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$entity.Field}
   */
  toField: function () {
    return $entity.Field.fromString(this.valueOf());
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$entity.Field}
   */
  toField: function () {
    return $entity.Field.fromComponents(this[0], this[1], this[2]);
  }
});
