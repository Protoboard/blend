"use strict";

/**
 * @function $entity.CollectionFieldKey.create
 * @returns {$entity.CollectionFieldKey}
 */

/**
 * Identifies a `CollectionField`. Provides collection-specific attribute
 * getters.
 * @class $entity.CollectionFieldKey
 * @extends $entity.FieldKey
 */
$entity.CollectionFieldKey = $oop.getClass('$entity.CollectionFieldKey')
.blend($oop.getClass('$entity.FieldKey'))
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
// 'collection' field valueType
.forwardBlend($entity.CollectionFieldKey, function (properties) {
  var documentKey = properties.documentKey,
      fieldName = properties.fieldName,
      attributeDocumentKey = documentKey && fieldName &&
          $entity.AttributeDocumentKey.fromDocumentIdComponents('__field', [
            documentKey.documentType,
            fieldName
          ]),
      valueTypePath = attributeDocumentKey && $data.TreePath.fromComponents([
        'document',
        '__field',
        attributeDocumentKey.documentId,
        'valueType'
      ]),
      valueType = valueTypePath && $entity.entities.getNode(valueTypePath);

  return valueType === 'collection';
});
