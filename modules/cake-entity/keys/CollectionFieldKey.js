"use strict";

/**
 * @function $entity.CollectionFieldKey.create
 * @returns {$entity.CollectionFieldKey}
 */

/**
 * @class $entity.CollectionFieldKey
 */
$entity.CollectionFieldKey = $oop.getClass('$entity.CollectionFieldKey')
.mix($oop.getClass('$entity.FieldKey'))
.define(/** @lends $entity.CollectionFieldKey# */{
  /**
   * Retrieves type associated with collection's item IDs (keys).
   * @returns {string}
   */
  getItemIdType: function () {
    return this.getAttribute('itemIdType');
  },

  /**
   * Retrieves options for collection's item IDs (keys).
   * @returns {string}
   */
  getItemIdOptions: function () {
    return this.getAttribute('itemIdOptions');
  },

  /**
   * Retrieves type associated with collection's item values.
   * @returns {string}
   */
  getItemValueType: function () {
    return this.getAttribute('itemValueType');
  },

  /**
   * Retrieves options for collection's item values.
   * @returns {string}
   */
  getItemValueOptions: function () {
    return this.getAttribute('itemValueOptions');
  }
});

$oop.getClass('$entity.FieldKey')
.forwardTo($entity.CollectionFieldKey, function (properties) {
  var attributeDocumentKey = $entity.FieldKey.getAttributeDocumentKey.call(properties),
      valueTypePath = $data.Path.fromComponents([
        'document',
        '__field',
        attributeDocumentKey.documentId,
        'valueType'
      ]),
      valueType = $entity.entities.getNode(valueTypePath);

  return valueType === 'collection';
});
