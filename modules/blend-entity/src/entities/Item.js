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
$entity.Item = $oop.createClass('$entity.Item')
.blend($entity.Entity)
.blend($entity.LeafNoded)
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
   * @param {Object} [properties]
   * @returns {$entity.Item}
   */
  fromComponents: function (documentType, documentId, fieldName, itemId,
      properties
  ) {
    return this.create({
      entityKey: $entity.ItemKey.fromComponents(
          documentType, documentId, fieldName, itemId)
    }, properties);
  },

  /**
   * @param {string} itemRef
   * @param {Object} [properties]
   * @returns {$entity.Item}
   */
  fromString: function (itemRef, properties) {
    return this.create({
      entityKey: $entity.ItemKey.fromString(itemRef)
    }, properties);
  },

  /** @ignore */
  init: function () {
    var itemKey = this.entityKey,
        idType = itemKey.getIdType() || 'string',
        // same as $entity.ItemIdTypePath.fromItemIdType() but skipping a few
        // steps
        idTypePath = 'entity.document.__field.__field/itemIdType.options.' +
            $data.escapeTreePathComponent(idType),
        valueType = itemKey.getValueType() || 'string',
        // same as $entity.ItemValueTypePath.fromItemValueType() but skipping a
        // few steps
        valueTypePath = 'entity.document.__field.__field/itemValueType.options.' +
            $data.escapeTreePathComponent(valueType);

    this
    .addTriggerPath(idTypePath)
    .addTriggerPath(valueTypePath);
  }
})
.build();

$entity.Entity
.forwardBlend($entity.Item, function (properties) {
  return $entity.ItemKey.mixedBy(properties.entityKey);
});

$entity.ItemKey
.delegate(/** @lends $entity.ItemKey# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.Item}
   */
  toItem: function (properties) {
    return $entity.Item.fromEntityKey(this, properties);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.Item}
   */
  toItem: function (properties) {
    return $entity.Item.fromString(this.valueOf(), properties);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.Item}
   */
  toItem: function (properties) {
    return $entity.Item.fromComponents(
        this[0], this[1], this[2], this[3], properties);
  }
});
