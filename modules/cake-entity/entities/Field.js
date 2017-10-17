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
.blend($oop.getClass('$entity.Entity'))
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
        valueType = fieldKey.getValueType() || 'string',
        valueTypePath = $data.Path.fromComponents([
          'entity', 'document', '__field', '__field/valueType', 'options',
          valueType]);

    this.triggerPaths.push(valueTypePath);
  },

  /** @ignore */
  getItem: function (itemId) {
    return $entity.Item.fromEntityKey(this.entityKey.getItemKey(itemId));
  }
});

$entity.Field
// leaf node fields
.forwardMix($oop.getClass('$entity.LeafNoded'), function (properties) {
  var fieldKey = properties && properties.entityKey;
  // todo Need better way of specifying mutually exclusive
  return !this.mixes($entity.BranchNoded) &&
      fieldKey && fieldKey.getNodeType() === 'leaf';
});

$oop.getClass('$entity.Entity')
.forwardMix($entity.Field, function (properties) {
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
