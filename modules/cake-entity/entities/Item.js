"use strict";

/**
 * @function $entity.Item.create
 * @param {object} properties
 * @param {$entity.ItemKey} properties.entityKey
 * @returns {$entity.Item}
 */

/**
 * Items are expected to be primitive.
 * @class $entity.Item
 * @extends $entity.Entity
 * @mixes $entity.SimpleEntityChangeEventSpawner
 */
$entity.Item = $oop.getClass('$entity.Item')
.mix($oop.getClass('$entity.Entity'))
.mix($oop.getClass('$entity.SimpleEntityChangeEventSpawner'))
.define(/** @lends $entity.Item# */{
  /**
   * @inheritDoc
   * @member {$entity.ItemKey} $entity.Item#entityKey
   */

  /**
   * @param {string} documentType
   * @param {string} documentId
   * @param {string} fieldName
   * @param {string} itemId
   * @returns {$entity.Item}
   */
  fromComponents: function (documentType, documentId, fieldName, itemId) {
    return this.create({
      entityKey: $entity.ItemKey.fromComponents(
          documentType, documentId, fieldName, itemId)
    });
  },

  /**
   * @param {string} itemRef
   * @returns {$entity.Item}
   */
  fromString: function (itemRef) {
    return this.create({
      entityKey: $entity.ItemKey.fromString(itemRef)
    });
  },

  /** @ignore */
  spread: function () {
    var itemKey = this.entityKey,
        attributeDocumentKey = itemKey.getAttributeDocumentKey(),
        itemEventPath = itemKey.getEntityPath().clone().unshift('entity'),
        attributeDocumentEventPath = attributeDocumentKey.getEntityPath()
        .clone().unshift('entity'),
        itemTypeKey = itemKey.getItemTypeKey(),
        itemTypePath = itemTypeKey.getEntityPath().clone().unshift('entity'),
        itemIdTypeKey = itemKey.getItemIdTypeKey(),
        itemIdTypePath = itemIdTypeKey.getEntityPath().clone()
        .unshift('entity');

    this.listeningPath = itemEventPath;

    this.triggerPaths = [
      itemEventPath,
      attributeDocumentEventPath,
      itemTypePath,
      // todo Might only need itemType only, as only value is affected.
      itemIdTypePath
    ];
  }
});

// caching Item if key is cached
// todo Remove as soon as forwards propagate
$entity.Item.forwardTo(
    $oop.mixClass($entity.Item, $oop.getClass('$entity.EntityKeyCached')),
    function (properties) {
      var entityKey = properties.entityKey;
      return $utils.StringifyCached.mixedBy(entityKey);
    });

$oop.getClass('$entity.Entity')
.forwardTo($entity.Item, function (properties) {
  return $entity.ItemKey.mixedBy(properties.entityKey);
});

$oop.getClass('$entity.ItemKey')
.delegate(/** @lends $entity.ItemKey# */{
  /**
   * @returns {$entity.Item}
   */
  toItem: function () {
    return $entity.Item.fromEntityKey(this);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$entity.Item}
   */
  toItem: function () {
    return $entity.Item.fromString(this.valueOf());
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$entity.Item}
   */
  toItem: function () {
    return $entity.Item.fromComponents(this[0], this[1], this[2], this[3]);
  }
});
