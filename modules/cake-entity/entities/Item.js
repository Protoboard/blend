"use strict";

/**
 * @function $entity.Item.create
 * @returns {$entity.Item}
 */

/**
 * @class $entity.Item
 * @extends $entity.Entity
 */
$entity.Item = $oop.getClass('$entity.Item')
.mix($oop.getClass('$entity.Entity'))
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
        metaKey = itemKey.getMetaKey(),
        itemEventPath = itemKey.getEntityPath().unshift('entity'),
        metaEventPath = metaKey.getEntityPath().unshift('entity');

    this.listeningPath = itemEventPath;

    this.triggerPaths = [
      itemEventPath,
      // todo We'll need itemId and item value type path here
      metaEventPath
    ];
  }
});

$oop.getClass('$entity.Entity')
.forward($oop.getClass('$entity.Item'), function (properties) {
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
