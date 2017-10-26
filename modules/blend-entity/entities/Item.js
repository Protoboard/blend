"use strict";

/**
 * @function $entity.Item.create
 * @param {object} properties
 * @param {$entity.ItemKey} properties.entityKey
 * @returns {$entity.Item}
 */

/**
 * Items are always treated like leaf nodes.
 * @class $entity.Item
 * @extends $entity.Entity
 * @mixes $entity.LeafNoded
 */
$entity.Item = $oop.getClass('$entity.Item')
.blend($oop.getClass('$entity.Entity'))
.blend($oop.getClass('$entity.LeafNoded'))
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
  init: function () {
    var itemKey = this.entityKey,
        idType = itemKey.getIdType() || 'string',
        idTypePath = $data.Path.fromComponentsToString([
          'entity', 'document', '__field', '__field/itemIdType', 'options',
          idType]),
        valueType = itemKey.getValueType() || 'string',
        valueTypePath = $data.Path.fromComponentsToString([
          'entity', 'document', '__field', '__field/itemValueType', 'options',
          valueType]);

    this
    .addTriggerPath(idTypePath)
    .addTriggerPath(valueTypePath);
  }
});

$oop.getClass('$entity.Entity')
.forwardBlend($entity.Item, function (properties) {
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
