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
$entity.Field = $oop.createClass('$entity.Field')
.blend($entity.Entity)
.define(/** @lends $entity.Field# */{
  /**
   * @inheritDoc
   * @member {$entity.FieldKey} $entity.Field#entityKey
   */

  /**
   * @param {string} documentType
   * @param {string} documentId
   * @param {string} fieldName
   * @param {Object} [properties]
   * @returns {$entity.Field}
   */
  fromComponents: function (documentType, documentId, fieldName, properties) {
    return this.create({
      entityKey: $entity.FieldKey.fromComponents(documentType, documentId, fieldName)
    }, properties);
  },

  /**
   * @param {string} fieldRef
   * @param {Object} [properties]
   * @returns {$entity.Field}
   */
  fromString: function (fieldRef, properties) {
    return this.create({
      entityKey: $entity.FieldKey.fromString(fieldRef)
    }, properties);
  },

  /** @ignore */
  init: function () {
    var fieldKey = this.entityKey,
        valueType = fieldKey.getValueType() || 'string',
        // same as $entity.FieldValueTypePath.fromFieldValueType() but
        // skipping a few steps
        // todo We don't need this for all field value types
        valueTypePath = $data.TreePath.fromComponentsToString([
          'entity', 'document', '__field', '__field/valueType', 'options',
          valueType]);

    this.addTriggerPath(valueTypePath);
  },

  /** @ignore */
  getItem: function (itemId) {
    return $entity.Item.fromEntityKey(this.entityKey.getItemKey(itemId));
  }
})
.build();

$entity.Field
// leaf node fields
.forwardBlend($entity.LeafNoded, function (properties) {
  var fieldKey = properties && properties.entityKey;
  // todo Need better way of specifying mutually exclusive mixins
  return !this.mixes($entity.BranchNoded) &&
      fieldKey && fieldKey.getNodeType() === 'leaf';
});

$entity.Entity
.forwardBlend($entity.Field, function (properties) {
  return $entity.FieldKey.mixedBy(properties.entityKey);
});

$entity.FieldKey
.delegate(/** @lends $entity.FieldKey# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.Field}
   */
  toField: function (properties) {
    return $entity.Field.fromEntityKey(this, properties);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.Field}
   */
  toField: function (properties) {
    return $entity.Field.fromString(this.valueOf(), properties);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.Field}
   */
  toField: function (properties) {
    return $entity.Field.fromComponents(this[0], this[1], this[2], properties);
  }
});
